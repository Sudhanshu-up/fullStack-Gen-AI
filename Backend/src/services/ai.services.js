import { GoogleGenAI } from "@google/genai"
import * as z from "zod"
import puppeteer from "puppeteer"

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
})

// selfDescription ab ek object hai ({ skills, experience, projectLinks, additionalInfo })
// isse AI ke liye readable text block mein convert karte hain
function formatSelfDescription(selfDescription) {
    if (!selfDescription) return "Not provided."

    const parts = []

    if (selfDescription.skills?.length) {
        parts.push(`Skills: ${selfDescription.skills.join(", ")}`)
    }
    if (selfDescription.experience) {
        parts.push(`Experience: ${selfDescription.experience}`)
    }
    if (selfDescription.projectLinks?.length) {
        parts.push(`Project Links: ${selfDescription.projectLinks.join(", ")}`)
    }
    if (selfDescription.additionalInfo) {
        parts.push(`Additional Info: ${selfDescription.additionalInfo}`)
    }

    return parts.length ? parts.join("\n") : "Not provided."
}

const interviewReportJsonSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question that can be asked in the interview" },
                    intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                    shortAns: { type: "string", description: "A short, focused answer covering the key points to mention" }
                },
                required: ["question", "intention", "shortAns"]
            },
            description: "Technical questions that can be asked in the interview"
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question that can be asked in the interview" },
                    intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                    shortAns: { type: "string", description: "A short, focused answer covering the key points to mention" }
                },
                required: ["question", "intention", "shortAns"]
            },
            description: "Behavioral questions that can be asked in the interview"
        },
        skillGap: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill which the candidate is lacking" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "How important this skill is for the job and how much it can impact the candidate's chances"
                    }
                },
                required: ["skill", "severity"]
            },
            description: "List of skill gaps in the candidate's profile"
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "integer", description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: "string", description: "The main focus of this day" },
                    tasks: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of tasks to complete on this day"
                    }
                },
                required: ["day", "focus", "tasks"]
            },
            description: "A day-wise preparation plan for the candidate"
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGap", "preparationPlan"]
}

const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema)

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:

        Resume: ${resume || "Not provided."}

        Candidate Self Description:
        ${formatSelfDescription(selfDescription)}

        Job Description: ${jobDescription}
    `

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: interviewReportJsonSchema
        },
    })

    const report = interviewReportSchema.parse(JSON.parse(interaction.output_text))
    return report
}

async function generatePdfFromHtml(htmlContent) {
    // Render (aur zyadatar container platforms) me Chromium ka default
    // sandbox nahi chalta — isliye --no-sandbox flags zaroori hain,
    // warna puppeteer.launch() silently crash/timeout ho sakta hai.
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

const resumeHtmlJsonSchema = {
    type: "object",
    properties: {
        html: {
            type: "string",
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
        }
    },
    required: ["html"]
}

const resumeHtmlSchema = z.fromJSONSchema(resumeHtmlJsonSchema)

// NOTE: ye ab sirf HTML deta hai, PDF nahi banata —
// controller pehle isse HTML save karega DB mein, phir generatePdfFromHtml() call karega
async function generateResumeHtml({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a resume for a candidate with the following details:

        Reference Resume (if any): ${resume || "Not provided."}

        Candidate Self Description:
        ${formatSelfDescription(selfDescription)}

        Target Job Description: ${jobDescription || "Not provided. Build a general, strong resume based on the candidate's profile."}

        The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
        The resume should be tailored for the given job description (if provided) and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
        The content of the resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
        You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
        The resume should not be too lengthy, ideally 1-2 pages long when converted to PDF. Focus on quality rather than quantity and include all relevant information that can increase the candidate's chances of getting an interview call.
    `

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: resumeHtmlJsonSchema
        },
    })

    const result = resumeHtmlSchema.parse(JSON.parse(interaction.output_text))
    return result.html
}

export { generateInterviewReport, generateResumeHtml, generatePdfFromHtml }
