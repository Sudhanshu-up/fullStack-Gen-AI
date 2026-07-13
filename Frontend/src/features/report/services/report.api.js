import axios from "axios"

const api = axios.create({
    baseURL: "https://fullstack-gen-ai-qmxy.onrender.com",
    withCredentials: true,
})

export async function generateInterviewReport({ jobDescription, resumeFile, skills, experience, projectLinks, additionalInfo }) {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    if (resumeFile) formData.append("resume", resumeFile)
    if (skills) formData.append("skills", skills)
    if (experience) formData.append("experience", experience)
    if (projectLinks) formData.append("projectLinks", projectLinks)
    if (additionalInfo) formData.append("additionalInfo", additionalInfo)

    const response = await api.post("/api/report/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

export async function getAllReports() {
    const response = await api.get("/api/report")
    return response.data
}

export async function getReportById(reportId) {
    const response = await api.get(`/api/report/${reportId}`)
    return response.data
}