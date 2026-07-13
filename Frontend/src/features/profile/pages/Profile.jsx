import React, { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import './Profile.scss'

const DEFAULT_AVATAR = "/WhatsApp Image 2026-07-01 at 3.19.57 PM.jpeg"

const Profile = () => {
    const { user, handleUpdateProfile, loading } = useAuth()

    const [username, setUsername] = useState(user?.username || "")
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")

        if (!username.trim() && !avatarFile) {
           setError("Please change something before updating.")
            return
        }

        const result = await handleUpdateProfile({
            username: username !== user?.username ? username : undefined,
            avatarFile
        })

        if (result.success) {
            setMessage("your Profile is update")
            setAvatarFile(null)
        } else {
            setError(result.message)
        }
    }

    const currentAvatar = avatarPreview || user?.avatar || DEFAULT_AVATAR

    return (
        <main className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Account</h1>
                    <p>Manage your profile settings and customize your avatar.</p>
                </div>

                <div className="profile-content-grid">
                    {/* Left: Avatar Upload Card */}
                    <div className="profile-avatar-card">
                        <div className="avatar-preview-wrapper">
                            <img src={currentAvatar} alt="Avatar" className="profile-avatar-image" />
                            <label htmlFor="avatar-upload-input" className="avatar-upload-overlay">
                                <span>Change Photo</span>
                            </label>
                        </div>
                        <input
                            type="file"
                            id="avatar-upload-input"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: "none" }}
                        />
                        <h3 className="profile-user-title">{user?.username || 'User'}</h3>
                        <p className="profile-user-email">{user?.email}</p>
                    </div>

                    {/* Right: Account Forms */}
                    <form onSubmit={handleSubmit} className="profile-form">
                        {message && <p className="profile-success">{message}</p>}
                        {error && <p className="profile-error">{error}</p>}

                        <div className="profile-field">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="profile-input"
                            />
                        </div>

                        <div className="profile-field">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={user?.email || ""} 
                                disabled 
                                className="profile-input disabled" 
                            />
                            <span className="profile-field-hint">Email address cannot be changed.</span>
                        </div>

                        <button type="submit" className="button primary-button profile-submit-btn" disabled={loading}>
                            {loading ? "Saving changes..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Profile