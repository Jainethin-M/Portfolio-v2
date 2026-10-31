import type { Achievement } from "@/types/portfolio";

/**
 * ACHIEVEMENTS
 * `date` and `story` are optional. `relatedProject` takes a slug from projects.ts.
 */
export const achievements: Achievement[] = [
  {
    id: "ach-codechef",
    title: "367 problems solved on CodeChef",
    category: "Problem solving",
    description: "Consistent competitive programming practice on CodeChef.",
    evidenceUrl: "https://www.codechef.com/users/jainethin123",
  },
  {
    id: "ach-leetcode",
    title: "180+ problems solved on LeetCode",
    category: "Problem solving",
    description: "Data structures and algorithms practice, with solutions kept in a public C++ repository.",
    relatedProject: "leetcode-solutions",
    evidenceUrl: "https://leetcode.com/u/lJnsJQILgv/",
  },
  {
    id: "ach-idea",
    title: "Idea Presentation — Shri Krishna College",
    category: "Participation",
    description: "Participated in the idea presentation event at Shri Krishna College.",
  },
  {
    id: "ach-debugging",
    title: "Debugging — Hindusthan College",
    category: "Participation",
    description: "Participated in the debugging event at Hindusthan College.",
  },
  {
    id: "ach-community",
    title: "College events and mentoring",
    category: "Community",
    description: "Conducted college events and guided juniors on career growth and coding.",
  },
];
