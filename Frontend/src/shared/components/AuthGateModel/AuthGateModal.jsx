import React from 'react'
import { Link } from 'react-router'
import './AuthGateModal.scss'

const AuthGateModal = ({ onClose }) => {
    return (
        <div className="auth-gate-overlay" onClick={onClose}>
            <div className="auth-gate-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-gate-close" onClick={onClose}>×</button>
                <h3>Log in or sign up to continue</h3>
                <p>You'll need an account to use this feature — it only takes 30 seconds.</p>
                <div className="auth-gate-buttons">
                    <Link to="/login" className="button primary-button">Login</Link>
                    <Link to="/register" className="button auth-gate-secondary-btn">Register</Link>
                </div>
            </div>
        </div>
    )
}

export default AuthGateModal