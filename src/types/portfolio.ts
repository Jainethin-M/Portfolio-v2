export type StationId =
  | "profile"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certificates"
  | "achievements"
  | "contact";

export interface SocialLink {
  label: string;
  url: string;
  /** Icon key understood by <SocialIcon />: github | linkedin | twitter | mail | globe */
  icon: "github" | "linkedin" | "twitter" | "mail" | "globe";
}

export interface Profile {
  name: string;
  initials: string;
  title: string;
  tagline: string;
  shortIntro: string;
  bio: string[];
  location: string;
  email: string;
  /** Public path inside /public. Missing files fall back to a procedural avatar. */
  portrait: string;
  portraitAlt: string;
  resumeUrl: string;
  careerInterests: string[];
  goals: string[];
  socials: SocialLink[];
  seo: { title: string; description: string };
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | "Present";
  grade?: string;
  description: string;
  achievements: string[];
  logo?: string;
  location?: string;
}

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  location: string;
  /** ISO month, e.g. "2022-03" */
  startDate: string;
  /** ISO month or "Present" */
  endDate: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  logo?: string;
  /** Project slugs from data/projects.ts */
  relatedProjects?: string[];
}

export type SkillCategory =
  | "Programming Languages"
  | "Frontend Technologies"
  | "Backend Technologies"
  | "Databases"
  | "Cloud Platforms"
  | "DevOps"
  | "Development Tools"
  | "Other Technical Skills";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** Short honest description of experience. No percentages. */
  description?: string;
  /** Free-form note such as "5 years, daily use". */
  experience?: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  featured: boolean;
  technologies: string[];
  images: ProjectImage[];
  features: string[];
  architecture: string;
  challenges: string[];
  solutions: string[];
  outcomes: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  /** Preview image path in /public/certificates */
  previewImage?: string;
  /** PDF path in /public/certificates */
  pdf?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  story: string;
  image?: string;
  imageAlt?: string;
  relatedProject?: string;
  evidenceUrl?: string;
}
