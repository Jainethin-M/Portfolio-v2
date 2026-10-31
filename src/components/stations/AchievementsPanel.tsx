"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { achievements } from "@/data/achievements";
import { ItemButton, PanelShell, StepNav } from "@/components/ui/Panel";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { useItemSelection } from "@/hooks/useItemSelection";
import { getProject } from "@/lib/projects";
import { achievementFocus } from "@/lib/stationFocus";
import { formatMonth } from "@/lib/utils";

const ids = achievements.map((a) => a.id);

export function AchievementsPanel() {
  const sel = useItemSelection("achievement", "achievements", ids, achievementFocus);
  const [storyOpen, setStoryOpen] = useState<string | null>(null);

  return (
    <PanelShell station="achievements">
      {sel.index < 0 && <p className="mb-3 text-sm text-nexus-muted">Select an artifact, or choose one below.</p>}
      <ol className="space-y-2">
        {achievements.map((a) => {
          const active = sel.selected === a.id;
          const project = a.relatedProject ? getProject(a.relatedProject) : undefined;
          return (
            <li key={a.id}>
              <ItemButton active={active} onClick={() => sel.toggle(a.id)} eyebrow={`${a.category} · ${formatMonth(a.date)}`} title={a.title} controls={`ach-${a.id}`} />
              <div id={`ach-${a.id}`} hidden={!active} className="mt-2 rounded-xl border border-white/10 p-3 text-sm">
                {active && (
                  <>
                    {a.image && (
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg border border-white/10">
                        <SafeImage src={a.image} alt={a.imageAlt ?? a.title} fallback={<Placeholder label="Image unavailable" />} />
                      </div>
                    )}
                    <p className="leading-relaxed text-nexus-text/90">{a.description}</p>
                    <button
                      type="button"
                      className="btn mt-3 !px-3 !py-2"
                      aria-expanded={storyOpen === a.id}
                      aria-controls={`ach-story-${a.id}`}
                      onClick={() => setStoryOpen(storyOpen === a.id ? null : a.id)}
                    >
                      {storyOpen === a.id ? "Hide the story" : "Read the story"}
                    </button>
                    <p id={`ach-story-${a.id}`} hidden={storyOpen !== a.id} className="mt-3 rounded-lg border border-nexus-violet/40 bg-nexus-violet/10 p-3 leading-relaxed">
                      {a.story}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project && (
                        <Link href={`/projects/${project.slug}`} className="btn !px-3 !py-2">
                          Related project: {project.title}
                        </Link>
                      )}
                      {a.evidenceUrl && (
                        <a href={a.evidenceUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                          <ExternalLink size={14} aria-hidden="true" />
                          Evidence<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                    <StepNav onPrev={sel.prev} onNext={sel.next} onClose={sel.clear} label="Achievements" />
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </PanelShell>
  );
}
