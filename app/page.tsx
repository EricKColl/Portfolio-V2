import Header from "./components/Header";
import Hero from "./components/Hero";
import TechMarquee from "./components/TechMarquee";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import WebGLBackdrop from "./components/fx/WebGLBackdrop";
import Cursor from "./components/fx/Cursor";
import ScrollProgress from "./components/fx/ScrollProgress";
import Boot from "./components/fx/Boot";
import CommandPalette from "./components/fx/CommandPalette";

export default function Home() {
  return (
    <>
      <WebGLBackdrop />
      <div className="noise" aria-hidden="true" />
      <Cursor />
      <ScrollProgress />
      <Boot />
      <CommandPalette />

      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />

      <main>
        <Hero />
        <TechMarquee />
        <Projects />
        <Experience />
        <Stack />
        <Contact />
      </main>

      <footer className="site-footer">
        <p className="footer-brand">Erick Coll Rodríguez</p>
        <p>Girona · España</p>
        <p>© 2026 · Diseñado y construido a mano · Todos los derechos reservados</p>
        <a href="#inicio" className="footer-top">
          Volver arriba <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}
