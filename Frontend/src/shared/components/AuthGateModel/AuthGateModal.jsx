import React from 'react'
import { Link } from 'react-router'
import './AuthGateModal.scss'

const AuthGateModal = ({ onClose }) => {
    return (
        <div className="auth-gate-overlay" onClick={onClose}>
            <div className="auth-gate-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-gate-close" onClick={onClose}>×</button>
                <h3>Continue karne ke liye login ya register karo</h3>
                <p>Ye feature use karne ke liye account chahiye — bas 30 second lagenge.</p>
                <div className="auth-gate-buttons">
                    <Link to="/login" className="button primary-button">Login</Link>
                    <Link to="/register" className="button auth-gate-secondary-btn">Register</Link>
                </div>
            </div>
        </div>
    )
}

export default AuthGateModal