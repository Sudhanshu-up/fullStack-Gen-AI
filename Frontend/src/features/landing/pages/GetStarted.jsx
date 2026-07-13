import React from 'react'
import { Link } from 'react-router'
import './GetStarted.scss'

const GetStarted = () => {
    return (
        <main className="get-started">

            <section className="gs-intro">
                <span className="gs-eyebrow">Before you begin</span>
                <h1>Here's what you get.</h1>
                <p>Two tools, one account — built from whatever you give it.</p>
            </section>

            <section className="gs-features">
                <div className="gs-feature-card">
                    <span className="gs-feature-num">01</span>
                    <h2>Interview Prep Report</h2>
                    <p>Resume ya self-description do, job description do — matchScore, likely technical &amp; behavioral questions (with answers), skill gaps, aur ek day-wise prep plan milega.</p>
                </div>
                <div className="gs-feature-card">
                    <span className="gs-feature-num">02</span>
                    <h2>Tailored Resume Builder</h2>
                    <p>Job description ke hisaab se ek naya, ATS-friendly resume banwao — apna purana resume reference bana ke, ya sirf skills/experience se.</p>
                </div>
            </section>

            <section className="gs-personalize">
                <span className="gs-eyebrow">One more thing</span>
                <h2>Your own animation, made from <em>you</em>.</h2>
                <p>
                    Jab register karoge, ek photo add karne ka option milega — optional hai, bina photo ke bhi
                    register kar sakte ho. Lekin photo doge toh landing page ka woh particle effect jo tumne
                    dekha, wahi <strong>tumhare khud ke photo</strong> se bane ga. Baad mein Profile se kabhi
                    bhi photo add/change kar sakte ho.
                </p>
            </section>

            <section className="gs-cta">
                <h2>Ready?</h2>
                <div className="gs-cta-buttons">
                    <Link to="/login" className="button primary-button gs-cta-btn">Login</Link>
                    <Link to="/register" className="button gs-cta-btn gs-cta-btn-secondary">Register</Link>
                </div>
            </section>

        </main>
    )
}

export default GetStarted