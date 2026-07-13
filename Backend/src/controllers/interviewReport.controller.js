import { PDFParse } from "pdf-parse"
import { UserReport } from "../model/userReport.model.js"
import { generateInterviewReport } from "../services/ai.services.js"

/**
 * @description Controller to generate interview report.
 * jobDescription is required. resume (file) and selfDescription fields are
 * individually optional, but at least one of them must be provided.
 */
async function generateInterviewReportController(req, res) {

    const { jobDescription, skills, experience, projectLinks, additionalInfo } = req.body

    if (!jobDescription) {
        return res.status(400).json({
            message: "Job description is required"
        })
    }

    const hasResume = !!req.file
    const hasSelfDescription = !!(skills || experience || projectLinks || additionalInfo)

    if (!hasResume && !hasSelfDescription) {
        return res.status(400).json({
            message: "Please provide at least a resume or self description"
        })
    }

    // Step 1: resume PDF diya hai toh text nikalo
    let resumeText = ""
    if (hasResume) {
        const parser = new PDFParse({ data: req.file.buffer })
        const result = await parser.getText()
        await parser.destroy()
        resumeText = result.text
    }

    // Step 2: selfDescription fields ko structured object mein badlo
    // (skills/projectLinks form-data mein comma-separated string ke roop mein aayenge)
    const selfDescription = hasSelfDescription ? {
        skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        experience: experience || undefined,
        projectLinks: projectLinks ? projectLinks.split(",").map(s => s.trim()).filter(Boolean) : [],
        additionalInfo: additionalInfo || undefined
    } : undefined

    // Step 3: AI se report generate karo
    const aiReport = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    // Step 4: DB mein save karo
    const savedReport = await UserReport.create({
        jobDescription,
        resume: resumeText || undefined,
        selfDescription,
        user: req.user._id,
        ...aiReport
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        report: savedReport
    })
}

/**
 * @description Controller to get a single interview report by id.
 */
async function getInterviewReportByIdController(req, res) {
    const { reportId } = req.params

    const report = await UserReport.findOne({ _id: reportId, user: req.user._id })

    if (!report) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully",
        report
    })
}

/**
 * @description Controller to get all interview reports of the logged-in user (list view).
 */
async function getAllInterviewReportsController(req, res) {
    const reports = await UserReport.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -technicalQuestions -behavioralQuestions -skillGap -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully",
        reports
    })
}

export {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
}