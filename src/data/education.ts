import type { Education } from "@/types/portfolio";

/** EDUCATION — oldest first. Logos: public/logos/<file> referenced as "/logos/<file>". */
export const education: Education[] = [
  {
    id: "edu-bsc",
    institution: "KPR College of Arts Science and Research",
    degree: "B.Sc. Computer Science",
    field: "Computer Science",
    startYear: 2022,
    endYear: 2025,
    grade: "88%",
    description: "Bachelor's degree in Computer Science.",
    achievements: [],
  },
  {
    id: "edu-msc",
    institution: "Kathir Arts and Science College",
    degree: "M.Sc. Computer Science",
    field: "Computer Science",
    startYear: 2025,
    endYear: 2027,
    description: "Master's degree in Computer Science (pursuing).",
    achievements: [],
  },
];
