import { PDFParse } from "pdf-parse"
import { GeneratedResume } from "../model/generatedResume.model.js"
import { generateResumeHtml, generatePdfFromHtml } from "../services/ai.services.js"

/**
 * @description Controller to generate a tailored resume PDF.
 * jobDescription, resume (file) and selfDescription are all individually optional,
 * but at least resume or selfDescription must be provided.
 */
async function generateResumeController(req, res) {

    const { jobDescription, skills, experience, projectLinks, additionalInfo } = req.body

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
    const selfDescription = hasSelfDescription ? {
        skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        experience: experience || undefined,
        projectLinks: projectLinks ? projectLinks.split(",").map(s => s.trim()).filter(Boolean) : [],
        additionalInfo: additionalInfo || undefined
    } : undefined

    // Step 3: AI se resume ka HTML generate karo
    const html = await generateResumeHtml({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    // Step 4: HTML DB mein save karo (history ke liye)
    await GeneratedResume.create({
        jobDescription: jobDescription || undefined,
        resume: resumeText || undefined,
        selfDescription,
        html,
        user: req.user._id
    })

    // Step 5: HTML se PDF banao aur user ko download ke liye bhejo
    const pdfBuffer = await generatePdfFromHtml(html)

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf"
    })
    res.send(pdfBuffer)
}

export { generateResumeController }