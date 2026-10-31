import fs from "node:fs";
import path from "node:path";
import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { achievements } from "@/data/achievements";

/** Public-folder paths referenced by the data files (server-only helper). */
function referencedAssets(): string[] {
  const list: (string | undefined)[] = [
    profile.portrait,
    profile.resumeUrl,
    ...education.map((e) => e.logo),
    ...experience.map((e) => e.logo),
    ...projects.flatMap((p) => p.images.map((i) => i.src)),
    ...certificates.flatMap((c) => [c.pdf, c.previewImage]),
    ...achievements.map((a) => a.image),
  ];
  return [...new Set(list.filter((p): p is string => Boolean(p) && p!.startsWith("/")))];
}

/** Returns the subset of referenced assets that really exist in /public. */
export function existingAssets(): string[] {
  const root = path.join(process.cwd(), "public");
  return referencedAssets().filter((p) => {
    try {
      return fs.existsSync(path.join(root, p));
    } catch {
      return false;
    }
  });
}
