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
                   <p>Provide a resume or self description along with a job description — get a matchScore, likely technical &amp; behavioral questions (with answers), skill gaps, and a day-wise prep plan.</p>
                </div>
                <div className="gs-feature-card">
                    <span className="gs-feature-num">02</span>
                    <h2>Tailored Resume Builder</h2>
                    <p>Get a new, ATS-friendly resume tailored to the job description — using your old resume as a reference, or just your skills and experience.</p>
                </div>
            </section>

            <section className="gs-personalize">
                <span className="gs-eyebrow">One more thing</span>
                <h2>Your own animation, made from <em>you</em>.</h2>
               <p>
                   When you register, you'll have the option to add a profile photo — it's optional, and you
                   can register without one. You can always add or change your photo later from your Profile.
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