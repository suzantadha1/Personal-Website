import Link from "next/link";

export default function Contact() {
  return (
    <div className="about-page">
      <Link href="/menu" className="back-button">Back</Link>

      <h1 className="about-title">Contact</h1>

      <p className="about-text">
        Email: <br></br>
        LinkedIn: <br></br>
        GitHub: <br></br>
      </p>
    </div>
  );
}