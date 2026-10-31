"use client";

import { Download, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { useAsset } from "./AssetsContext";

/**
 * Downloads the résumé when /public/resume/resume.pdf exists; otherwise offers a
 * working email request so the button is never dead.
 */
export function ResumeButton({ variant = "default", className = "" }: { variant?: "default" | "primary"; className?: string }) {
  const exists = useAsset(profile.resumeUrl);
  const base = `btn ${variant === "primary" ? "btn-primary" : ""} ${className}`;

  if (exists) {
    return (
      <a href={profile.resumeUrl} download className={base}>
        <Download size={14} aria-hidden="true" />
        Download Résumé
      </a>
    );
  }
  const subject = encodeURIComponent(`Résumé request — ${profile.name}`);
  return (
    <a href={`mailto:${profile.email}?subject=${subject}`} className={base}>
      <FileText size={14} aria-hidden="true" />
      Request Résumé
    </a>
  );
}
