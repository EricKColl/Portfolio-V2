"use client";

/* eslint-disable @next/next/no-img-element -- Retrato WebP local con dimensiones explícitas. */

import { useEffect, useRef } from "react";
import { assetPath } from "../lib/asset-path";
import Counter from "./fx/Counter";
import Decode from "./fx/Decode";
import Magnetic from "./fx/Magnetic";
import Tilt from "./fx/Tilt";

const ROLES = ["Full-Stack Developer", "IA aplicada", "Producto real", "Código con criterio"];

function RotatingRole() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let role = 0;
    let char = 0;
    let deleting = false;
    let timer = 0;
    const step = () => {
      const word = ROLES[role];
      char += deleting ? -1 : 1;
      node.textContent = word.slice(0, Math.max(0, char));
      let wait = deleting ? 38 : 70;
      if (!deleting && char >= word.length) {
        deleting = true;
        wait = 1500;
      } else if (deleting && char <= 0) {
        deleting = false;
        role = (role + 1) % ROLES.length;
        wait = 350;
      }
      timer = window.setTimeout(step, wait);
    };
    timer = window.setTimeout(step, 1800);
    return () => {
      window.clearTimeout(timer);
      node.textContent = ROLES[0];
    };
  }, []);

  return (
    <span className="role-line">
      <i aria-hidden="true">&gt;</i> <span ref={ref}>{ROLES[0]}</span>
      <b aria-hidden="true" className="role-caret" />
    </span>
  );
}

const stats = [
  { value: 5, suffix: "", label: "Proyectos completos" },
  { value: 94, suffix: "", label: "Pruebas automáticas" },
  { value: 2, suffix: " años", label: "Con IA aplicada" },
  { value: 7, suffix: "+", label: "Años en operaciones" },
];

export default function Hero() {
  return (
    <section className="hero" id="inicio" data-hue="0" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy" id="contenido">
          <p className="eyebrow">
            <span className="pulse-dot" aria-hidden="true" />
            Full-Stack Developer · En formación · Girona
          </p>

          <h1 id="hero-title">
            <Decode as="span" className="hero-thesis" text="No compito por encajar en el mercado." />
            <Decode
              as="span"
              className="hero-vision"
              text="Construyo experiencias digitales que lo obligan a evolucionar."
              delay={500}
              duration={1300}
            />
          </h1>

          <p className="hero-intro">
            Arquitectura limpia, producto real y una obsesión: que cada proyecto supere el estándar.
          </p>

          <RotatingRole />

          <div className="hero-actions">
            <Magnetic>
              <a className="btn btn-primary" href="#proyectos" data-cursor="EXPLORAR">
                Explorar proyectos <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => window.dispatchEvent(new CustomEvent("portfolio:open-palette"))}
              >
                Paleta de comandos <kbd>Ctrl K</kbd>
              </button>
            </Magnetic>
          </div>

          <dl className="hero-stats" aria-label="Cifras clave">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-visual">
          <Tilt className="portrait-card" max={12}>
            <span className="portrait-ring" aria-hidden="true" />
            <span className="portrait-ring portrait-ring-2" aria-hidden="true" />
            <div className="portrait-frame">
              <img
                src={assetPath("/erick-coll-rodriguez.webp")}
                alt="Retrato profesional de Erick Coll Rodríguez"
                width="532"
                height="756"
                fetchPriority="high"
                decoding="async"
              />
              <span className="portrait-scan" aria-hidden="true" />
              <span className="portrait-glare" aria-hidden="true" />
            </div>
            <span className="corner corner-tl" aria-hidden="true" />
            <span className="corner corner-tr" aria-hidden="true" />
            <span className="corner corner-bl" aria-hidden="true" />
            <span className="corner corner-br" aria-hidden="true" />
            <p className="portrait-tag" aria-hidden="true">
              <span>ERICK.COLL</span>
              <span>v2.0 · ONLINE</span>
            </p>
            <ul className="orbit-chips" aria-hidden="true">
              <li style={{ ["--i" as string]: 0 }}>React</li>
              <li style={{ ["--i" as string]: 1 }}>Node.js</li>
              <li style={{ ["--i" as string]: 2 }}>IA</li>
              <li style={{ ["--i" as string]: 3 }}>Java</li>
            </ul>
          </Tilt>
        </div>
      </div>

      <a className="scroll-hint" href="#proyectos" aria-label="Bajar a los proyectos">
        <span>SCROLL</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
