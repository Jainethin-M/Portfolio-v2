import type { Project } from "@/types/portfolio";

/**
 * PROJECTS — SAMPLE CONTENT (fictional projects)
 * Each project gets a page at /projects/<slug>.
 * Images: place files in public/projects/<slug>/ and list them in `images`.
 * With no images the site renders a generated placeholder card.
 */
export const projects: Project[] = [
  {
    slug: "orbit-dashboard",
    title: "Orbit Analytics Dashboard",
    shortDescription: "Sample: real-time analytics dashboard for multi-tenant SaaS teams.",
    description:
      "Sample project. A real-time analytics dashboard that streams product metrics to team workspaces, with configurable widgets and role-based access.",
    category: "Web Application",
    featured: true,
    year: 2024,
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "AWS", "Tailwind CSS"],
    images: [],
    features: [
      "Live-updating charts with WebSocket streaming",
      "Drag-and-drop widget layouts",
      "Role-based workspace permissions",
    ],
    architecture:
      "Sample architecture: Next.js frontend, a typed API layer, PostgreSQL for storage and an AWS-hosted event pipeline feeding a streaming gateway.",
    challenges: ["Rendering thousands of data points smoothly", "Isolating data between tenants"],
    solutions: [
      "Downsampling on the server and canvas-based charts",
      "Row-level security policies enforced in the database",
    ],
    outcomes: ["Sample: p95 dashboard load under 1.2s", "Sample: adopted by 40 internal teams"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
  },
  {
    slug: "nebula-viewer",
    title: "Nebula 3D Product Viewer",
    shortDescription: "Sample: browser-based 3D configurator with physically based materials.",
    description:
      "Sample project. An interactive 3D product configurator rendered with React Three Fiber, supporting material swaps, camera presets and AR-ready exports.",
    category: "WebGL / 3D",
    featured: true,
    year: 2023,
    technologies: ["Three.js", "React Three Fiber", "GSAP", "TypeScript", "GLSL"],
    images: [],
    features: ["Material and colour variants", "Cinematic camera presets", "Shareable configuration links"],
    architecture:
      "Sample architecture: GLB assets streamed progressively, a Zustand store for configuration state and GSAP-driven camera rigs.",
    challenges: ["Keeping 60fps on integrated GPUs", "Large model download size"],
    solutions: ["Draco compression and texture atlases", "Adaptive pixel ratio and on-demand rendering"],
    outcomes: ["Sample: 35% higher engagement on product pages"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
  },
  {
    slug: "signal-api",
    title: "Signal Notification API",
    shortDescription: "Sample: scalable notification service with queueing and templates.",
    description:
      "Sample project. A notification platform delivering email, push and in-app messages with retries, templating and delivery analytics.",
    category: "Backend / API",
    featured: false,
    year: 2024,
    technologies: ["Node.js", "TypeScript", "Redis", "PostgreSQL", "Docker", "GitHub Actions"],
    images: [],
    features: ["Template engine with preview", "Retry and dead-letter queues", "Delivery analytics"],
    architecture:
      "Sample architecture: stateless API containers, Redis-backed job queues and PostgreSQL for delivery logs.",
    challenges: ["Exactly-once style delivery under retries"],
    solutions: ["Idempotency keys and transactional outbox pattern"],
    outcomes: ["Sample: 5M notifications per day at 99.95% delivery"],
    githubUrl: "https://github.com/",
  },
  {
    slug: "atlas-design-system",
    title: "Atlas Design System",
    shortDescription: "Sample: accessible component library with theming tokens.",
    description:
      "Sample project. A React component library with design tokens, documentation site and automated accessibility testing.",
    category: "Design System",
    featured: false,
    year: 2022,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Accessibility (WCAG)", "Figma"],
    images: [],
    features: ["40+ accessible components", "Token-driven theming", "Visual regression tests"],
    architecture: "Sample architecture: monorepo with a core package, tokens package and a docs app.",
    challenges: ["Keeping design and code in sync"],
    solutions: ["Tokens exported from Figma into the build pipeline"],
    outcomes: ["Sample: reduced UI inconsistencies across five products"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com/",
  },
  {
    slug: "pulse-mobile-web",
    title: "Pulse Progressive Web App",
    shortDescription: "Sample: offline-first fitness tracking PWA.",
    description:
      "Sample project. An offline-first progressive web app syncing workout data in the background with conflict resolution.",
    category: "Web Application",
    featured: false,
    year: 2021,
    technologies: ["JavaScript", "React", "Node.js", "MongoDB", "Performance Optimisation"],
    images: [],
    features: ["Offline workout logging", "Background sync", "Installable on mobile"],
    architecture: "Sample architecture: service worker cache layers and a REST API with conflict-free merges.",
    challenges: ["Merging offline edits from multiple devices"],
    solutions: ["Per-field timestamps with last-writer-wins and audit history"],
    outcomes: ["Sample: Lighthouse PWA score of 100"],
    githubUrl: "https://github.com/",
  },
  {
    slug: "helix-data-pipeline",
    title: "Helix Data Pipeline",
    shortDescription: "Sample: automated ingestion and reporting pipeline.",
    description:
      "Sample project. Python-based pipeline ingesting partner data, validating it and producing nightly reports.",
    category: "Data / Automation",
    featured: false,
    year: 2020,
    technologies: ["Python", "PostgreSQL", "Docker", "Terraform", "AWS"],
    images: [],
    features: ["Schema validation", "Nightly scheduled reporting", "Infrastructure as code"],
    architecture: "Sample architecture: containerised batch jobs on AWS provisioned with Terraform.",
    challenges: ["Inconsistent partner file formats"],
    solutions: ["Pluggable parsers with a validation contract"],
    outcomes: ["Sample: removed 12 hours of manual reporting per week"],
    githubUrl: "https://github.com/",
  },
];
