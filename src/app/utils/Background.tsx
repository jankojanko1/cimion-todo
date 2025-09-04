"use client";
import React, { useEffect, useRef } from "react";

const fragShader = `
#ifdef GL_ES
precision lowp float;
#endif

uniform float iTime;
uniform vec2 iResolution;

// Animation speed control
const float speed = 0.3;

vec4 colormap(float x) {
    float gray = pow(x, 0.4);
    gray = mix(gray, 1.0, 0.35);
    return vec4(vec3(gray), 1.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm( vec2 p )
{
    float f = 0.0;
    float t = iTime * speed;
    f += 0.500000*noise( p + t  ); p = mtx*p*1.52;
    f += 0.031250*noise( p ); p = mtx*p*1.51;
    f += 0.250000*noise( p ); p = mtx*p*1.53;
    f += 0.125000*noise( p ); p = mtx*p*1.51;
    f += 0.062500*noise( p ); p = mtx*p*1.54;
    f += 0.015625*noise( p + sin(t) );
    return f/0.86875;
}

float pattern( in vec2 p )
{
    return fbm( p + fbm( p + fbm( p ) ) );
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.x;
    float shade = pattern(uv);
    gl_FragColor = vec4(colormap(shade).rgb, shade);
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
