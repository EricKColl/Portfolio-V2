"use client";

import { useState, type CSSProperties } from "react";
import { assetPath } from "../lib/asset-path";
import Decode from "./fx/Decode";
import Reveal from "./fx/Reveal";

type Tech = { name: string; color: string; icon?: string; mono?: string };

const modules: Array<{ id: string; system: string; title: string; description: string; outcome: string; techs: Tech[] }> = [
  {
    id: "frontend",
    system: "INTERFACE LAYER",
    title: "Frontend",
    description:
      "Interfaces accesibles, responsive y precisas: estructura semántica, interacción fluida y una experiencia visual consistente en cada pantalla.",
    outcome: "Claridad visual · interacción · rendimiento",
    techs: [
      { name: "HTML5", icon: "/stack-icons/html5.svg", color: "#E34F26" },
      { name: "CSS3", icon: "/stack-icons/css.svg", color: "#8B5CF6" },
      { name: "JavaScript", icon: "/stack-icons/javascript.svg", color: "#F7DF1E" },
      { name: "TypeScript", mono: "TS", color: "#3178C6" },
      { name: "React", mono: "RE", color: "#22E5FF" },
      { name: "JavaFX", icon: "/stack-icons/openjdk.svg", color: "#4A90C2" },
    ],
  },
  {
    id: "backend",
    system: "LOGIC ENGINE",
    title: "Backend",
    description:
      "Servicios, reglas de negocio y APIs diseñadas para crecer sin perder control, con arquitecturas mantenibles y flujos bien definidos.",
    outcome: "Arquitectura · seguridad · escalabilidad",
    techs: [
      { name: "Laravel", icon: "/stack-icons/laravel.svg", color: "#FF2D20" },
      { name: "PHP", icon: "/stack-icons/php.svg", color: "#8993BE" },
      { name: "Node.js", icon: "/stack-icons/nodedotjs.svg", color: "#5FA04E" },
      { name: "Express", icon: "/stack-icons/express.svg", color: "#F4F7FB" },
      { name: "GraphQL", icon: "/stack-icons/graphql.svg", color: "#E10098" },
      { name: "Java", icon: "/stack-icons/openjdk.svg", color: "#ED8B00" },
    ],
  },
  {
    id: "data",
    system: "DATA MEMORY",
    title: "Datos",
    description:
      "Persistencia relacional y documental convertida en una base fiable: modelos coherentes, consultas eficientes e información preparada para decidir.",
    outcome: "Integridad · persistencia · acceso",
    techs: [
      { name: "MySQL", icon: "/stack-icons/mysql.svg", color: "#4FA7C7" },
      { name: "MongoDB", icon: "/stack-icons/mongodb.svg", color: "#47A248" },
      { name: "JDBC", mono: "JDBC", color: "#F28C28" },
      { name: "JPA", mono: "JPA", color: "#F4C95D" },
      { name: "Hibernate", icon: "/stack-icons/hibernate.svg", color: "#BCAE79" },
      { name: "SQL", mono: "SQL", color: "#5CA4D6" },
    ],
  },
  {
    id: "delivery",
    system: "DELIVERY PIPELINE",
    title: "Herramientas",
    description:
      "Versionado, pruebas, contenedores y despliegue integrados en un flujo disciplinado que reduce fricción y convierte código en producto entregable.",
    outcome: "Control · validación · entrega continua",
    techs: [
      { name: "GitHub", icon: "/stack-icons/github.svg", color: "#F4F7FB" },
      { name: "Docker", icon: "/stack-icons/docker.svg", color: "#2496ED" },
      { name: "Postman", icon: "/stack-icons/postman.svg", color: "#FF6C37" },
      { name: "JUnit", icon: "/stack-icons/junit5.svg", color: "#25A162" },
      { name: "Railway", icon: "/stack-icons/railway.svg", color: "#F4F7FB" },
      { name: "Git", mono: "GIT", color: "#F05032" },
    ],
  },
];

export default function Stack() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="section stack" id="stack" data-hue="1.5" aria-labelledby="stack-title">
      <header className="section-head">
        <p className="section-label">
          <span>04</span> Stack
        </p>
        <h2 id="stack-title" className="display">
          <Decode as="span" text="Herramientas que dominan el código." />
          <Decode as="span" text="Criterio que dirige el resultado." delay={300} className="text-gradient" />
        </h2>
        <p className="section-lead">
          No acumulo tecnologías: las conecto con intención. Cada capa cumple una función concreta
          dentro de un sistema pensado para construir, validar y entregar.
        </p>
      </header>

      <div className="stack-grid" aria-label="Ecosistema tecnológico">
        {modules.map((module, index) => (
          <Reveal key={module.id} delay={index * 90}>
            <article
              className={`stack-card${active === module.id ? " is-active" : ""}`}
              onPointerEnter={() => setActive(module.id)}
              onPointerLeave={() => setActive(null)}
            >
              <header>
                <p>{module.system}</p>
                <h3>{module.title}</h3>
              </header>
              <p className="stack-desc">{module.description}</p>
              <ul className="stack-chips">
                {module.techs.map((tech) => (
                  <li key={tech.name} style={{ "--tc": tech.color } as CSSProperties}>
                    <span className="chip-icon" aria-hidden="true">
                      {tech.icon ? (
                        <span
                          className="chip-glyph"
                          style={{ maskImage: `url(${assetPath(tech.icon)})`, WebkitMaskImage: `url(${assetPath(tech.icon)})` }}
                        />
                      ) : (
                        <b>{tech.mono}</b>
                      )}
                    </span>
                    {tech.name}
                  </li>
                ))}
              </ul>
              <p className="stack-outcome">{module.outcome}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
