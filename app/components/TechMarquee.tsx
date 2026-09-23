import type { CSSProperties } from "react";
import { assetPath } from "../lib/asset-path";

type Tech = { name: string; icon: string; color: string };

const row1: Tech[] = [
  { name: "Python", icon: "/tech-icons/python.svg", color: "#5AA9E6" },
  { name: "JavaScript", icon: "/tech-icons/javascript.svg", color: "#F7DF1E" },
  { name: "Java", icon: "/stack-icons/openjdk.svg", color: "#ED8B00" },
  { name: "PHP", icon: "/tech-icons/php.svg", color: "#8993BE" },
  { name: "C++", icon: "/tech-icons/cplusplus.svg", color: "#659AD2" },
  { name: "C", icon: "/tech-icons/c.svg", color: "#A8B9CC" },
  { name: "HTML5", icon: "/tech-icons/html5.svg", color: "#E34F26" },
  { name: "CSS3", icon: "/tech-icons/css.svg", color: "#8B5CF6" },
  { name: "SQL", icon: "/tech-icons/mysql.svg", color: "#55A7C8" },
];

const row2: Tech[] = [
  { name: "Node.js", icon: "/stack-icons/nodedotjs.svg", color: "#5FA04E" },
  { name: "GraphQL", icon: "/stack-icons/graphql.svg", color: "#E10098" },
  { name: "Laravel", icon: "/stack-icons/laravel.svg", color: "#FF2D20" },
  { name: "MongoDB", icon: "/stack-icons/mongodb.svg", color: "#47A248" },
  { name: "Docker", icon: "/stack-icons/docker.svg", color: "#2496ED" },
  { name: "Hibernate", icon: "/stack-icons/hibernate.svg", color: "#BCAE79" },
  { name: "GitHub", icon: "/stack-icons/github.svg", color: "#F4F7FB" },
  { name: "Postman", icon: "/stack-icons/postman.svg", color: "#FF6C37" },
  { name: "JUnit", icon: "/stack-icons/junit5.svg", color: "#25A162" },
];

function Row({ items, reverse }: { items: Tech[]; reverse?: boolean }) {
  // Se duplica la lista para un bucle continuo sin saltos.
  const loop = [...items, ...items];
  return (
    <div className={`marquee-row${reverse ? " is-reverse" : ""}`}>
      <ul className="marquee-track">
        {loop.map((tech, i) => (
          <li key={`${tech.name}-${i}`} aria-hidden={i >= items.length ? "true" : undefined} style={{ color: tech.color } as CSSProperties}>
            <span
              className="marquee-glyph"
              style={{ maskImage: `url(${assetPath(tech.icon)})`, WebkitMaskImage: `url(${assetPath(tech.icon)})` }}
            />
            {tech.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="marquee" aria-label="Tecnologías con las que trabajo">
      <Row items={row1} />
      <Row items={row2} reverse />
    </section>
  );
}
