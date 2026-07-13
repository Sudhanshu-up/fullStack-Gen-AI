import React from 'react'
import AnimatedBackground from '../../../shared/components/AnimatedBackground/AnimatedBackground.jsx'
import "../auth.layout.scss"

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-branding-panel">
                <AnimatedBackground />
                <div className="auth-branding-text">
                    <h2>Resume-AI</h2>
                    <p>Prep that actually works.</p>
                </div>
            </div>
            <div className="auth-form-panel">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout