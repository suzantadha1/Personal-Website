"use client";
import { useEffect, useRef } from "react";
import GlobeTimeline from "../components/GlobeTimeline";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const facts = [
  { label: "Based in",  value: "Chicago, IL" },
  { label: "Currently", value: "Open to opportunities" },
  { label: "Interests", value: "Motorspots, traveling, building things" },
  { label: "Fun fact",  value: "I have sky-dived" },
];

export default function About() {
  const introRef  = useReveal();
  const skillsRef = useReveal();
  const factsRef  = useReveal();

  return (
    <div className="about-page-wrapper">

      {/* ── INTRO ── */}
      <section className="about-section reveal-block" ref={introRef}>
        <p className="page-eyebrow">Who I am</p>
        
        <p className="about-intro-text">
          My name is Suzan Tadha and I am a Computer Science student at UIC.
          I enjoy learning new programming languages and building projects
          that help me improve my problem solving skills. I have experience
          with Java, JavaScript, Python, HTML/CSS, and C++, and I am excited
          to continue expanding my knowledge in software development.
        </p>
      </section>

      {/* ── SKILLS ── */}
      <section className="about-section reveal-block" ref={skillsRef}>
        <p className="section-label">Technologies</p>
        <div className="skills-grid">
          {["Java", "JavaScript", "Python", "HTML & CSS", "C++", "React", "Node.js", "Git"].map((s, i) => (
            <div className="skill-item" key={s} style={{ "--i": i }}>
              <span className="skill-name">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── GLOBE TIMELINE ── */}
      <section style={{ width: "100%" }}>
        <GlobeTimeline />
      </section>

      {/* ── FACTS ── */}
      <section className="about-section reveal-block" ref={factsRef}>
        <p className="section-label">Quick facts</p>
        <div className="facts-grid">
          {facts.map((f, i) => (
            <div className="fact-item" key={i} style={{ "--i": i }}>
              <span className="fact-label">{f.label}</span>
              <span className="fact-value">{f.value}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
