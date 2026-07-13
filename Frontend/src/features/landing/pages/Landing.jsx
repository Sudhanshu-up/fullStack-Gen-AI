import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '../../auth/hooks/useAuth.js'
import ParticlePortrait from '../../../shared/components/ParticlePortrait/ParticlePortrait.jsx'
import './Landing.scss'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_AVATAR = "/WhatsApp Image 2026-07-01 at 3.19.57 PM.jpeg"

const FEATURES = [
    {
        num: "01",
        title: "Interview Prep Report",
        desc: "Apna resume ya profile do, job description do — matchScore, likely questions, skill gaps, aur ek day-wise preparation plan milega."
    },
    {
        num: "02",
        title: "Tailored Resume Builder",
        desc: "Job ke hisaab se ATS-friendly resume banwao — apne resume ko reference bana ke, ya sirf apne skills/experience se."
    }
]

const STEPS = [
    { n: "1", title: "Share your story", desc: "Resume upload karo, ya bas apne skills/experience type kar do — jo bhi ho." },
    { n: "2", title: "We find the gaps", desc: "AI tumhare profile ko job description ke against analyze karta hai." },
    { n: "3", title: "You walk in ready", desc: "Questions, answers, plan, tailored resume — sab ready." }
]

const FAQS = [
    { q: "Kya resume dena zaroori hai?", a: "Nahi — resume ya self-description (skills/experience) mein se koi ek dena kaafi hai. Dono doge toh behtar result milega." },
    { q: "Kya ye free hai?", a: "Haan, account banake dono features (Interview Report + Resume Builder) free use kar sakte ho." },
    { q: "Mera photo/avatar kis liye hai?", a: "Register karte waqt photo doge toh apna khud ka particle animation dekhoge, generic default ki jagah." }
]

const Landing = () => {
    const { user } = useAuth()
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

                <div className="landing-hero-particle-container slide-up-hero">
                    <div className="landing-hero-particle">
                        <ParticlePortrait imageUrl={user?.avatar || DEFAULT_AVATAR} />
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