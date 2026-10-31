import type { Achievement } from "@/types/portfolio";

/**
 * ACHIEVEMENTS — SAMPLE CONTENT (fictional)
 * `relatedProject` takes a slug from src/data/projects.ts.
 * Images live in public/achievements/ (optional).
 */
export const achievements: Achievement[] = [
  {
    id: "ach-hackathon",
    title: "Sample: First Place, Global Web Hackathon",
    category: "Competition",
    date: "2023-09",
    description: "Sample entry: led a team of four to build a 3D accessibility explorer in 48 hours.",
    story:
      "Sample story. Replace this with the narrative behind the achievement: the problem, how your team approached it and what you learned.",
    relatedProject: "nebula-viewer",
    evidenceUrl: "https://example.com/hackathon",
  },
  {
    id: "ach-open-source",
    title: "Sample: Open Source Contributor of the Year",
    category: "Community",
    date: "2022-12",
    description: "Sample entry: recognised for maintaining a popular animation utility library.",
    story:
      "Sample story. Explain what you maintained, how large the community was and the impact of the contributions.",
    evidenceUrl: "https://example.com/oss",
  },
  {
    id: "ach-performance",
    title: "Sample: Engineering Excellence Award",
    category: "Professional",
    date: "2024-06",
    description: "Sample entry: awarded for a platform-wide performance initiative.",
    story:
      "Sample story. Describe the initiative, the measurable improvements and the teams you collaborated with.",
    relatedProject: "orbit-dashboard",
  },
  {
    id: "ach-speaker",
    title: "Sample: Conference Speaker",
    category: "Speaking",
    date: "2023-03",
    description: "Sample entry: delivered a talk on real-time 3D on the web.",
    story: "Sample story. Mention the audience, the topic and any follow-up writing or resources.",
  },
];
