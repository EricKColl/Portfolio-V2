"use client";

/* eslint-disable @next/next/no-img-element -- Portadas WebP locales con dimensiones explícitas. */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { projects, type Project } from "../lib/projects";
import CaseStudyModal from "./CaseStudyModal";
import Counter from "./fx/Counter";
import Decode from "./fx/Decode";
import Reveal from "./fx/Reveal";
import Tilt from "./fx/Tilt";

const ACCENTS: Record<Project["accent"], string> = {
  ember: "#ff7a3d",
  cyan: "#22e5ff",
  blue: "#4f8dff",
  gold: "#f5c451",
  violet: "#a78bfa",
  magenta: "#ff5cc8",
};

function ProjectCard({ project, flip = false }: { project: Project; flip?: boolean }) {
  const [open, setOpen] = useState(false);
  const launchRef = useRef<HTMLButtonElement>(null);
  const isExperience = project.mode === "experience";
  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => launchRef.current?.focus());
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail === project.title) setOpen(true);
    };
    window.addEventListener("portfolio:open-project", onOpen);
    return () => window.removeEventListener("portfolio:open-project", onOpen);
  }, [project.title]);

  return (
    <>
      <Tilt
        as="article"
        className={`pcard${project.featured ? " pcard-featured" : ""}${flip ? " pcard-featured-flip" : ""}`}
        max={project.featured ? 5 : 8}
      >
        <div className="pcard-inner" style={{ "--accent": ACCENTS[project.accent] } as CSSProperties}>
          <span className="pcard-border" aria-hidden="true" />
          <span className="pcard-glare" aria-hidden="true" />

          <div className="pcard-top">
            <span className="pcard-number">{project.number}</span>
            <span className="pcard-status">
              {project.status ? <b>{project.status}</b> : null}
              {isExperience ? "Experiencia inmersiva · WebGL" : `Caso interactivo · ${project.phases.length} fases`}
            </span>
          </div>

          <button
            ref={launchRef}
            type="button"
            className="pcard-cover"
            onClick={() => setOpen(true)}
            aria-label={`Abrir proyecto ${project.title}`}
            data-cursor="ABRIR"
          >
            <img
              src={project.coverImage}
              alt={project.coverAlt}
              width="1772"
              height="877"
              loading="lazy"
              decoding="async"
            />
            <span className="pcard-cover-shade" aria-hidden="true" />
            <span className="pcard-cover-cta" aria-hidden="true">Abrir caso de estudio →</span>
          </button>

          <div className="pcard-body">
            <p className="pcard-kicker">{project.kicker}</p>
            <h3>{project.title}</h3>
            <p className="pcard-description">{project.description}</p>

            {project.metrics ? (
              <dl className="pcard-metrics">
                {project.metrics.map((metric) => {
                  const numeric = /^\d+$/.test(metric.value) ? Number(metric.value) : null;
                  return (
                    <div key={metric.label}>
                      <dt>{metric.label}</dt>
                      <dd>{numeric === null ? metric.value : <Counter value={numeric} />}</dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}

            <ul className="tag-list" aria-label={`Tecnologías de ${project.title}`}>
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>

            <div className="pcard-actions">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
                Abrir proyecto
              </button>
              <a className="btn btn-ghost btn-sm" href={project.githubUrl} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              {project.liveUrl ? (
                <a className="btn btn-link btn-sm" href={project.liveUrl} target="_blank" rel="noreferrer">
                  Ver en producción <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Tilt>

      {open ? <CaseStudyModal project={project} onClose={close} /> : null}
    </>
  );
}

export default function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <section className="section projects" id="proyectos" data-hue="0.35" aria-labelledby="projects-title">
      <header className="section-head">
        <p className="section-label">
          <span>02</span> Proyectos
        </p>
        <h2 id="projects-title" className="display">
          <Decode as="span" text="Código que piensa." />
          <Decode as="span" text="Soluciones que transforman." delay={250} />
          <Decode as="span" text="Impacto que permanece." delay={500} className="text-gradient" />
        </h2>
        <p className="section-lead">
          Seis proyectos donde arquitectura, backend, datos y experiencia de usuario convergen.
          Cada uno se abre como un caso de estudio por fases.
        </p>
      </header>

      <div className="projects-featured">
        {featured.map((project, index) => (
          <Reveal key={project.title}>
            <ProjectCard project={project} flip={index % 2 === 1} />
          </Reveal>
        ))}
      </div>

      <div className="projects-grid">
        {rest.map((project, index) => (
          <Reveal key={project.title} delay={(index % 2) * 120}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
