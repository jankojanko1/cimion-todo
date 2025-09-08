"use client";
import React, { useEffect, useRef } from "react";

const fragShader = `
#ifdef GL_ES
precision lowp float;
#endif

uniform float iTime;
uniform vec2 iResolution;

// White-to-gray palette
vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

float sdBox(in vec2 p, in vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0))) + min(max(d.x, d.y), 0.0);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 rs = vec2(uv.x - sin(iTime), uv.y + sin(iTime));
    float r = random(rs);
    float shape = sdBox(sin(iTime) - uv, vec2(-sin(uv.y), -sin(uv.y)));
    // White-to-gray palette
    vec3 a = vec3(0.85); // base (light gray)
    vec3 b = vec3(0.15); // amplitude (gray range)
    vec3 c = vec3(r, 1.0, 0.0);
    vec3 d = vec3(0.5, 0.2, 0.25);
    float s = 0.0;
    vec3 color = cosPalette(cos(iTime - uv.y) + s, a, b, c, d);
    vec3 final = (cos(shape - s) + color) * 0.5 + 0.25; // ensure stays in [0,1]
    gl_FragColor = vec4(final, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Program link error");
  }
  return program;
}

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}
`;

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const program = createProgram(gl, vertexShader, fragShader);
    gl.useProgram(program);

    const positionLoc = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iResolutionLoc = gl.getUniformLocation(program, "iResolution");

    let animationId: number;
    const start = performance.now();

    function resize() {
      if (!canvas || !gl) return;
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function render() {
      if (!gl || !canvas) return;
      const now = performance.now();
      const t = (now - start) * 0.001;
      gl.uniform1f(iTimeLoc, t);
      gl.uniform2f(iResolutionLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
};

export default Background;
