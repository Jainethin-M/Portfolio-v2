import type { Experience } from "@/types/portfolio";

/**
 * EXPERIENCE — oldest first.
 * Dates accept "YYYY-MM", a plain year such as "2025", or "" when unknown.
 */
export const experience: Experience[] = [
  {
    id: "exp-gateway",
    company: "Gateway Software Solutions",
    position: "Web Technologies Intern",
    employmentType: "Internship",
    startDate: "",
    endDate: "",
    responsibilities: ["Strengthened front‑end fundamentals using HTML, CSS, and JavaScript."],
    achievements: ["Built webpages and small web apps while learning best practices."],
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "exp-ellucian",
    company: "Ellucian",
    position: "Technical Intern",
    employmentType: "Internship",
    startDate: "2025",
    endDate: "2025",
    responsibilities: [
      "Worked on an education‑focused project and contributed to assigned tasks.",
      "Helped peers by explaining concepts and unblocking issues when needed.",
    ],
    achievements: [
      "Participated in a hackathon environment and improved speed through iterative debugging.",
    ],
    technologies: [],
  },
];
