import { Router } from "express"
import { authUser } from "../midllewares/auth.midllewares.js"
import upload from "../midllewares/multer.middleware.js"
import { generateResumeController } from "../controllers/resume.controller.js"

const resumeRouter = Router()

/**
 * @route post /api/resume/generate
 * @description Generate a tailored resume PDF (all fields optional,
 * but resume file or selfDescription — at least one required)
 * @access Private
 */
resumeRouter.route("/generate").post(authUser, upload.single("resume"), generateResumeController)

export default resumeRouter