import type { Skill, SkillCategory } from "@/types/portfolio";

/**
 * SKILLS — SAMPLE CONTENT
 * No percentage bars: describe real experience instead. Project links on the
 * site are derived automatically by matching `name` against each project's
 * `technologies` list, so keep the names identical.
 */
export const SKILL_CATEGORIES: SkillCategory[] = [
  "Programming Languages",
  "Frontend Technologies",
  "Backend Technologies",
  "Databases",
  "Cloud Platforms",
  "DevOps",
  "Development Tools",
  "Other Technical Skills",
];

const s = (
  name: string,
  category: SkillCategory,
  experience?: string,
  description?: string,
): Skill => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  category,
  experience,
  description,
});

export const skills: Skill[] = [
  s("TypeScript", "Programming Languages", "Sample: daily use", "Primary language across frontend and backend."),
  s("JavaScript", "Programming Languages", "Sample: daily use"),
  s("Python", "Programming Languages", "Sample: scripting & data", "Automation and data tooling."),
  s("GLSL", "Programming Languages", "Sample: shader authoring", "Custom shaders for WebGL scenes."),
  s("React", "Frontend Technologies", "Sample: daily use", "Component architecture and performance tuning."),
  s("Next.js", "Frontend Technologies", "Sample: production apps"),
  s("Tailwind CSS", "Frontend Technologies", "Sample: design systems"),
  s("Three.js", "Frontend Technologies", "Sample: interactive 3D"),
  s("React Three Fiber", "Frontend Technologies", "Sample: declarative 3D"),
  s("GSAP", "Frontend Technologies", "Sample: motion & timelines"),
  s("Node.js", "Backend Technologies", "Sample: APIs and services"),
  s("Express", "Backend Technologies"),
  s("GraphQL", "Backend Technologies", "Sample: typed APIs"),
  s("PostgreSQL", "Databases", "Sample: schema design & tuning"),
  s("Redis", "Databases", "Sample: caching"),
  s("MongoDB", "Databases"),
  s("AWS", "Cloud Platforms", "Sample: compute, storage, networking"),
  s("Vercel", "Cloud Platforms", "Sample: deployment of Next.js apps"),
  s("Docker", "DevOps", "Sample: containerised services"),
  s("GitHub Actions", "DevOps", "Sample: CI/CD pipelines"),
  s("Terraform", "DevOps"),
  s("Git", "Development Tools", "Sample: daily use"),
  s("VS Code", "Development Tools"),
  s("Figma", "Development Tools", "Sample: design hand-off"),
  s("Accessibility (WCAG)", "Other Technical Skills", "Sample: audits and remediation"),
  s("Performance Optimisation", "Other Technical Skills", "Sample: Core Web Vitals"),
  s("Technical Writing", "Other Technical Skills"),
];
