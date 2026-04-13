export default function Contact() {
  return (
    <div className="inner-page">
      <div className="page-header">
        <p className="page-eyebrow">Get in touch</p>
        <h1 className="page-title">Contact</h1>
      </div>

      <div className="glass-card">
        <div className="contact-list">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <a href="mailto:suzzantadha@gmail.com" className="contact-value">
              suzzantadha@gmail.com
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">LinkedIn</span>
            <a href="https://www.linkedin.com/in/suzan-tadha-514974344/" target="_blank" rel="noreferrer" className="contact-value">
              Suzan Tadha
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">GitHub</span>
            <a href="https://github.com/suzantadha1" target="_blank" rel="noreferrer" className="contact-value" style={{ color: "white" }}>
              suzantadha1
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}