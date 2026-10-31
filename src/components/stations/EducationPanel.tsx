"use client";

import { education } from "@/data/education";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { BulletList, ItemButton, PanelShell, StepNav } from "@/components/ui/Panel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { educationFocus } from "@/lib/stationFocus";

const ids = education.map((e) => e.id);

export function EducationPanel() {
  const sel = useItemSelection("education", "education", ids, educationFocus);
  return (
    <PanelShell station="education">
      {sel.index < 0 && (
        <p className="mb-3 text-sm text-nexus-muted">Select a milestone in the archive, or choose one below.</p>
      )}
      <ol className="space-y-2">
        {education.map((e) => {
          const active = sel.selected === e.id;
          return (
            <li key={e.id}>
              <ItemButton
                active={active}
                onClick={() => sel.toggle(e.id)}
                eyebrow={`${e.startYear} – ${e.endYear}`}
                title={e.institution}
                subtitle={`${e.degree} · ${e.field}`}
                controls={`edu-${e.id}`}
              />
              <div id={`edu-${e.id}`} hidden={!active} className="mt-2 rounded-xl border border-white/10 p-3 text-sm">
                {active && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10">
                        <SafeImage src={e.logo} alt={`${e.institution} logo`} sizes="48px" fallback={<Placeholder label={e.institution.slice(0, 2)} />} />
                      </div>
                      <div>
                        <p className="font-semibold">{e.degree}</p>
                        <p className="text-xs text-nexus-muted">
                          {e.field}
                          {e.location ? ` · ${e.location}` : ""}
                        </p>
                      </div>
                    </div>
                    {e.grade && <p className="mt-2 font-mono text-xs text-nexus-cyan">Grade: {e.grade}</p>}
                    <p className="mt-2 leading-relaxed text-nexus-text/90">{e.description}</p>
                    <BulletList title="Achievements" items={e.achievements} />
                    <StepNav onPrev={sel.prev} onNext={sel.next} onClose={sel.clear} label="Education" />
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
