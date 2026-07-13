import axios from "axios"

const api = axios.create({
    baseURL: "https://fullstack-gen-ai-qmxy.onrender.com",
    withCredentials: true,
})

export async function generateResume({ jobDescription, resumeFile, skills, experience, projectLinks, additionalInfo }) {
    const formData = new FormData()
    if (jobDescription) formData.append("jobDescription", jobDescription)
    if (resumeFile) formData.append("resume", resumeFile)
    if (skills) formData.append("skills", skills)
    if (experience) formData.append("experience", experience)
    if (projectLinks) formData.append("projectLinks", projectLinks)
    if (additionalInfo) formData.append("additionalInfo", additionalInfo)

    const response = await api.post("/api/resume/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob"
    })
    return response.data
}

export async function extractBlobErrorMessage(error) {
    try {
        if (error?.response?.data instanceof Blob) {
            const text = await error.response.data.text()
            const parsed = JSON.parse(text)
            return parsed.message || "Something went wrong."
        }
    } catch (e) {
    }
    return error?.response?.data?.message || "Something went wrong. Please try again."
}