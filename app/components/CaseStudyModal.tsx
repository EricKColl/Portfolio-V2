"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../lib/projects";

type ActiveVideo = { id: string; title: string };

/**
 * Visor a pantalla completa de los casos de estudio (fases en un iframe).
 * Se monta solo cuando está abierto, así el estado se reinicia en cada apertura.
 */
export default function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const phases = project.phases;
  const isExperience = project.mode === "experience";
  const totalPhases = String(phases.length).padStart(2, "0");
  const [activePhase, setActivePhase] = useState(0);
  const [frameReady, setFrameReady] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const phaseFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.body.classList.add("case-study-open");
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      const videoIsOpen = Boolean(document.querySelector(".jobconnect-video-layer"));
      if (event.key === "Escape") {
        if (videoIsOpen) setActiveVideo(null);
        else onClose();
      }
      if (videoIsOpen) return;
      if (event.key === "ArrowRight") {
        setFrameReady(false);
        setActivePhase((current) => Math.min(current + 1, phases.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setFrameReady(false);
        setActivePhase((current) => Math.max(current - 1, 0));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("case-study-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, phases.length]);

  const selectPhase = (index: number) => {
    if (index === activePhase) return;
    setFrameReady(false);
    setActiveVideo(null);
    setActivePhase(index);
  };

  const showVideo = (id: string, title: string) => setActiveVideo({ id, title });

  const connectVideoLaunchers = () => {
    const frameDocument = phaseFrameRef.current?.contentDocument;
    if (!frameDocument) return;

    frameDocument.querySelectorAll<HTMLElement>(".yt-facade, .nx-yt").forEach((launcher) => {
      if (launcher.dataset.portfolioVideoReady === "true") return;
      launcher.dataset.portfolioVideoReady = "true";
      launcher.addEventListener(
        "click",
        (event) => {
          const id = launcher.dataset.vid;
          if (!id) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          showVideo(id, launcher.dataset.title || `Vídeo de ${project.title}`);
        },
        true,
      );
    });

    const embeddedVideos = frameDocument.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed/"]');
    if (embeddedVideos.length > 0 && !frameDocument.getElementById("portfolio-video-bridge-style")) {
      const style = frameDocument.createElement("style");
      style.id = "portfolio-video-bridge-style";
      style.textContent = `
        .portfolio-video-wrapper { position: relative !important; }
        .portfolio-video-source { visibility: hidden !important; pointer-events: none !important; }
        .portfolio-video-launch {
          position: absolute; inset: 0; z-index: 30; display: grid; place-content: center;
          gap: 12px; width: 100%; border: 0;
          background-image: linear-gradient(rgba(0, 8, 24, .2), rgba(0, 5, 18, .78)), var(--portfolio-video-poster);
          background-position: center; background-size: cover; color: #fff;
          font: 700 13px "Chakra Petch", system-ui, sans-serif; letter-spacing: .12em;
          text-transform: uppercase; cursor: pointer; transition: filter .25s ease, transform .25s ease;
        }
        .portfolio-video-launch::before {
          content: "▶"; display: grid; place-items: center; width: 72px; height: 72px;
          margin: 0 auto; border: 1px solid rgba(86, 221, 255, .8); border-radius: 50%;
          color: #56ddff; font-size: 24px; box-shadow: 0 0 34px rgba(0, 240, 255, .35);
        }
        .portfolio-video-launch:hover { filter: brightness(1.12) saturate(1.08); }
      `;
      frameDocument.head.appendChild(style);
    }

    embeddedVideos.forEach((videoFrame) => {
      const wrapper = videoFrame.parentElement;
      const match = videoFrame.src.match(/\/embed\/([^?]+)/);
      if (!wrapper || !match || wrapper.querySelector(".portfolio-video-launch")) return;

      const videoId = match[1];
      const videoTitle = videoFrame.title || `Vídeo de ${project.title}`;
      wrapper.classList.add("portfolio-video-wrapper");
      videoFrame.classList.add("portfolio-video-source");
      videoFrame.setAttribute("aria-hidden", "true");
      videoFrame.tabIndex = -1;

      const button = frameDocument.createElement("button");
      button.type = "button";
      button.className = "portfolio-video-launch";
      button.textContent = "Reproducir vídeo";
      button.setAttribute("aria-label", `Reproducir ${videoTitle}`);
      button.style.setProperty("--portfolio-video-poster", `url("https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg")`);
      button.addEventListener("click", () => showVideo(videoId, videoTitle));
      wrapper.appendChild(button);
    });
  };

  const handlePhaseLoad = () => {
    const frameDocument = phaseFrameRef.current?.contentDocument;

    if (frameDocument && window.matchMedia("(max-width: 700px)").matches) {
      let mobileStyle = frameDocument.getElementById("portfolio-mobile-bridge") as HTMLStyleElement | null;
      if (!mobileStyle) {
        mobileStyle = frameDocument.createElement("style");
        mobileStyle.id = "portfolio-mobile-bridge";
        mobileStyle.textContent = `
          html, body { width: 100% !important; max-width: 100% !important; min-width: 0 !important; overflow-x: clip !important; }
          body { overscroll-behavior-x: none; }
          img, video, iframe { max-width: 100% !important; }
          button, a, input, select, textarea { touch-action: manipulation; }
          @media (max-width: 700px) {
            [style*="width:"] { max-width: 100% !important; }
            [style*="grid-template-columns"] { min-width: 0 !important; }
          }
        `;
        frameDocument.head.appendChild(mobileStyle);
      }
    }

    setFrameReady(true);
    connectVideoLaunchers();
  };

  const phase = phases[activePhase];

  return createPortal(
    <div
      className={`case-study-modal case-study-${project.slug}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`case-study-title-${project.slug}`}
    >
      <div className="case-study-backdrop" onClick={onClose} aria-hidden="true" />
      <section className="case-study-shell">
        <div className="case-study-grid" aria-hidden="true" />
        <header className="case-study-header">
          <h2 id={`case-study-title-${project.slug}`}>{project.title}</h2>
          <div className="case-study-header-actions">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Abrir versión web <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <span className="github-pulse" aria-hidden="true" />
              Ver repositorio GitHub <span aria-hidden="true">↗</span>
            </a>
            <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Cerrar caso de estudio">
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        {!isExperience ? (
          <>
            <nav className="phase-navigation" aria-label={`Fases del proyecto ${project.title}`}>
              <ol>
                {phases.map((item, index) => (
                  <li key={item.number}>
                    <button
                      type="button"
                      className={`${index === activePhase ? "is-active" : ""} ${index < activePhase ? "is-complete" : ""}`}
                      onClick={() => selectPhase(index)}
                      aria-current={index === activePhase ? "step" : undefined}
                    >
                      <span className="phase-number">{item.number}</span>
                      <span>
                        <small>{item.label}</small>
                        <strong>{item.title}</strong>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <label className="phase-mobile-select">
              <span>Fase {phase.number} de {totalPhases}</span>
              <select
                value={activePhase}
                onChange={(event) => selectPhase(Number(event.target.value))}
                aria-label={`Seleccionar fase de ${project.title}`}
              >
                {phases.map((item, index) => (
                  <option value={index} key={item.number}>
                    {item.number} · {item.title}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}

        <div className={`phase-viewport ${frameReady ? "is-ready" : ""}`}>
          <div className="phase-loader" aria-hidden="true">
            <span />
            <p>{isExperience ? "INICIALIZANDO ENTORNO INMERSIVO" : `MATERIALIZANDO FASE ${phase.number}`}</p>
          </div>
          <iframe
            key={phase.src}
            ref={phaseFrameRef}
            className="phase-frame"
            src={phase.src}
            title={`${phase.label}: ${phase.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            onLoad={handlePhaseLoad}
          />
        </div>

        {!isExperience ? (
          <footer className="case-study-footer">
            <button type="button" onClick={() => selectPhase(activePhase - 1)} disabled={activePhase === 0}>
              <span aria-hidden="true">←</span> Fase anterior
            </button>
            <span>{String(activePhase + 1).padStart(2, "0")} / {totalPhases}</span>
            {activePhase < phases.length - 1 ? (
              <button type="button" onClick={() => selectPhase(activePhase + 1)}>
                Siguiente fase <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button type="button" onClick={onClose}>
                Cerrar recorrido <span aria-hidden="true">✓</span>
              </button>
            )}
          </footer>
        ) : null}
      </section>

      {activeVideo ? (
        <section className="jobconnect-video-layer" aria-label={activeVideo.title}>
          <header>
            <div>
              <span>REPRODUCCIÓN DIRECTA</span>
              <h2>{activeVideo.title}</h2>
            </div>
            <button type="button" onClick={() => setActiveVideo(null)} aria-label="Cerrar vídeo">
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div className="jobconnect-video-stage">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}
    </div>,
    document.body,
  );
}
