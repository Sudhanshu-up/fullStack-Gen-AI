import React, { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { generateResume, extractBlobErrorMessage} from './services/resume.api.js'
import AuthGateModal from "../../../shared/components/AuthGateModel/AuthGateModal.jsx"
import './GetResumePage.scss'


const GetResumePage = () => {
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
    const [success, setSuccess] = useState(false)

    const hasSelfDescription = !!(skills || experience || projectLinks || additionalInfo)
    const hasResume = !!resumeFile

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        if (!user) {
            setShowAuthGate(true)
            return
        }

        if (!hasResume && !hasSelfDescription) {
            setError("Please provide at least a resume or self description.")
            return
        }

        setLoading(true)
        try {
            const pdfBlob = await generateResume({
                jobDescription, resumeFile, skills, experience, projectLinks, additionalInfo
            })

            // browser download trigger karo
            const url = window.URL.createObjectURL(pdfBlob)
            const a = document.createElement("a")
            a.href = url
            a.download = "resume.pdf"
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)

            setSuccess(true)
        } catch (err) {
            const message = await extractBlobErrorMessage(err)
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="get-resume-page">
            {showAuthGate && <AuthGateModal onClose={() => setShowAuthGate(false)} />}

            <div className="grs-container">
                <h1>Resume Builder</h1>
                <p className="grs-subtitle">Sab kuch optional hai — bas resume ya self-description mein se ek do.</p>

                {success && (
                    <div className="grs-success">
                        ✅ Resume ban gaya! Download shuru ho gaya hoga — check your downloads folder.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grs-form">

                    {error && <p className="grs-error">{error}</p>}

                    <div className="grs-field">
                        <label>Job Description <span className="grs-optional">(optional — behtar tailored resume ke liye)</span></label>
                        <textarea
                            rows={5}
                            placeholder="Paste the job description you're targeting..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <div className="grs-field">
                        <label>Reference Resume <span className="grs-optional">(optional PDF)</span></label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files[0] || null)}
                        />
                    </div>

                    <div className="grs-divider">OR / AND — tell us about yourself</div>

                    <div className="grs-field">
                        <label>Skills <span className="grs-optional">(comma-separated)</span></label>
                        <input
                            type="text"
                            placeholder="React, Node.js, MongoDB"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>

                    <div className="grs-field">
                        <label>Experience <span className="grs-optional">(optional)</span></label>
                        <textarea
                            rows={3}
                            placeholder="2 years at a startup building web apps..."
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </div>

                    <div className="grs-field">
                        <label>Project Links <span className="grs-optional">(comma-separated, optional)</span></label>
                        <input
                            type="text"
                            placeholder="https://github.com/you/project"
                            value={projectLinks}
                            onChange={(e) => setProjectLinks(e.target.value)}
                        />
                    </div>

                    <div className="grs-field">
                        <label>Anything else? <span className="grs-optional">(optional)</span></label>
                        <textarea
                            rows={2}
                            placeholder="Anything else you'd like the AI to know..."
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="button primary-button" disabled={loading}>
                        {loading ? "Building your resume... (may take ~30s)" : "Build Resume"}
                    </button>

                </form>
            </div>
        </main>
    )
}

export default GetResumePage