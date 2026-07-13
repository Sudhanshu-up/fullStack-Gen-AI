import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, logout, register, getMe, updateProfile } from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password, avatarFile }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password, avatarFile });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async ({ username, avatarFile }) => {
    setLoading(true);
    try {
      const data = await updateProfile({ username, avatarFile });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Profile update failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleRegister, handleLogin, handleLogOut, handleUpdateProfile };
};