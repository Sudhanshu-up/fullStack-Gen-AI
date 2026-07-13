import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import './AnimatedBackground.scss'

const PARTICLE_COUNT = 1400

function Particles() {
    const pointsRef = useRef()

    const positions = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT * 3)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 18
            arr[i * 3 + 1] = (Math.random() - 0.5) * 14
            arr[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        return arr
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (!pointsRef.current) return

        // dheemi ambient rotation — kabhi na rukne wala drift
        pointsRef.current.rotation.y = t * 0.015
        pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.06

        // mouse se halka parallax — page se juda hua feel
        pointsRef.current.rotation.y += state.pointer.x * 0.06
        pointsRef.current.rotation.x += -state.pointer.y * 0.04
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.045} color="#ccff00" transparent opacity={0.4} sizeAttenuation />
        </points>
    )
}

export default function AnimatedBackground() {
    return (
        <div className="animated-background">
            <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
                <Particles />
            </Canvas>
        </div>
    )
}
