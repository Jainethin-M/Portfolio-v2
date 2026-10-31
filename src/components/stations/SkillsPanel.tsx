"use client";

import Link from "next/link";
import { FOCUS } from "@/config/cameraPaths";
import { SKILL_CATEGORIES, skills } from "@/data/skills";
import { BulletList, PanelShell } from "@/components/ui/Panel";
import { deselectItem, toggleItem } from "@/lib/interaction";
import { projectsUsing } from "@/lib/projects";
import { shotIndexOf } from "@/lib/stationFocus";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";

export function SkillsPanel() {
  const category = useNexusStore((s) => s.skillCategory);
  const setCategory = useNexusStore((s) => s.setSkillCategory);
  const setProjectTech = useNexusStore((s) => s.setProjectTech);
  const selectedId = useNexusStore((s) => s.selection.skill);
  const skill = skills.find((s) => s.id === selectedId);
  const visible = category === "All" ? skills : skills.filter((s) => s.category === category);
  const related = skill ? projectsUsing(skill.name) : [];

  return (
    <PanelShell station="skills">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
        {(["All", ...SKILL_CATEGORIES] as const).map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
        {visible.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="chip !py-1.5 !text-xs"
              aria-pressed={selectedId === s.id}
              onClick={() => toggleItem("skill", s.id, "skills", FOCUS.reactor)}
            >
              {s.name}
            </button>
          </li>
        ))}
      </ul>

      <div aria-live="polite" className="mt-4">
        {skill ? (
          <article className="rounded-xl border border-nexus-cyan/40 bg-nexus-cyan/5 p-3 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-widest text-nexus-cyan">{skill.category}</p>
            <h3 className="mt-1 text-lg font-semibold">{skill.name}</h3>
            {skill.experience && <p className="mt-1 text-xs text-nexus-muted">{skill.experience}</p>}
            {skill.description && <p className="mt-2 text-nexus-text/90">{skill.description}</p>}
            {related.length > 0 ? (
              <div className="mt-3">
                <h4 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-nexus-muted">Projects using {skill.name}</h4>
                <ul className="flex flex-wrap gap-2">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/projects/${p.slug}`} className="btn !px-3 !py-1.5">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="btn btn-violet mt-3 !px-3 !py-2"
                  onClick={() => {
                    setProjectTech(skill.name);
                    tour.goTo(shotIndexOf("projects"));
                  }}
                >
                  Show in Mission Control
                </button>
              </div>
            ) : (
              <BulletList title="Projects" items={["No listed project uses this yet."]} />
            )}
            <button type="button" className="btn mt-3 !px-3 !py-2" onClick={() => deselectItem("skill")}>
              Back to reactor
            </button>
          </article>
        ) : (
          <p className="text-sm text-nexus-muted">Select a node on the reactor or a skill above for details.</p>
        )}
      </div>
    </PanelShell>
  );
}
