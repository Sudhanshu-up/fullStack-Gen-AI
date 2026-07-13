import axios from "axios";

const api = axios.create({
  baseURL: "https://fullstack-gen-ai-qmxy.onrender.com",
  withCredentials: true,
});

export async function register({ username, email, password, avatarFile }) {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const response = await api.post("/api/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function logout() {
  try {
    const response = await api.post("/api/auth/logout");

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/getme");

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateProfile({ username, avatarFile }) {
  try {
    const formData = new FormData();
    if (username) formData.append("username", username);
    if (avatarFile) formData.append("avatar", avatarFile);

    const response = await api.put("/api/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}