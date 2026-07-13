import React from 'react'
import ParticlePortrait from '../../../shared/components/ParticlePortrait/ParticlePortrait.jsx'
import "../auth.layout.scss"

const DEFAULT_AVATAR = "/default-avatar.jpg"

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-branding-panel">
                <div className="auth-branding-particle">
                    <ParticlePortrait imageUrl={DEFAULT_AVATAR} />
                </div>
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