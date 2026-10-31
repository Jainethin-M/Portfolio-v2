import type { Education } from "@/types/portfolio";

/**
 * EDUCATION — SAMPLE CONTENT (fictional)
 * Add, remove or reorder entries (oldest first reads best on the timeline).
 * Logos: place files under public/logos/ and reference them as "/logos/name.svg".
 */
export const education: Education[] = [
  {
    id: "edu-secondary",
    institution: "Sample Secondary School",
    degree: "Higher Secondary Certificate",
    field: "Science & Mathematics",
    startYear: 2012,
    endYear: 2014,
    grade: "Sample grade",
    location: "Sample City",
    description:
      "Sample entry. Foundation in mathematics and computing, plus an introduction to programming.",
    achievements: ["Sample: school robotics club lead", "Sample: regional maths olympiad participant"],
  },
  {
    id: "edu-bachelors",
    institution: "Sample University of Technology",
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    startYear: 2014,
    endYear: 2018,
    grade: "CGPA 8.4 / 10 (sample)",
    location: "Sample City",
    description:
      "Sample entry. Core computer science with electives in graphics, distributed systems and human-computer interaction.",
    achievements: [
      "Sample: graduated with distinction",
      "Sample: capstone project on real-time visualisation",
    ],
  },
  {
    id: "edu-masters",
    institution: "Example Institute of Advanced Studies",
    degree: "Master of Science",
    field: "Human-Centred Computing",
    startYear: 2018,
    endYear: 2020,
    grade: "Sample: First Class",
    location: "Example Town",
    description:
      "Sample entry. Research on interactive 3D interfaces and accessibility in immersive media.",
    achievements: ["Sample: thesis nominated for department award"],
  },
];
