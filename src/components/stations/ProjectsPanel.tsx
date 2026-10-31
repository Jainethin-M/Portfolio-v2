"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/projects";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { BulletList, ItemButton, PanelShell, StepNav } from "@/components/ui/Panel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { allProjectCategories, allProjectTechnologies, matchesProjectFilter } from "@/lib/projects";
import { projectFocus } from "@/lib/stationFocus";
import { useNexusStore } from "@/stores/nexusStore";

const ids = projects.map((p) => p.slug);
const categories = allProjectCategories();
const technologies = allProjectTechnologies();

export function ProjectsPanel() {
  const sel = useItemSelection("project", "projects", ids, projectFocus);
  const tech = useNexusStore((s) => s.projectTech);
  const category = useNexusStore((s) => s.projectCategory);
  const setTech = useNexusStore((s) => s.setProjectTech);
  const setCategory = useNexusStore((s) => s.setProjectCategory);

  return (
    <PanelShell station="projects">
      <div className="space-y-3">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          {["All", ...categories].map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="project-tech" className="field-label">
            Technology
          </label>
          <select id="project-tech" className="field" value={tech} onChange={(e) => setTech(e.target.value)}>
            <option value="All">All technologies</option>
            {technologies.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {projects.map((p) => {
          const active = sel.selected === p.slug;
          const matches = matchesProjectFilter(p, tech, category);
          if (!matches) return null;
          return (
            <li key={p.slug}>
              <ItemButton
                active={active}
                onClick={() => sel.toggle(p.slug)}
                eyebrow={`${p.category}${p.featured ? " · Featured" : ""}`}
                title={p.title}
                subtitle={p.shortDescription}
                controls={`project-${p.slug}`}
              />
              <div id={`project-${p.slug}`} hidden={!active} className="mt-2 rounded-xl border border-white/10 p-3 text-sm">
                {active && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {p.images.length > 0 ? (
                        p.images.slice(0, 4).map((img) => (
                          <div key={img.src} className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                            <SafeImage src={img.src} alt={img.alt} fallback={<Placeholder label="Image unavailable" />} sizes="200px" />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 aspect-[16/6] overflow-hidden rounded-lg border border-white/10">
                          <Placeholder label="Project images coming soon" />
                        </div>
                      )}
                    </div>
                    <p className="mt-3 leading-relaxed text-nexus-text/90">{p.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                      {p.technologies.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <BulletList title="Key features" items={p.features} />
                    <details className="mt-3 rounded-lg border border-white/10 p-2">
                      <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-nexus-cyan">
                        Architecture, challenges &amp; outcomes
                      </summary>
                      <p className="mt-2 text-nexus-text/90">{p.architecture}</p>
                      <BulletList title="Challenges" items={p.challenges} />
                      <BulletList title="Solutions" items={p.solutions} />
                      <BulletList title="Outcomes" items={p.outcomes} />
                    </details>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href={`/projects/${p.slug}`} className="btn btn-primary !px-3 !py-2">
                        Case study
                      </Link>
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                          <Github size={14} aria-hidden="true" />
                          GitHub<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                          <ExternalLink size={14} aria-hidden="true" />
                          Live demo<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                    <StepNav onPrev={sel.prev} onNext={sel.next} onClose={sel.clear} label="Projects" />
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {projects.every((p) => !matchesProjectFilter(p, tech, category)) && (
        <p className="mt-3 text-sm text-nexus-muted">
          No projects match these filters.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setTech("All");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </p>
      )}
    </PanelShell>
  );
}
