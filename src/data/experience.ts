import type { Experience } from "@/types/portfolio";

/**
 * EXPERIENCE — SAMPLE CONTENT (fictional companies)
 * Oldest first. `relatedProjects` takes slugs from src/data/projects.ts.
 * Logos: public/logos/<file> then "/logos/<file>".
 */
export const experience: Experience[] = [
  {
    id: "exp-startup",
    company: "Sample Startup Labs",
    position: "Junior Software Engineer",
    employmentType: "Full-time",
    location: "Sample City",
    startDate: "2020-07",
    endDate: "2022-02",
    responsibilities: [
      "Sample: built customer-facing features in React and Node.js.",
      "Sample: wrote automated tests and improved CI pipelines.",
    ],
    achievements: ["Sample: cut page load time by 40% through code splitting."],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    relatedProjects: ["orbit-dashboard"],
  },
  {
    id: "exp-agency",
    company: "Example Interactive Studio",
    position: "Creative Developer",
    employmentType: "Full-time",
    location: "Remote",
    startDate: "2022-03",
    endDate: "2024-01",
    responsibilities: [
      "Sample: delivered WebGL campaign sites for global brands.",
      "Sample: partnered with designers to ship motion-rich interfaces.",
    ],
    achievements: [
      "Sample: shipped 6 WebGL experiences maintaining 60fps on mid-range laptops.",
      "Sample: introduced a shared GSAP animation toolkit.",
    ],
    technologies: ["Three.js", "React Three Fiber", "GSAP", "Next.js"],
    relatedProjects: ["nebula-viewer"],
  },
  {
    id: "exp-product",
    company: "Placeholder Systems Inc.",
    position: "Senior Full-Stack Engineer",
    employmentType: "Full-time",
    location: "Sample City (Hybrid)",
    startDate: "2024-02",
    endDate: "Present",
    responsibilities: [
      "Sample: own architecture of a multi-tenant analytics platform.",
      "Sample: mentor four engineers and lead code reviews.",
    ],
    achievements: [
      "Sample: reduced infrastructure cost by 25% via autoscaling.",
      "Sample: led migration to a typed API layer.",
    ],
    technologies: ["TypeScript", "Next.js", "AWS", "Docker", "PostgreSQL"],
    relatedProjects: ["orbit-dashboard", "signal-api"],
  },
];
