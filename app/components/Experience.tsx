"use client";

/* eslint-disable @next/next/no-img-element -- Logos SVG y WebP locales ya optimizados. */

import { assetPath } from "../lib/asset-path";
import Counter from "./fx/Counter";
import Decode from "./fx/Decode";
import Reveal from "./fx/Reveal";
import Tilt from "./fx/Tilt";

const aiTools = [
  { name: "Claude Code", logo: assetPath("/ai-logos/claude-code.svg") },
  { name: "ChatGPT", logo: assetPath("/ai-logos/chatgpt.svg"), mono: true },
  { name: "Gemini", logo: assetPath("/ai-logos/gemini.svg") },
  { name: "Codex", logo: assetPath("/ai-logos/codex.svg") },
  { name: "Antigravity", logo: assetPath("/ai-logos/antigravity.svg") },
  { name: "Suno.ai", logo: assetPath("/ai-logos/suno.svg"), mono: true },
  { name: "MiniMax", logo: assetPath("/ai-logos/minimax.svg") },
  {
    name: "HeyGen",
    logo: "https://cdn.sanity.io/images/pdhqcmb1/production/83db2519472125eff4a047b07de4d49eb4d5f880-132x132.svg",
  },
];

const strengths = [
  { area: "Gestión administrativa", value: "Documentación y control" },
  { area: "Organización operativa", value: "Procesos y prioridades" },
  { area: "Atención al cliente", value: "Escucha y comunicación" },
  { area: "Coordinación", value: "Equipos y seguimiento" },
  { area: "Resolución", value: "Criterio bajo presión" },
];

const route = ["Analizar", "Modelar", "Construir", "Validar"];

export default function Experience() {
  return (
    <section className="section experience" id="experiencia" data-hue="1" aria-labelledby="experience-title">
      <header className="section-head" id="perfil">
        <p className="section-label">
          <span>03</span> Experiencia
        </p>
        <h2 id="experience-title" className="display">
          <Decode as="span" text="Conocimiento que impulsa." />
          <Decode as="span" text="Experiencia que transforma." delay={300} className="text-gradient" />
        </h2>
        <p className="section-lead">
          Formación en desarrollo web, dos años llevando la IA hasta lo aplicable y más de siete años
          ordenando procesos reales. Entiendo el código y el problema de negocio que hay detrás.
        </p>
      </header>

      <dl className="xp-stats" aria-label="Resumen profesional">
        <div>
          <dt>Formación actual</dt>
          <dd>DAW · UOC</dd>
        </div>
        <div>
          <dt>Orientación técnica</dt>
          <dd>Full-stack</dd>
        </div>
        <div>
          <dt>Experiencia con IA</dt>
          <dd><Counter value={2} suffix=" años" /></dd>
        </div>
        <div>
          <dt>Experiencia en operaciones</dt>
          <dd><Counter value={7} suffix="+ años" /></dd>
        </div>
      </dl>

      <div className="xp-grid">
        <Reveal>
          <Tilt as="article" className="xp-card xp-education" max={5}>
            <span className="xp-glow" aria-hidden="true" />
            <header>
              <p>Formación técnica</p>
              <span>En evolución continua</span>
            </header>
            <h3>Desarrollo de Aplicaciones Web</h3>
            <p className="xp-source">UOC · Formación online oficial</p>
            <p className="xp-text">
              Programación, bases de datos, sistemas y desarrollo frontend y backend mediante
              proyectos colaborativos orientados a producto.
            </p>
            <div className="xp-uoc">
              <img
                src={assetPath("/uoc-logo-user.png")}
                alt="Universitat Oberta de Catalunya"
                width="372"
                height="216"
                loading="lazy"
                decoding="async"
              />
              <p>
                <span>Del código al producto digital</span>
                <strong>DAW</strong>
              </p>
            </div>
            <p className="xp-tags xp-tags-edu">
              <span>Programación</span>
              <span>Bases de datos</span>
              <span>Sistemas</span>
              <span>Frontend</span>
              <span>Backend</span>
            </p>
            <ol className="xp-route" aria-label="Método de trabajo">
              {route.map((step, i) => (
                <li key={step} style={{ ["--i" as string]: i }}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Tilt>
        </Reveal>

        <Reveal delay={120}>
          <Tilt as="article" className="xp-card xp-ai" max={5}>
            <span className="xp-glow" aria-hidden="true" />
            <header>
              <p>Inteligencia aplicada</p>
              <span>2 años de exploración</span>
            </header>
            <h3>IA, agentes y creación multimodal</h3>
            <p className="xp-text">
              Integro modelos generativos, agentes de desarrollo y herramientas creativas en flujos
              reales: análisis, programación, automatización, contenido audiovisual y prototipado
              acelerado.
            </p>
            <div className="ai-orbit" aria-label="Herramientas de inteligencia artificial">
              <div className="ai-core" aria-hidden="true">
                <img src={assetPath("/experience/ai-core.webp")} alt="" width="700" height="700" loading="lazy" decoding="async" />
              </div>
              <ul>
                {aiTools.map((tool, i) => (
                  <li key={tool.name} style={{ ["--i" as string]: i, ["--n" as string]: aiTools.length }}>
                    <span className="ai-node">
                      <img
                        className={tool.mono ? "is-mono" : undefined}
                        src={tool.logo}
                        alt=""
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                      />
                      <em>{tool.name}</em>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="xp-tags">
              <span>Prompting estratégico</span>
              <span>Orquestación de agentes</span>
              <span>Flujos multimodales</span>
            </p>
          </Tilt>
        </Reveal>

        <Reveal delay={240}>
          <Tilt as="article" className="xp-card xp-career" max={5}>
            <span className="xp-glow" aria-hidden="true" />
            <header>
              <p>Trayectoria profesional</p>
              <span>Aptitudes</span>
            </header>
            <h3>Gestión, operaciones y atención al cliente</h3>
            <p className="xp-text">
              Más de siete años en entornos administrativos y operativos me han enseñado a ordenar
              procesos, anticipar necesidades y convertir incidencias en soluciones claras.
            </p>
            <ul className="xp-skills" aria-label="Aptitudes profesionales">
              {strengths.map((s, i) => (
                <li key={s.area} style={{ ["--i" as string]: i }}>
                  <span>{s.area}</span>
                  <i aria-hidden="true" />
                  <strong>{s.value}</strong>
                </li>
              ))}
            </ul>
            <div className="xp-note">
              <span>Valor diferencial</span>
              <strong>Tecnología con visión de negocio</strong>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
}
