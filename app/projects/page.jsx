"use client";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    name: "Pantryful",
    short: "AI-powered pantry tracker that predicts when you'll run out of essentials.",
    desc: "Pantryful helps households manage their pantry by tracking stock levels and using AI to predict when items will run out based on household size. It generates smart shopping lists that find the cheapest options across major retailers, and includes a chatbot that suggests recipes based on what you already have.",
    stack: ["Python", "Streamlit", "Gemini API"],
    github: "https://github.com/NSiddiqui226/Pantryful",
    live: "",
  },
  {
    name: "Baker Bike Heist",
    short: "Cooperative 2D puzzle game — voted #1 among 60+ projects by course TAs.",
    desc: "A cooperative multiplayer game built entirely from scratch in Python using Turtle graphics — no game engine. Two players work together through multi-stage puzzles to steal Professor Baker's bike, culminating in a fireball boss fight. Every character, animation, and background was custom-made. The project was voted #1 by course TAs out of 60+ final projects in CS 111 at UIC.",
    stack: ["Python", "Turtle Graphics"],
    github: "https://github.com/suzantadha1/Baker-Bike-Heist",
    live: "",
  },
  {
    name: "Personal Website",
    short: "This site — a dark, minimal portfolio with animated components.",
    desc: "A fully custom portfolio site built with Next.js and React. Features a scroll-driven project carousel, an interactive globe timeline on the About page, smooth page transitions, and a fullscreen nav overlay — all styled from scratch without a UI library.",
    stack: ["Next.js", "React", "CSS"],
    github: "https://github.com/suzantadha1/Personal-Website",
    live: "",
  },
];

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [exactIndex, setExactIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollable);
      setExactIndex(progress * (projects.length - 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = Math.round(exactIndex);

  const getCardStyle = (i) => {
    const diff = i - exactIndex;
    const absDiff = Math.abs(diff);

    const ty = diff * 108;
    const skewX = diff * -7;
    const scale = Math.max(0.85, 1 - Math.min(absDiff, 1) * 0.1);
    const opacity = Math.max(0, 1 - Math.min(absDiff, 1) * 0.75);
    const blur = Math.min(5, absDiff * 4);

    return {
      transform: `translateY(${ty}%) skewX(${skewX}deg) scale(${scale})`,
      opacity,
      filter: blur > 0.8 ? `blur(${blur}px)` : "none",
      zIndex: Math.round(20 - absDiff * 5),
      pointerEvents: absDiff < 0.4 ? "auto" : "none",
    };
  };

  const openModal = (project) => {
    setSelected(project);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsOpen(true));
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 400);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="projects-scroll-outer"
        style={{ height: `calc(100vh + ${(projects.length - 1) * 75}vh)` }}
      >
        <div className="projects-sticky-inner">
          <div className="projects-sticky-header">
            <p className="page-eyebrow">What I've built</p>
            <h1 className="page-title">Projects</h1>
          </div>

          <div className="projects-carousel-viewport">
            {projects.map((p, i) => (
              <div
                key={i}
                className="project-carousel-card"
                style={getCardStyle(i)}
                onClick={() => openModal(p)}
              >
                <span className="project-number">0{i + 1}</span>
                <h2 className="project-name">{p.name}</h2>
                <p className="project-desc">{p.short}</p>
                <div className="project-stack">
                  {p.stack.map((s) => (
                    <span className="stack-tag" key={s}>{s}</span>
                  ))}
                </div>
                <span className="project-cta">View details →</span>
              </div>
            ))}
          </div>

          <div className="carousel-dots">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`carousel-dot ${i === activeIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className={`modal-backdrop ${isOpen && !closing ? "modal-open" : "modal-closing"}`}
          onClick={closeModal}
        >
          <div
            className={`modal-sheet ${isOpen && !closing ? "modal-sheet-open" : "modal-sheet-closing"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-content">
              <span className="modal-eyebrow">Project</span>
              <h2 className="modal-title">{selected.name}</h2>
              <p className="modal-desc">{selected.desc}</p>
              <div className="modal-stack">
                {selected.stack.map((s) => (
                  <span className="stack-tag" key={s}>{s}</span>
                ))}
              </div>
              <div className="modal-links">
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noreferrer" className="modal-link">
                    GitHub ↗
                  </a>
                )}
                {selected.live && (
                  <a href={selected.live} target="_blank" rel="noreferrer" className="modal-link">
                    Live site ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
