/* ============================================================
   Code art — fondo WebGL a pantalla completa.
   Un único shader con varios "modos" (field/lattice/noisefield/flow)
   tintado por el color de acento del nodo en vista.
   Degrada con elegancia: si no hay WebGL, no pasa nada.
   ============================================================ */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_accent;
uniform float u_mode;    // 0 field, 1 lattice, 2 noisefield, 3 flow
uniform float u_pointer; // 0..1 proximity energy

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, amp = 0.5;
  for(int i=0;i<5;i++){ v += amp*vnoise(p); p *= 2.02; amp *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time * 0.06;
  vec3 base = vec3(0.082, 0.067, 0.059);   // ink
  float ink = 0.0;

  if (u_mode < 0.5) {
    // FIELD — domain-warped fbm, suave y orgánico
    vec2 q = vec2(fbm(uv*1.6 + t), fbm(uv*1.6 - t + 5.2));
    float f = fbm(uv*2.2 + q*1.5 + t*0.5);
    ink = smoothstep(0.25, 0.95, f);
  } else if (u_mode < 1.5) {
    // LATTICE — rejilla deformada por ruido
    vec2 g = uv*7.0;
    g += 0.6*vec2(fbm(uv*1.2 + t), fbm(uv*1.2 - t));
    vec2 grid = abs(fract(g)-0.5);
    float line = smoothstep(0.46, 0.5, max(grid.x, grid.y));
    float pulse = 0.5+0.5*sin(t*4.0 + fbm(uv+t));
    ink = line * (0.5+0.5*pulse);
  } else if (u_mode < 2.5) {
    // NOISEFIELD — fbm en capas con contornos
    float f = fbm(uv*3.0 + vec2(t, -t));
    float bands = abs(fract(f*6.0)-0.5);
    ink = smoothstep(0.35, 0.0, bands)*0.8;
  } else {
    // FLOW — líneas de flujo curvas
    float a = fbm(uv*2.0 + t);
    float flow = sin((uv.x*6.0 + a*6.2831) + t*3.0);
    ink = smoothstep(0.7, 1.0, abs(flow)) ;
    ink += 0.15*fbm(uv*4.0 - t);
  }

  ink *= (0.55 + 0.65*u_pointer);
  vec3 col = base + u_accent * ink * 0.5;
  // viñeta sutil
  float vig = smoothstep(1.3, 0.2, length(uv));
  col *= 0.85 + 0.15*vig;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("shader compile:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

const MODES = { field: 0, lattice: 1, noisefield: 2, flow: 3 };

export function initBackground(canvas) {
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return { setMode() {}, setAccent() {} };

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return { setMode() {}, setAccent() {} };

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u_res = gl.getUniformLocation(prog, "u_res");
  const u_time = gl.getUniformLocation(prog, "u_time");
  const u_accent = gl.getUniformLocation(prog, "u_accent");
  const u_mode = gl.getUniformLocation(prog, "u_mode");
  const u_pointer = gl.getUniformLocation(prog, "u_pointer");

  let targetMode = 0, curMode = 0;
  let targetAccent = [0.49, 0.42, 0.46], curAccent = [...targetAccent];
  let pointer = 0, targetPointer = 0.4;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  addEventListener("resize", resize);
  addEventListener("pointermove", () => { targetPointer = 0.9; });
  addEventListener("pointerout", () => { targetPointer = 0.4; });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now();

  function frame(now) {
    const t = reduce ? 0 : (now - start) / 1000;
    curMode += (targetMode - curMode) * 0.08;
    for (let i = 0; i < 3; i++) curAccent[i] += (targetAccent[i] - curAccent[i]) * 0.05;
    pointer += (targetPointer - pointer) * 0.04;
    targetPointer += (0.4 - targetPointer) * 0.01;

    gl.uniform2f(u_res, canvas.width, canvas.height);
    gl.uniform1f(u_time, t);
    gl.uniform3f(u_accent, curAccent[0], curAccent[1], curAccent[2]);
    gl.uniform1f(u_mode, curMode);
    gl.uniform1f(u_pointer, pointer);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    setMode(name) { if (name in MODES) targetMode = MODES[name]; },
    setAccent(hex) {
      const c = hexToRgb(hex);
      if (c) targetAccent = c;
    },
  };
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255];
}
