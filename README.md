# Portfolio de Erick Coll Rodríguez · Versión 2

Rediseño completo del portfolio con una identidad **futurista e interactiva**, construido sobre el mismo contenido y los mismos casos de estudio de la versión 1. Esta carpeta es **independiente** (repositorio Git propio y sin conexión con GitHub): la versión publicada no se toca hasta que se decida sustituirla.

## Qué hay de nuevo

| Efecto | Qué hace |
|---|---|
| **Túnel de partículas WebGL** | Fondo vivo en WebGL puro (sin librerías): la cámara avanza al hacer scroll, las partículas siguen al ratón, los clics lanzan una onda expansiva y el tono cambia según la sección |
| **Secuencia de arranque** | Pantalla de inicio de ~1,6 s (una vez por sesión, se salta con cualquier tecla) |
| **Cursor personalizado** | Punto + anillo con inercia y etiquetas contextuales («ABRIR», «GITHUB»…) |
| **Titulares que se descifran** | Los textos se «decodifican» letra a letra al entrar en pantalla |
| **Tarjetas 3D holográficas** | Inclinación con el puntero, brillo que las recorre y borde animado |
| **Botones magnéticos** | Se acercan al cursor |
| **Contadores animados** | Cifras clave que cuentan hasta su valor |
| **Paleta de comandos** | `Ctrl` + `K` (o `⌘` + `K`): salta a cualquier sección, abre un proyecto o copia el correo |
| **Cinta de tecnologías** | Dos filas infinitas en sentidos opuestos |
| **Órbita de IA** | Herramientas de IA girando alrededor de un núcleo |
| **Navegación** | Barra de progreso, carril de secciones (escritorio) y dock inferior (móvil) |

Los casos de estudio por fases (JobConnect, ReparaYa, Online Store, TrendTech y **HotelScout**) se abren igual que antes, con navegación por teclado (`←` `→` `Esc`).

## Rendimiento y casos de estudio

- Al abrir un caso de estudio (iframe a pantalla completa) el cursor propio se **suspende** y vuelve el nativo, el fondo WebGL se **detiene** y la página de detrás **no se pinta**: así las fases cambian sin tirones y no compiten por la GPU.
- Las tarjetas ya no usan `backdrop-filter` (era el efecto más caro sobre un fondo animado); solo lo conservan la cabecera, el dock móvil y la paleta.
- Las animaciones que repintaban cada fotograma (degradados animados, sombras animadas, ángulos con `@property`) se sustituyeron por `transform`/`opacity`, que va por la GPU.
- Accesibilidad automática (axe, WCAG 2.x A/AA): 0 infracciones con y sin «reducir movimiento».

## Principios

- **Accesible:** con «reducir movimiento» no hay arranque, cursor, revelados, tilt ni animación WebGL (se dibuja un único fotograma). Contenido visible sin JavaScript, foco visible, enlace de salto al contenido y etiquetas ARIA.
- **Ligero:** el JavaScript total comprimido ronda 200 kB (React y Next incluidos) y el CSS 14 kB. Sin librerías de efectos: todo es código propio.
- **Adaptado a móvil:** menos partículas, sin cursor ni tilt, dock inferior y diseño de una columna.
- **Sin cambios de datos:** mismos proyectos, mismas fases y mismo contacto que la versión 1. Los textos se han reescrito con más fuerza sin añadir afirmaciones nuevas.

## Estructura

```text
app/
  page.tsx · layout.tsx · globals.css   Composición, metadatos y sistema de diseño
  case-study.css                        Estilos del visor de casos (extraídos de la v1)
  lib/projects.ts                       Datos de los 5 proyectos y sus fases
  components/
    Header · Hero · TechMarquee · Projects · Experience · Stack · Contact
    CaseStudyModal.tsx                  Visor de fases en iframe
    fx/                                 WebGLBackdrop · Cursor · Decode · Reveal · Tilt · Magnetic ·
                                        Counter · ScrollProgress · Boot · CommandPalette
public/<proyecto>/                      Portadas y páginas de cada caso de estudio
```

## Desarrollo

Requiere Node.js `>=22.13.0`.

```bash
npm ci
npm run dev                               # http://localhost:3000
npm run lint
GITHUB_ACTIONS=true npm run build:pages   # exportación estática en out/ (como en GitHub Pages)
```

## Cómo sustituir la versión publicada (cuando se decida)

1. Copiar el contenido de esta carpeta sobre el repositorio del portfolio (o enlazar este repositorio con su remoto).
2. Revisar `git diff`, confirmar y hacer `git push`: el flujo `.github/workflows/deploy-pages.yml` publica en GitHub Pages.

## Pruebas realizadas

Compilación estática y lint sin errores; recorrido automatizado en Edge (paleta, casos de estudio con navegación por teclado, correo y teléfono, versión móvil sin desbordamiento, modo de movimiento reducido). **No medido:** rendimiento del WebGL en una GPU real y en móviles de gama baja, Firefox y Safari. Con renderizado por software (sin GPU) las mejoras de esta revisión duplicaron los fotogramas por segundo en la portada (de 3,6 a 8,8), pero esa cifra no es representativa de un equipo real.
