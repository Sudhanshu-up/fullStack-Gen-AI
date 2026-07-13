import React, { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { generateInterviewReport } from '../services/report.api.js'
import AuthGateModal from '../../../shared/components/AuthGateModel/AuthGateModal.jsx'
import './GetReportPage.scss'


const GetReportPage = () => {
    const { user } = useAuth()

    const [jobDescription, setJobDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [skills, setSkills] = useState("")
    const [experience, setExperience] = useState("")
    const [projectLinks, setProjectLinks] = useState("")
    const [additionalInfo, setAdditionalInfo] = useState("")

    const [showAuthGate, setShowAuthGate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [report, setReport] = useState(null)

    const hasSelfDescription = !!(skills || experience || projectLinks || additionalInfo)
    const hasResume = !!resumeFile

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!user) {
            setShowAuthGate(true)
            return
        }

        if (!jobDescription.trim()) {
            setError("Job description is required.")
            return
        }

        if (!hasResume && !hasSelfDescription) {
            setError("Please provide at least a resume or self description.")
            return
        }

        setLoading(true)
        try {
            const data = await generateInterviewReport({
                jobDescription, resumeFile, skills, experience, projectLinks, additionalInfo
            })
            setReport(data.report)
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (report) {
        return <ReportResult report={report} onReset={() => setReport(null)} />
    }

    return (
        <main className="get-report-page">
            {showAuthGate && <AuthGateModal onClose={() => setShowAuthGate(false)} />}

            <div className="grp-container">
                <h1>Interview Prep Report</h1>
                <p className="grp-subtitle">Provide a job description — and either a resume or a self description.</p>

                <form onSubmit={handleSubmit} className="grp-form">

                    {error && <p className="grp-error">{error}</p>}

                    <div className="grp-field">
                        <label>Job Description <span className="grp-required">*</span></label>
                        <textarea
                            rows={5}
                            placeholder="Paste the job description, or describe the role in your own words..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <div className="grp-field">
                        <label>Resume <span className="grp-optional">(optional PDF)</span></label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files[0] || null)}
                        />
                    </div>

                    <div className="grp-divider">OR / AND — tell us about yourself</div>

                    <div className="grp-field">
                        <label>Skills <span className="grp-optional">(comma-separated)</span></label>
                        <input
                            type="text"
                            placeholder="React, Node.js, MongoDB"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>

                    <div className="grp-field">
                        <label>Experience <span className="grp-optional">(optional)</span></label>
                        <textarea
                            rows={3}
                            placeholder="2 years at a startup building web apps..."
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </div>

                    <div className="grp-field">
                        <label>Project Links <span className="grp-optional">(comma-separated, optional)</span></label>
                        <input
                            type="text"
                            placeholder="https://github.com/you/project"
                            value={projectLinks}
                            onChange={(e) => setProjectLinks(e.target.value)}
                        />
                    </div>

                    <div className="grp-field">
                        <label>Anything else? <span className="grp-optional">(optional)</span></label>
                        <textarea
                            rows={2}
                            placeholder="Anything else you'd like the AI to know..."
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="button primary-button" disabled={loading}>
                        {loading ? "Building your report..." : "Build Report"}
                    </button>

                </form>
            </div>
        </main>
    )
}

const SEVERITY_COLOR = { low: "#2f7a4f", medium: "#d9a441", high: "#c05a3a" }

const ReportResult = ({ report, onReset }) => {
    return (
        <main className="get-report-page">
            <div className="grp-container">
                <div className="grp-result-header">
                    <h1>Your Interview Report</h1>
                    <button className="button primary-button grp-reset-btn" onClick={onReset}>Generate Another</button>
                </div>

                <div className="grp-score-badge">
                    <span className="grp-score-num">{report.matchScore}</span>
                    <span className="grp-score-label">Match Score</span>
                </div>

                <section className="grp-result-section">
                    <h2>Technical Questions</h2>
                    {report.technicalQuestions?.map((q, i) => (
                        <div className="grp-qa-card" key={i}>
                            <p className="grp-qa-question">{q.question}</p>
                            <p className="grp-qa-intention"><strong>Why they ask:</strong> {q.intention}</p>
                            <p className="grp-qa-answer"><strong>How to answer:</strong> {q.shortAns}</p>
                        </div>
                    ))}
                </section>

                <section className="grp-result-section">
                    <h2>Behavioral Questions</h2>
                    {report.behavioralQuestions?.map((q, i) => (
                        <div className="grp-qa-card" key={i}>
                            <p className="grp-qa-question">{q.question}</p>
                            <p className="grp-qa-intention"><strong>Why they ask:</strong> {q.intention}</p>
                            <p className="grp-qa-answer"><strong>How to answer:</strong> {q.shortAns}</p>
                        </div>
                    ))}
                </section>

                <section className="grp-result-section">
                    <h2>Skill Gaps</h2>
                    <div className="grp-skillgap-list">
                        {report.skillGap?.map((s, i) => (
                            <span
                                className="grp-skillgap-badge"
                                key={i}
                                style={{ borderColor: SEVERITY_COLOR[s.severity] }}
                            >
                                {s.skill} <em>({s.severity})</em>
                            </span>
                        ))}
                    </div>
                </section>

                <section className="grp-result-section">
                    <h2>Preparation Plan</h2>
                    {report.preparationPlan?.map((p, i) => (
                        <div className="grp-plan-day" key={i}>
                            <span className="grp-plan-day-num">Day {p.day}</span>
                            <h3>{p.focus}</h3>
                            <ul>
                                {p.tasks?.map((t, ti) => <li key={ti}>{t}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    )
}

export default GetReportPage