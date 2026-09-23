"use client";

import { useEffect, useRef } from "react";

/**
 * Túnel de partículas en WebGL puro (sin librerías): ~5 kB.
 * - La cámara avanza con el scroll y las partículas reaccionan al ratón y a los clics (onda expansiva).
 * - El tono cambia suavemente según la sección visible (atributo data-hue).
 * - Con «reducir movimiento» se dibuja un único fotograma estático; sin WebGL queda el degradado CSS.
 */

const VERT = `
attribute vec3 aPos;
attribute float aSeed;
uniform float uTime, uScroll, uAspect, uSize, uPulseT;
uniform vec2 uMouse, uPulse;
varying float vSeed, vDepth;
void main() {
  float speed = 0.035;
  float z = fract(aPos.z + uTime * speed + uScroll * 1.15);
  vec2 p = aPos.xy * 2.0;
  p += vec2(sin(uTime * 0.25 + aSeed * 12.0), cos(uTime * 0.21 + aSeed * 9.0)) * 0.06;
  p += uMouse * (0.10 + 0.30 * z);
  float scale = 0.08 + 1.5 * z * z;
  vec2 sp = p * scale;
  vec2 dv = sp - uPulse;
  float d = length(dv);
  float wave = exp(-pow((d - uPulseT * 1.6) * 5.0, 2.0)) * exp(-uPulseT * 1.4);
  sp += normalize(dv + 0.0001) * wave * 0.22;
  gl_Position = vec4(sp.x / uAspect, sp.y, 0.0, 1.0);
  vSeed = aSeed;
  vDepth = z;
  gl_PointSize = uSize * (0.35 + 1.45 * z) * (0.55 + aSeed) * (1.0 + wave * 2.5);
}`;

const FRAG = `
precision mediump float;
uniform float uHue;
varying float vSeed, vDepth;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float core = smoothstep(0.5, 0.0, r);
  vec3 cyan = vec3(0.13, 0.90, 1.00);
  vec3 blue = vec3(0.23, 0.51, 1.00);
  vec3 violet = vec3(0.65, 0.42, 1.00);
  vec3 pink = vec3(1.00, 0.36, 0.78);
  float m = clamp(vSeed + uHue, 0.0, 2.0);
  vec3 col = m < 1.0 ? mix(cyan, blue, m) : mix(blue, mix(violet, pink, m - 1.0), m - 1.0);
  float fade = smoothstep(0.0, 0.18, vDepth) * (1.0 - smoothstep(0.86, 1.0, vDepth));
  gl_FragColor = vec4(col * (0.55 + core), core * core * fade * 0.7);
}`;

const BG_VERT = `attribute vec2 aP; varying vec2 vUv; void main(){ vUv = aP * 0.5 + 0.5; gl_Position = vec4(aP, 0.0, 1.0); }`;

const BG_FRAG = `
precision mediump float;
uniform float uTime, uScroll, uHue;
uniform vec2 uMouse;
varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * n(p); p *= 2.02; a *= 0.5; } return v; }
void main() {
  vec2 uv = vUv;
  vec2 q = uv * vec2(1.6, 1.0) + vec2(uTime * 0.012, -uScroll * 0.6);
  float a = fbm(q * 2.2 + fbm(q * 1.3 + uTime * 0.03));
  vec3 base = vec3(0.012, 0.018, 0.038);
  vec3 c1 = mix(vec3(0.02, 0.35, 0.75), vec3(0.35, 0.16, 0.85), clamp(uHue, 0.0, 1.0));
  vec3 c2 = mix(vec3(0.0, 0.75, 0.9), vec3(0.85, 0.2, 0.7), clamp(uHue * 0.8, 0.0, 1.0));
  float glow = smoothstep(0.35, 0.95, a);
  vec3 col = base + c1 * glow * 0.16 + c2 * pow(a, 3.0) * 0.10;
  float m = 1.0 - smoothstep(0.0, 0.55, distance(uv, 0.5 + uMouse * 0.12));
  col += c2 * m * 0.05;
  float vig = smoothstep(1.15, 0.25, distance(uv, vec2(0.5)));
  gl_FragColor = vec4(col * (0.55 + 0.45 * vig), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
  return s;
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

export default function WebGLBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 820px)").matches || window.matchMedia("(pointer: coarse)").matches;
    const count = reduced ? 900 : mobile ? 1400 : 4200;

    const pts = program(gl, VERT, FRAG);
    const bg = program(gl, BG_VERT, BG_FRAG);
    if (!pts || !bg) return;

    // Partículas: posición (x, y, z) y semilla
    const data = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      data[i * 4] = Math.random() * 2 - 1;
      data[i * 4 + 1] = Math.random() * 2 - 1;
      data[i * 4 + 2] = Math.random();
      data[i * 4 + 3] = Math.random();
    }
    const pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const u = (p: WebGLProgram, name: string) => gl.getUniformLocation(p, name);
    const P = {
      time: u(pts, "uTime"), scroll: u(pts, "uScroll"), aspect: u(pts, "uAspect"), size: u(pts, "uSize"),
      mouse: u(pts, "uMouse"), pulse: u(pts, "uPulse"), pulseT: u(pts, "uPulseT"), hue: u(pts, "uHue"),
    };
    const B = { time: u(bg, "uTime"), scroll: u(bg, "uScroll"), hue: u(bg, "uHue"), mouse: u(bg, "uMouse") };

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const pulse = { x: 0, y: 0, t: 10 };
    const onDown = (e: PointerEvent) => {
      pulse.x = ((e.clientX / window.innerWidth) * 2 - 1) * (window.innerWidth / window.innerHeight);
      pulse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pulse.t = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    let scroll = 0;
    let scrollTarget = 0;
    let hue = 0;
    let hueTarget = 0;
    const updateScrollTargets = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = window.scrollY / max;
      const sections = document.querySelectorAll<HTMLElement>("[data-hue]");
      const probe = window.innerHeight * 0.5;
      sections.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) hueTarget = Number(s.dataset.hue) || 0;
      });
    };
    updateScrollTargets();
    window.addEventListener("scroll", updateScrollTargets, { passive: true });

    let raf = 0;
    let last = performance.now();
    let time = 0;
    let running = true;

    const draw = (dt: number) => {
      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3);
      mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3);
      scroll += (scrollTarget - scroll) * Math.min(1, dt * 4);
      hue += (hueTarget - hue) * Math.min(1, dt * 1.6);
      pulse.t += dt;

      gl.disable(gl.BLEND);
      gl.useProgram(bg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const aP = gl.getAttribLocation(bg, "aP");
      gl.enableVertexAttribArray(aP);
      gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(B.time, time);
      gl.uniform1f(B.scroll, scroll);
      gl.uniform1f(B.hue, hue);
      gl.uniform2f(B.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(aP);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(pts);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      const aPos = gl.getAttribLocation(pts, "aPos");
      const aSeed = gl.getAttribLocation(pts, "aSeed");
      gl.enableVertexAttribArray(aPos);
      gl.enableVertexAttribArray(aSeed);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 16, 12);
      gl.uniform1f(P.time, time);
      gl.uniform1f(P.scroll, scroll);
      gl.uniform1f(P.aspect, width / height);
      gl.uniform1f(P.size, (mobile ? 4.5 : 6.5) * dpr);
      gl.uniform2f(P.mouse, mouse.x, mouse.y);
      gl.uniform2f(P.pulse, pulse.x, pulse.y);
      gl.uniform1f(P.pulseT, pulse.t);
      gl.uniform1f(P.hue, hue * 0.9);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.disableVertexAttribArray(aPos);
      gl.disableVertexAttribArray(aSeed);
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      draw(dt);
      raf = window.requestAnimationFrame(frame);
    };

    if (reduced) {
      time = 8;
      draw(0.016);
    } else {
      raf = window.requestAnimationFrame(frame);
    }

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = window.requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", updateScrollTargets);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-backdrop" aria-hidden="true" />;
}
