import React, { useEffect, useRef, useState } from 'react'
import './CustomCursor.scss'

const CustomCursor = () => {
    const dotRef = useRef(null)
    const ringRef = useRef(null)

    const mousePos = useRef({ x: 0, y: 0 })
    const ringPos = useRef({ x: 0, y: 0 })
    const [hovered, setHovered] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        document.documentElement.classList.add('custom-cursor-enabled')

        const onMouseMove = (e) => {
            mousePos.current.x = e.clientX
            mousePos.current.y = e.clientY
            if (!visible) setVisible(true)
        }

        const onMouseOver = (e) => {
            const target = e.target
            if (!target) return
            
            const isInteractive = 
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'LABEL' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.interactive') ||
                target.classList.contains('clickable')

            if (isInteractive) {
                setHovered(true)
            } else {
                setHovered(false)
            }
        }

        const onMouseLeave = () => {
            setVisible(false)
        }

        const onMouseEnter = () => {
            setVisible(true)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseover', onMouseOver)
        document.addEventListener('mouseleave', onMouseLeave)
        document.addEventListener('mouseenter', onMouseEnter)

        let animationId
        const render = () => {
            if (dotRef.current && ringRef.current) {
                dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`

                const speed = 0.15
                ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speed
                ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speed
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
            }
            animationId = requestAnimationFrame(render)
        }
        render()

        return () => {
            document.documentElement.classList.remove('custom-cursor-enabled')
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseover', onMouseOver)
            document.removeEventListener('mouseleave', onMouseLeave)
            document.removeEventListener('mouseenter', onMouseEnter)
            cancelAnimationFrame(animationId)
        }
    }, [visible])

    return (
        <>
            <div 
                ref={dotRef} 
                className={`custom-cursor-dot ${visible ? 'visible' : ''} ${hovered ? 'hovered' : ''}`}
            />
            <div 
                ref={ringRef} 
                className={`custom-cursor-ring ${visible ? 'visible' : ''} ${hovered ? 'hovered' : ''}`}
            />
        </>
    )
}

export default CustomCursor
