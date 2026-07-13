import { Router } from "express"
import { authUser } from "../midllewares/auth.midllewares.js"
import upload from "../midllewares/multer.middleware.js"
import {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
} from "../controllers/interviewReport.controller.js"

const interviewReportRouter = Router()

/**
 * @route post /api/report/generate
 * @description Generate an interview prep report (jobDescription required,
 * resume file or selfDescription fields — at least one required)
 * @access Private
 */
interviewReportRouter.route("/generate").post(authUser, upload.single("resume"), generateInterviewReportController)

/**
 * @route get /api/report
 * @description Get all interview reports of the logged-in user
 * @access Private
 */
interviewReportRouter.route("/").get(authUser, getAllInterviewReportsController)

/**
 * @route get /api/report/:reportId
 * @description Get a single interview report by id
 * @access Private
 */
interviewReportRouter.route("/:reportId").get(authUser, getInterviewReportByIdController)

export default interviewReportRouter