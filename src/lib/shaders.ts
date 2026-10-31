/** GLSL sources for the lightweight custom shaders used in the scene. */

export const floorVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vPos, 1.0);
  }
`;

export const floorFragment = /* glsl */ `
  uniform vec3 uCyan;
  uniform vec3 uViolet;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vPos;

  float grid(vec2 p, float size, float width) {
    vec2 q = p / size;
    vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - min(min(g.x, g.y) / width, 1.0);
  }

  void main() {
    float r = length(vPos.xz);
    float fine = grid(vPos.xz, 2.0, 1.0);
    float coarse = grid(vPos.xz, 10.0, 1.6);
    float fade = 1.0 - smoothstep(28.0, 95.0, r);
    float ripple = smoothstep(0.7, 1.0, sin(r * 0.28 - uTime * 0.9)) * 0.06;
    vec3 col = mix(uCyan, uViolet, smoothstep(12.0, 70.0, r));
    float a = (fine * 0.16 + coarse * 0.42 + ripple) * fade;
    gl_FragColor = vec4(col, a * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const trailVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const trailFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOffset;
  varying vec2 vUv;

  void main() {
    float head = fract(vUv.x * 2.0 - uTime * uSpeed + uOffset);
    float pulse = pow(1.0 - head, 7.0);
    float ends = sin(3.14159265 * vUv.x);
    float a = (0.14 + pulse * 0.9) * ends;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export const hologramVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const hologramFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uScale;
  uniform vec2 uOffset;
  uniform vec3 uTint;
  uniform float uTime;
  uniform float uReveal;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uMap, vUv * uScale + uOffset);
    float scan = sin(vUv.y * 260.0 - uTime * 2.5) * 0.5 + 0.5;
    float sweepPos = fract(uTime * 0.18);
    float sweep = exp(-pow((vUv.y - sweepPos) * 14.0, 2.0));
    float visible = 1.0 - smoothstep(uReveal - 0.06, uReveal, vUv.y);
    float front = exp(-pow((vUv.y - uReveal + 0.03) * 40.0, 2.0)) * step(uReveal, 1.02);

    vec3 col = tex.rgb * (0.88 + 0.12 * scan) + uTint * (sweep * 0.3 + front * 0.9);
    float edge = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x);
    gl_FragColor = vec4(col, visible * edge * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const beamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float fall = pow(1.0 - vUv.y, 1.8);
    float flicker = 0.85 + 0.15 * sin(uTime * 2.0 + vUv.y * 12.0);
    gl_FragColor = vec4(uColor, fall * 0.28 * flicker);
    #include <colorspace_fragment>
  }
`;
