import { Github, Globe, Linkedin, Mail, Twitter, type LucideIcon } from "lucide-react";
import type { SocialLink } from "@/types/portfolio";

const ICONS: Record<SocialLink["icon"], LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
};

export function SocialIcon({ icon, size = 16 }: { icon: SocialLink["icon"]; size?: number }) {
  const Icon = ICONS[icon] ?? Globe;
  return <Icon size={size} aria-hidden="true" />;
}

export function SocialLinks({ links, className = "" }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((l) => {
        const external = !l.url.startsWith("mailto:");
        return (
          <li key={l.label}>
            <a
              href={l.url}
              className="btn !px-3 !py-2"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <SocialIcon icon={l.icon} />
              {l.label}
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
