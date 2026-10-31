"use client";

import Link from "next/link";
import { experience } from "@/data/experience";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { BulletList, ItemButton, PanelShell, StepNav } from "@/components/ui/Panel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { getProject } from "@/lib/projects";
import { experienceFocus } from "@/lib/stationFocus";
import { formatRange, joinMeta } from "@/lib/utils";

const ids = experience.map((e) => e.id);

export function ExperiencePanel() {
  const sel = useItemSelection("experience", "experience", ids, experienceFocus);
  return (
    <PanelShell station="experience">
      {sel.index < 0 && <p className="mb-3 text-sm text-nexus-muted">Select a mission pod, or choose a role below.</p>}
      <ol className="space-y-2">
        {experience.map((e) => {
          const active = sel.selected === e.id;
          const range = formatRange(e.startDate, e.endDate);
          return (
            <li key={e.id}>
              <ItemButton active={active} onClick={() => sel.toggle(e.id)} eyebrow={range} title={`${e.position} · ${e.company}`} subtitle={joinMeta(e.employmentType, e.location)} controls={`exp-${e.id}`} />
              <div id={`exp-${e.id}`} hidden={!active} className="mt-2 rounded-xl border border-white/10 p-3 text-sm">
                {active && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10">
                        <SafeImage src={e.logo} alt={`${e.company} logo`} sizes="48px" fallback={<Placeholder label={e.company.slice(0, 2)} />} />
                      </div>
                      <div>
                        <p className="font-semibold">{e.position}</p>
                        <p className="text-xs text-nexus-muted">
                          {joinMeta(e.company, e.employmentType, e.location)}
                        </p>
                      </div>
                    </div>
                    <BulletList title="Responsibilities" items={e.responsibilities} />
                    <details className="mt-3 rounded-lg border border-white/10 p-2" open>
                      <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-nexus-cyan">
                        Achievements
                      </summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {e.achievements.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </details>
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
                      {e.technologies.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                    {e.relatedProjects && e.relatedProjects.length > 0 && (
                      <div className="mt-3">
                        <h3 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-nexus-muted">Related projects</h3>
                        <ul className="flex flex-wrap gap-2">
                          {e.relatedProjects.map((slug) => {
                            const p = getProject(slug);
                            return p ? (
                              <li key={slug}>
                                <Link href={`/projects/${slug}`} className="btn !px-3 !py-1.5">
                                  {p.title}
                                </Link>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                    <StepNav onPrev={sel.prev} onNext={sel.next} onClose={sel.clear} label="Experience" />
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
