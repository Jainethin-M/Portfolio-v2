"use client";

import { MapPin } from "lucide-react";
import { FOCUS } from "@/config/cameraPaths";
import { profile } from "@/data/profile";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { SocialLinks } from "@/components/ui/Social";
import { BulletList, PanelShell } from "@/components/ui/Panel";
import { toggleItem } from "@/lib/interaction";
import { useNexusStore } from "@/stores/nexusStore";

export function ProfilePanel() {
  const open = useNexusStore((s) => s.selection.profile === "details");
  return (
    <PanelShell station="profile">
      <div className="flex gap-4">
        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-nexus-cyan/40">
          <SafeImage
            src={profile.portrait}
            alt={profile.portraitAlt}
            sizes="96px"
            fallback={<Placeholder label={profile.initials} />}
          />
        </div>
        <div>
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="text-sm text-nexus-cyan">{profile.title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-nexus-muted">
            <MapPin size={12} aria-hidden="true" />
            {profile.location}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-nexus-text/90">{profile.bio[0]}</p>
      <button
        type="button"
        className="btn mt-3 !px-3 !py-2"
        aria-expanded={open}
        aria-controls="profile-details"
        onClick={() => toggleItem("profile", "details", "profile", FOCUS.profile)}
      >
        {open ? "Hide details" : "Expand details"}
      </button>
      <div id="profile-details" hidden={!open}>
        {profile.bio.slice(1).map((p) => (
          <p key={p} className="mt-3 text-sm leading-relaxed text-nexus-text/90">
            {p}
          </p>
        ))}
        <BulletList title="Career interests" items={profile.careerInterests} />
        <BulletList title="Professional goals" items={profile.goals} />
      </div>
      <SocialLinks links={profile.socials} className="mt-4" />
    </PanelShell>
  );
}
