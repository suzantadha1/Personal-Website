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
        <div className="navbar-left">S u z a n &nbsp; T a d h a</div>
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