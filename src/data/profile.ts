import type { Profile } from "@/types/portfolio";

/**
 * PROFILE — SAMPLE CONTENT
 * Everything below is fictional placeholder text. Replace each value with your own.
 * Portrait: drop your photo at public/photos/portrait.webp (see README).
 * Résumé: drop your PDF at public/resume/resume.pdf.
 */
export const profile: Profile = {
  // REPLACE: your full name and the initials used by the avatar fallback.
  name: "Alex Morgan",
  initials: "AM",
  // REPLACE: your professional title.
  title: "Full-Stack & Creative Technologist",
  tagline: "Explore my digital universe — an interactive journey through my career.",
  shortIntro:
    "Sample profile: I design and build fast, accessible web products and immersive interactive experiences. Replace this text in src/data/profile.ts.",
  // REPLACE: your biography paragraphs.
  bio: [
    "This is sample biography text. Alex Morgan is a fictional engineer used to demonstrate the NEXUS portfolio template.",
    "Replace these paragraphs in src/data/profile.ts with your own story: what you build, how you work and what you care about.",
  ],
  location: "Sample City, Country",
  email: "hello@example.com",
  portrait: "/photos/portrait.webp",
  portraitAlt: "Portrait of Alex Morgan (sample)",
  resumeUrl: "/resume/resume.pdf",
  careerInterests: [
    "Interactive web experiences",
    "Developer tooling",
    "Real-time graphics",
    "Accessible design systems",
  ],
  goals: [
    "Lead the build of ambitious, user-centred products.",
    "Mentor engineers and share knowledge through open source.",
  ],
  // REPLACE: your real profile links. Remove any you do not use.
  socials: [
    { label: "GitHub", url: "https://github.com/", icon: "github" },
    { label: "LinkedIn", url: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "Email", url: "mailto:hello@example.com", icon: "mail" },
  ],
  seo: {
    title: "Alex Morgan — Full-Stack & Creative Technologist | NEXUS Portfolio",
    description:
      "Sample NEXUS portfolio: an interactive 3D command center presenting experience, skills, projects, certificates and achievements.",
  },
};
