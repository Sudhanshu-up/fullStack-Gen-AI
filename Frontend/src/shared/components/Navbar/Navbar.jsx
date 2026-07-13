import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../../features/auth/hooks/useAuth.js'
import "./Navbar.scss"

const Navbar = () => {
    const { user, handleLogOut } = useAuth()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="navbar-header">
            <nav className={`navbar-pill ${scrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="navbar-logo">
                    <span className="logo-dot"></span>
                    Resume-AI
                </Link>

                <div className="navbar-links">
                    <Link to="/report" className="navbar-link">Get Report</Link>
                    <Link to="/resume" className="navbar-link">Get Resume</Link>
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <Link to="/profile" className="navbar-profile-btn">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.username} className="navbar-avatar-img" />
                                ) : (
                                    <span className="navbar-avatar-fallback">{user.username?.[0]?.toUpperCase()}</span>
                                )}
                                <span className="navbar-username">{user.username}</span>
                            </Link>
                            <button onClick={handleLogOut} className="navbar-logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">Login</Link>
                            <Link to="/register" className="button primary-button navbar-cta-btn">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar