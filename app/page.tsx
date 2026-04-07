import Mypage from "./components/mypage";
import AboutContent from "./about/page";
import ProjectsContent from "./projects/page";
import ContactContent from "./contact/page";

function SectionDivider() {
  return (
    <div className="section-divider">
      <div className="section-divider-line" />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section id="home">
        <Mypage />
      </section>

      <SectionDivider />

      <section id="about">
        <AboutContent />
      </section>

      <SectionDivider />

      <section id="projects">
        <ProjectsContent />
      </section>

      <SectionDivider />

      <section id="contact">
        <ContactContent />
      </section>
    </main>
  );
}
