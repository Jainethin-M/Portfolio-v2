import type { Skill, SkillCategory } from "@/types/portfolio";

/**
 * SKILLS
 * No percentage bars. Project links are derived by matching `name` against each
 * project's `technologies`, so keep the names identical.
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
  s("JavaScript", "Programming Languages"),
  s("C", "Programming Languages"),
  s("C++", "Programming Languages"),
  s("Java", "Programming Languages"),
  s("Python", "Programming Languages"),
  s("Kotlin", "Programming Languages"),
  s("HTML", "Frontend Technologies"),
  s("CSS", "Frontend Technologies"),
  s("React", "Frontend Technologies"),
  s("Next.js", "Frontend Technologies"),
  s("Vite", "Frontend Technologies"),
  s("Node.js", "Backend Technologies"),
  s("Express", "Backend Technologies"),
  s("NestJS", "Backend Technologies"),
  s("REST APIs", "Backend Technologies"),
  s("Authentication (JWT)", "Backend Technologies"),
  s("MongoDB", "Databases"),
  s("SQL", "Databases"),
  s("Cloud basics", "Cloud Platforms", "Currently learning"),
  s("Git", "Development Tools"),
  s("GitHub", "Development Tools"),
  s("NPM", "Development Tools"),
  s("Postman", "Development Tools"),
  s("Debugging", "Other Technical Skills"),
  s("DSA", "Other Technical Skills", undefined, "Data structures and algorithms; practised on CodeChef and LeetCode."),
  s("Cybersecurity fundamentals", "Other Technical Skills", "Currently learning"),
  s("AI tools", "Other Technical Skills", "Currently learning"),
  s("Communication", "Other Technical Skills"),
  s("Teamwork", "Other Technical Skills"),
  s("Problem Solving", "Other Technical Skills"),
  s("Time Management", "Other Technical Skills"),
  s("Adaptability", "Other Technical Skills"),
];
