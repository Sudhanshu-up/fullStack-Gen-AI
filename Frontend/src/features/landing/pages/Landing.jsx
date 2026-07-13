import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBackground from '../../../shared/components/AnimatedBackground/AnimatedBackground.jsx'
import './Landing.scss'

gsap.registerPlugin(ScrollTrigger)


const FEATURES = [
    {
        num: "01",
        title: "Interview Prep Report",
        desc: "Provide your resume or profile along with a job description — get a matchScore, likely questions, skill gaps, and a day-wise preparation plan."
    },
    {
        num: "02",
        title: "Tailored Resume Builder",
        desc: "Get an ATS-friendly resume tailored to the job — built using your resume as a reference, or just your skills and experience."
    }
]

const STEPS = [
    { n: "1", title: "Share your story", desc: "Upload your resume, or simply type in your skills and experience — whatever you have." },
    { n: "2", title: "We find the gaps", desc: "AI analyzes your profile against the job description." },
    { n: "3", title: "You walk in ready", desc: "Questions, answers, plan, tailored resume — sab ready." }
]

const FAQS = [
    { q: "Do I need to provide a resume?", a: "No — providing either a resume or a self description (skills/experience) is enough. Providing both gives a better result." },
    { q: "Is this free?", a: "Yes, you can use both features (Interview Report + Resume Builder) for free with an account." },
    { q: "Can I add a profile photo?", a: "Yes — it's completely optional at signup, and you can add or change it anytime from your Profile." }
]

const Landing = () => {
    
    const [openFaq, setOpenFaq] = useState(null)

    useEffect(() => {
        // Hero entry animations
        const ctx = gsap.context(() => {
            gsap.fromTo(".slide-up-hero",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15 }
            )

            // Scroll triggers for other landing sections
            const revealContainers = document.querySelectorAll(".scroll-reveal")
            revealContainers.forEach((el) => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%"
                        }
                    }
                )
            })
        })

        document.fonts?.ready.then(() => ScrollTrigger.refresh())
        const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 500)

        return () => {
            ctx.revert()
            clearTimeout(refreshTimeout)
        }
    }, [])

      return (
        <main className="landing">
            <AnimatedBackground />
            {/* Background glowing spotlight */}
            <div className="landing-glow-spot" />

            <section className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-badge slide-up-hero">
                        <span className="badge-dot"></span>
                        <span className="badge-text">AI-POWERED PREPARATION</span>
                    </div>
                    
                    <h1 className="slide-up-hero">
                        Prep that actually <em>works</em>.
                    </h1>
                    <p className="slide-up-hero">
                        AI-powered interview reports and tailored resumes — engineered to turn preparation into confidence.
                    </p>
                    <div className="landing-hero-actions slide-up-hero">
                        <Link to="/get-started" className="button primary-button landing-hero-cta">
                            Get Started Free 
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                                <path d="M7 17L17 7"></path>
                                <path d="M7 7h10v10"></path>
                            </svg>
                        </Link>
                    </div>
                </div>

               
            </section>

            <section className="landing-section scroll-reveal">
                <span className="landing-eyebrow">I · The Gaps</span>
                <h2>Generic prep <em>doesn't</em> prepare you.</h2>
                <p className="landing-section-body">
                    Most interview prep is one-size-fits-all — generic questions, generic tips.
                    It doesn't know your resume, your gaps, or the actual job you're applying for.
                </p>
            </section>

            <section className="landing-section scroll-reveal">
                <span className="landing-eyebrow">II · Core Engine</span>
                <div className="landing-features">
                    {FEATURES.map((f) => (
                        <div className="landing-feature-card" key={f.num}>
                            <span className="landing-feature-num">{f.num}</span>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="landing-section scroll-reveal">
                <span className="landing-eyebrow">III · The Workflow</span>
                <div className="landing-steps">
                    {STEPS.map((s) => (
                        <div className="landing-step" key={s.n}>
                            <span className="landing-step-num">{s.n}</span>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="landing-section landing-cta-section scroll-reveal">
                <h2>So, ready for your next interview?</h2>
                <Link to="/get-started" className="button primary-button landing-hero-cta">
                    Get Started Free
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                        <path d="M7 17L17 7"></path>
                        <path d="M7 7h10v10"></path>
                    </svg>
                </Link>
            </section>

            <section className="landing-section scroll-reveal">
                <span className="landing-eyebrow">IV · Questions, Answered</span>
                <div className="landing-faq">
                    {FAQS.map((f, i) => (
                        <div className="landing-faq-item" key={i}>
                            <button
                                className="landing-faq-question"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                {f.q}
                                <span className={`faq-icon ${openFaq === i ? 'open' : ''}`}>+</span>
                            </button>
                            <div className={`landing-faq-answer-wrapper ${openFaq === i ? 'open' : ''}`}>
                                <p className="landing-faq-answer">{f.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Landing