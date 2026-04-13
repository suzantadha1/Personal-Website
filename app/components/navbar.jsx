"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("idle");

  const handleNav = (id) => {
    setPhase("links-hiding");
    setTimeout(() => setPhase("sliding"), 200);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setPhase("idle");
      setOpen(false);
    }, 500);
  };

  const overlayClass =
    phase === "sliding"      ? "active closing" :
    phase === "links-hiding" ? "active links-hiding" :
    open                     ? "active" : "";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo-wrapper">
            <div className="logo-badge">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M22 9 C27 9 27 17 18 17 C10 17 10 26 15 27"
                  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="10" x2="20" y2="10" stroke="rgba(232,160,184,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="14.5" y1="10" x2="14.5" y2="27" stroke="rgba(232,160,184,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={() => setOpen(!open)} className="menu-button">
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div className={`nav-overlay ${overlayClass}`}>
        <div className="nav-links">
          <button onClick={() => handleNav("home")}     className="nav-link"><span data-text="Home">Home</span></button>
          <button onClick={() => handleNav("about")}    className="nav-link"><span data-text="About">About</span></button>
          <button onClick={() => handleNav("projects")} className="nav-link"><span data-text="Projects">Projects</span></button>
          <button onClick={() => handleNav("contact")}  className="nav-link"><span data-text="Contact">Contact</span></button>
        </div>
      </div>
    </>
  );
}