import express from "express"
import authRouter from "./routes/auth.routes.js"
import interviewReportRouter from "./routes/interviewReport.routes.js"
import resumeRouter from "./routes/resume.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/report", interviewReportRouter)
app.use("/api/resume", resumeRouter)

export default app