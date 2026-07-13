import React from 'react'
import { useState } from 'react'
import "../auth.form.scss"
import { Navigate, Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import AuthLayout from '../components/AuthLayout.jsx'

const Login = () => {

  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const result = await handleLogin({ email, password })
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <AuthLayout>
      <main>
        <div className="form-container">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>

            {error && <p className="auth-error">{error}</p>}

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
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
        </div>
      </main>
    </AuthLayout>
  )
}

export default Login