import axios from "axios"

const TOKEN_KEY = "auth_token"

// --- Token storage helpers ---
// localStorage me store karte hain taaki page reload/redirect ke baad
// bhi login state bana rahe (Vercel + Render cross-site cookie block
// hone ki wajah se hum cookie pe depend nahi kar sakte).
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// --- Shared axios instance ---
// withCredentials: true rakha hai taaki local dev (same-site, localhost)
// me cookie-based flow bhi kaam kare. Production (cross-site) me asli
// auth Authorization header se hoga (interceptor neeche).
export const api = axios.create({
  baseURL: "https://fullstack-gen-ai-qmxy.onrender.com",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Agar backend 401 de (expired/invalid/blacklisted token), to stale
// token ko turant clear karo — warna UI "logged in" dikhata rehta hai
// jabki har protected call fail ho rahi hoti hai.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken()
    }
    return Promise.reject(error)
  }
)
