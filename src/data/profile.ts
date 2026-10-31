import type { Profile } from "@/types/portfolio";

/**
 * PROFILE
 * Portrait: drop your photo at public/photos/portrait.webp (see README).
 * Résumé: public/resume/resume.pdf.
 */
export const profile: Profile = {
  name: "Jainethin M",
  initials: "JM",
  title: "Full‑Stack Developer (MERN)",
  tagline: "Explore my digital universe — an interactive journey through my career.",
  shortIntro:
    "I build clean, fast web apps with React and Node.js. I love debugging, deep‑diving into systems, and shipping projects people can actually use.",
  bio: [
    "I'm a Computer Science graduate focused on full‑stack development. I enjoy solving problems, building practical applications, and helping others learn through clear explanations.",
    "Debugging‑first mindset: I trace issues to root cause and fix them cleanly. Product thinking: I build around real workflows such as events, student utilities and tracking tools.",
  ],
  location: "Coimbatore, Tamil Nadu, India",
  email: "jainethin59@gmail.com",
  phone: "+91 88255 78817",
  portrait: "/photos/portrait.webp",
  portraitAlt: "Portrait of Jainethin M",
  resumeUrl: "/resume/resume.pdf",
  careerInterests: ["Full‑stack web development", "Cybersecurity", "Cloud", "AI"],
  goals: [
    "Open to Full‑Stack roles in Coimbatore, Bangalore, Hyderabad and Chennai.",
    "Currently learning cybersecurity fundamentals alongside work.",
  ],
  socials: [
    { label: "GitHub", url: "https://github.com/Jainethin-M", icon: "github" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/jainethin-m/", icon: "linkedin" },
    { label: "CodeChef", url: "https://www.codechef.com/users/jainethin123", icon: "globe" },
    { label: "LeetCode", url: "https://leetcode.com/u/lJnsJQILgv/", icon: "globe" },
    { label: "Email", url: "mailto:jainethin59@gmail.com", icon: "mail" },
  ],
  seo: {
    title: "Jainethin M — Full‑Stack Developer (MERN) | NEXUS Portfolio",
    description:
      "Jainethin M — Full‑Stack Developer (MERN). React, Node.js, MongoDB, Next.js, NestJS. Projects: Event Hoster, Name Picker, Personal OS (WIP).",
  },
};
