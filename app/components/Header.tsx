"use client";

import { useEffect, useState } from "react";
import Magnetic from "./fx/Magnetic";

const links = [
  { id: "proyectos", label: "Proyectos" },
  { id: "experiencia", label: "Experiencia" },
  { id: "stack", label: "Stack" },
  { id: "contacto", label: "Contacto" },
];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current: string | null = null;
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= probe) current = id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

export default function Header() {
  const active = useActiveSection();

  const openConversation = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => window.dispatchEvent(new CustomEvent("portfolio:reveal-phone")), 520);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Erick Coll Rodríguez, inicio">
          <span className="brand-mark" aria-hidden="true">EC</span>
          <span className="brand-name">Erick Coll <b>Rodríguez</b></span>
        </a>

        <nav className="primary-nav" aria-label="Navegación principal">
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : undefined}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="palette-hint"
            onClick={() => window.dispatchEvent(new CustomEvent("portfolio:open-palette"))}
            aria-label="Abrir paleta de comandos (Ctrl o Cmd + K)"
          >
            <span>Buscar</span>
            <kbd>Ctrl K</kbd>
          </button>
          <Magnetic strength={0.22}>
            <button className="header-cta" type="button" onClick={openConversation}>
              Hablemos <span aria-hidden="true">↗</span>
            </button>
          </Magnetic>
        </div>
      </header>

      {/* Dock inferior en móvil */}
      <nav className="mobile-dock" aria-label="Navegación rápida">
        {links.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={active === id ? "is-active" : undefined}>
            {label}
          </a>
        ))}
      </nav>

      {/* Carril de secciones en escritorio */}
      <nav className="section-rail" aria-label="Secciones">
        {[{ id: "inicio", label: "Inicio" }, ...links].map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={(id === "inicio" && !active) || active === id ? "is-active" : undefined}
            aria-label={label}
            data-label={label}
          />
        ))}
      </nav>
    </>
  );
}
