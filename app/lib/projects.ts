import { assetPath } from "./asset-path";

export type ProjectPhase = {
  number: string;
  label: string;
  title: string;
  src: string;
};

export type Project = {
  number: string;
  title: string;
  kicker: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  slug: string;
  accent: "cyan" | "blue" | "gold" | "violet" | "magenta";
  featured?: boolean;
  status?: string;
  mode: "phases" | "experience";
  coverImage: string;
  coverAlt: string;
  metrics?: Array<{ value: string; label: string }>;
  phases: ProjectPhase[];
};

export const projects: Project[] = [
  {
    number: "01",
    title: "HotelScout",
    kicker: "PWA en producción · Cloudflare",
    description:
      "Un buscador de alojamientos que se niega a mentir. Localiza hoteles reales con datos abiertos, respeta a cada servicio que usa y dice con claridad lo que no sabe.",
    technologies: ["React", "TypeScript", "Cloudflare", "OpenStreetMap"],
    githubUrl: "https://github.com/EricKColl/hotelscout",
    liveUrl: "https://hotelscout.pages.dev",
    slug: "hotelscout",
    accent: "cyan",
    featured: true,
    status: "EN PRODUCCIÓN",
    mode: "phases",
    coverImage: assetPath("/hotelscout/cover.webp"),
    coverAlt: "HotelScout mostrando alojamientos cerca de la estación de Atocha en escritorio y móvil",
    metrics: [
      { value: "94", label: "pruebas automáticas" },
      { value: "0", label: "precios inventados" },
      { value: "0 €", label: "coste de servicio" },
    ],
    phases: [
      { number: "01", label: "Fase 1", title: "Viabilidad", src: assetPath("/hotelscout/fase-1.html") },
      { number: "02", label: "Fase 2", title: "Arquitectura y proxy", src: assetPath("/hotelscout/fase-2.html") },
      { number: "03", label: "Fase 3", title: "Producto e interfaz", src: assetPath("/hotelscout/fase-3.html") },
      { number: "04", label: "Fase 4", title: "Calidad y producción", src: assetPath("/hotelscout/fase-4.html") },
    ],
  },
  {
    number: "02",
    title: "JobConnect",
    kicker: "Plataforma full-stack de empleo",
    description:
      "Empleo conectado en tiempo real: autenticación JWT, roles diferenciados, API GraphQL y comunicación instantánea sobre Node.js y MongoDB.",
    technologies: ["Node.js", "GraphQL", "MongoDB", "Socket.io"],
    githubUrl: "https://github.com/EricKColl/FullStackAttack-Producto4.git",
    slug: "jobconnect",
    accent: "blue",
    mode: "phases",
    coverImage: assetPath("/jobconnect/cover.webp"),
    coverAlt: "Vista de la gestión de usuarios de JobConnect",
    phases: [
      { number: "01", label: "Producto 1", title: "Fundamentos", src: assetPath("/jobconnect/fase-1.html") },
      { number: "02", label: "Producto 2", title: "Interacción", src: assetPath("/jobconnect/fase-2.html") },
      { number: "03", label: "Producto 3", title: "Backend conectado", src: assetPath("/jobconnect/fase-3.html") },
      { number: "04", label: "Producto 4", title: "Integración full-stack", src: assetPath("/jobconnect/fase-4.html") },
    ],
  },
  {
    number: "03",
    title: "ReparaYa",
    kicker: "Gestión integral de incidencias",
    description:
      "La evolución completa de un producto: de un MVC artesanal en PHP a Laravel y WordPress, con calendario, permisos y flujos a medida de cada perfil.",
    technologies: ["Laravel", "PHP", "MySQL", "WordPress"],
    githubUrl: "https://github.com/EricKColl/ReparaYa-Producto4-WordPress",
    slug: "reparaya",
    accent: "gold",
    mode: "phases",
    coverImage: assetPath("/reparaya/cover.webp"),
    coverAlt: "Página principal del servicio técnico ReparaYa",
    phases: [
      { number: "01", label: "Producto 1", title: "Fundamentos PHP", src: assetPath("/reparaya/fase-1.html") },
      { number: "02", label: "Producto 2", title: "MVC y roles", src: assetPath("/reparaya/fase-2.html") },
      { number: "03", label: "Producto 3", title: "Laravel y B2B", src: assetPath("/reparaya/fase-3.html") },
      { number: "04", label: "Producto 4", title: "WordPress conectado", src: assetPath("/reparaya/fase-4.html") },
    ],
  },
  {
    number: "04",
    title: "Online Store",
    kicker: "Aplicación de escritorio Java",
    description:
      "Clientes, artículos y pedidos gobernados por JDBC y persistencia ORM, con una interfaz JavaFX cuidada hasta el último píxel.",
    technologies: ["Java", "JPA", "Hibernate", "JavaFX"],
    githubUrl: "https://github.com/jenhmy/bugbusters_P5.git",
    slug: "online-store",
    accent: "violet",
    mode: "phases",
    coverImage: assetPath("/online-store/cover.webp"),
    coverAlt: "Panel de control empresarial de BugBusters Store",
    phases: [
      { number: "01", label: "Producto 1", title: "Modelado del dominio", src: assetPath("/online-store/fase-1.html") },
      { number: "02", label: "Producto 2", title: "Implementación Java", src: assetPath("/online-store/fase-2.html") },
      { number: "03", label: "Producto 3", title: "JDBC y MySQL", src: assetPath("/online-store/fase-3.html") },
      { number: "04", label: "Producto 4", title: "JPA e Hibernate", src: assetPath("/online-store/fase-4.html") },
      { number: "05", label: "Producto 5", title: "JavaFX", src: assetPath("/online-store/fase-5.html") },
    ],
  },
  {
    number: "05",
    title: "TrendTech",
    kicker: "Experiencia web inmersiva 3D",
    description:
      "Un portal tecnológico que se recorre como una sala tridimensional: navegación espacial, postprocesado, partículas, carrusel multimedia y vídeo integrado.",
    technologies: ["Three.js", "WebGL", "JavaScript", "CSS3D"],
    githubUrl: "https://github.com/ErickColl/Trendtech",
    liveUrl: "https://erickcoll.github.io/Trendtech/",
    slug: "trendtech",
    accent: "magenta",
    mode: "experience",
    coverImage: assetPath("/trendtech/cover.webp"),
    coverAlt: "Sala tridimensional futurista de TrendTech",
    phases: [
      { number: "01", label: "Experiencia", title: "Sala inmersiva 3D", src: assetPath("/trendtech/index.html?v=27") },
    ],
  },
];
