import { useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Image ke pixels ko sample karke particle positions + colors banata hai.
 * Dark/near-black pixels skip ho jate hain — isliye plain/dark background
 * wali photo best result degi (silhouette jaisa effect aayega).
 */
function sampleImageToPoints(image, step = 4) {
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0)
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const positions = []
    const colors = []
    const aspect = canvas.width / canvas.height

    for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4
            const r = data[i] / 255
            const g = data[i + 1] / 255
            const b = data[i + 2] / 255
            const brightness = (r + g + b) / 3

            if (brightness < 0.07) continue

            // Normalize coordinate system
            const px = (x / canvas.width - 0.5) * 6 * aspect
            const py = -(y / canvas.height - 0.5) * 6

            positions.push(px, py, 0)
            colors.push(r, g, b)
        }
    }

    return {
        positions: new Float32Array(positions),
        colors: new Float32Array(colors)
    }
}

function ParticleField({ imageUrl }) {
    const pointsRef = useRef()
    const [geometryData, setGeometryData] = useState(null)
    const velocities = useRef(null)

    // Generate soft glowing circular particle texture
    const particleTexture = useMemo(() => {
        const canvas = document.createElement("canvas")
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext("2d")
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 32, 32)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        return texture
    }, [])

    useEffect(() => {
        let cancelled = false
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        img.onload = () => {
            if (cancelled) return
            const data = sampleImageToPoints(img, 4)
            velocities.current = new Float32Array(data.positions.length)
            setGeometryData(data)
        }
        return () => { cancelled = true }
    }, [imageUrl])

    useFrame((state) => {
        if (!pointsRef.current || !geometryData) return

        const posAttr = pointsRef.current.geometry.attributes.position
        const homePositions = geometryData.positions
        const vel = velocities.current
        const time = state.clock.getElapsedTime()

        // Unproject mouse position to world coordinates
        const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5)
        vector.unproject(state.camera)
        const dir = vector.sub(state.camera.position).normalize()
        const dist = -state.camera.position.z / dir.z
        const worldPos = state.camera.position.clone().add(dir.multiplyScalar(dist))

        const repelRadius = 1.3

        for (let i = 0; i < posAttr.count; i++) {
            const ix = i * 3
            const px = posAttr.array[ix]
            const py = posAttr.array[ix + 1]
            const pz = posAttr.array[ix + 2]

            const hx = homePositions[ix]
            const hy = homePositions[ix + 1]
            const hz = homePositions[ix + 2]

            // 1. Organic holographic wave movement (breathing effect)
            const waveX = Math.sin(time * 0.8 + hx * 0.4) * 0.06
            const waveY = Math.cos(time * 0.8 + hy * 0.4) * 0.06
            const waveZ = Math.sin(time * 1.2 + hx * 0.5 + hy * 0.5) * 0.22

            const targetX = hx + waveX
            const targetY = hy + waveY
            const targetZ = hz + waveZ

            // 2. Mouse cursor repulsion
            const dx = px - worldPos.x
            const dy = py - worldPos.y
            const d = Math.sqrt(dx * dx + dy * dy) || 0.001

            let fx = 0, fy = 0, fz = 0

            if (d < repelRadius) {
                const force = (1 - d / repelRadius) * 0.22
                fx += (dx / d) * force
                fy += (dy / d) * force
                fz += force * 0.8 // repel forwards/outwards in Z direction
            }

            // Spring return force towards breathing targets
            fx += (targetX - px) * 0.04
            fy += (targetY - py) * 0.04
            fz += (targetZ - pz) * 0.04

            // Friction damping and integration
            vel[ix] = (vel[ix] + fx) * 0.86
            vel[ix + 1] = (vel[ix + 1] + fy) * 0.86
            vel[ix + 2] = (vel[ix + 2] + fz) * 0.86

            posAttr.array[ix] += vel[ix]
            posAttr.array[ix + 1] += vel[ix + 1]
            posAttr.array[ix + 2] += vel[ix + 2]
        }

        posAttr.needsUpdate = true

        // 3D Parallax Rotation based on mouse coordinates
        pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, state.pointer.x * 0.3, 0.05)
        pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, -state.pointer.y * 0.25, 0.05)
    })

    if (!geometryData) return null

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={geometryData.positions.length / 3}
                    array={geometryData.positions.slice()}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={geometryData.colors.length / 3}
                    array={geometryData.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.065} 
                vertexColors 
                sizeAttenuation 
                transparent 
                opacity={0.85} 
                map={particleTexture}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

/**
 * @param {string} imageUrl - avatar URL (user ka) ya default placeholder
 */
export default function ParticlePortrait({ imageUrl }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5.2], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
        >
            <ambientLight intensity={0.5} />
            <ParticleField imageUrl={imageUrl} />
        </Canvas>
    )
}