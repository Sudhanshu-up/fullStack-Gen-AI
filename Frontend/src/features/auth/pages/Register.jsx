import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import AuthLayout from '../components/AuthLayout.jsx'
import "../auth.form.scss"

const Register = () => {

   const navigate = useNavigate()

   const [username, setUsername] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [avatarFile, setAvatarFile] = useState(null)
   const [avatarPreview, setAvatarPreview] = useState(null)

   const { loading, handleRegister } = useAuth()

   const [error, setError] = useState("")

   const handleAvatarChange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      setError("")
      const result = await handleRegister({ username, email, password, avatarFile })
      if (result.success) {
         navigate("/")
      } else {
         setError(result.message)
      }
   }

   return (
      <AuthLayout>
         <main>
            <div className="form-container">
               <h1>Register</h1>

               <form onSubmit={handleSubmit}>

                  {error && <p className="auth-error">{error}</p>}

                  <div className="avatar-upload-group">
                     <label htmlFor="avatar" className="avatar-preview-label">
                        {avatarPreview
                           ? <img src={avatarPreview} alt="Avatar preview" className="avatar-preview-img" />
                           : <span className="avatar-placeholder">+ Photo</span>
                        }
                     </label>
                     <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                     />
                     <p className="avatar-hint">Optional — apna photo daaloge toh apna khud ka animation dekhoge</p>
                  </div>

                  <div className="input-group">
                     <label htmlFor="username">UserName</label>
                     <input
                        onChange={(e) => { setUsername(e.target.value) }}
                        type="text" id="username" name="username" placeholder='User Name' />
                  </div>

                  <div className="input-group">
                     <label htmlFor="email">Email</label>
                     <input
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email" id="email" name="email" placeholder='Enter Email Address' />
                  </div>

                  <div className="input-group">
                     <label htmlFor="password">Password</label>
                     <input
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password" id="password" name="password" placeholder='Enter Password' />
                  </div>

                  <button className='button primary-button auth-submit-btn' disabled={loading}>
                     {loading ? "Creating Account..." : "Register"}
                  </button>

               </form>

               <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
         </main>
      </AuthLayout>
   )
}

export default Register