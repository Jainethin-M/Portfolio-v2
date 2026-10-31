"use client";

import { FOCUS } from "@/config/cameraPaths";
import { profile } from "@/data/profile";
import { ContactForm } from "@/components/ui/ContactForm";
import { PanelShell } from "@/components/ui/Panel";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { SocialLinks } from "@/components/ui/Social";
import { toggleItem } from "@/lib/interaction";
import { useNexusStore } from "@/stores/nexusStore";

export function ContactPanel() {
  const focused = useNexusStore((s) => s.selection.contact === "console");
  return (
    <PanelShell station="contact">
      <p className="text-sm text-nexus-text/90">
        Email me at{" "}
        <a href={`mailto:${profile.email}`} className="text-nexus-cyan underline underline-offset-2">
          {profile.email}
        </a>{" "}
        or use the form below.
      </p>
      {profile.phone && (
        <p className="mt-2 text-sm text-nexus-text/90">
          Phone:{" "}
          <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="text-nexus-cyan underline underline-offset-2">
            {profile.phone}
          </a>
        </p>
      )}
      <SocialLinks links={profile.socials} className="mt-3" />
      <div className="mt-3 flex flex-wrap gap-2">
        <ResumeButton />
        <button
          type="button"
          className="btn !px-3 !py-2"
          aria-pressed={focused}
          onClick={() => toggleItem("contact", "console", "contact", FOCUS.contactConsole)}
        >
          {focused ? "Release console view" : "Focus on console"}
        </button>
      </div>
      <div className="mt-5">
        <ContactForm idPrefix="station-contact" />
      </div>
    </PanelShell>
  );
}
