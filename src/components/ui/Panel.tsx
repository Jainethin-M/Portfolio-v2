import type { ReactNode } from "react";
import type { StationId } from "@/types/portfolio";
import { STATIONS, STATION_BY_ID } from "@/config/stations";

export function PanelShell({ station, children, actions }: { station: StationId; children: ReactNode; actions?: ReactNode }) {
  const def = STATION_BY_ID[station];
  const index = STATIONS.findIndex((s) => s.id === station) + 1;
  return (
    <section
      aria-labelledby={`panel-${station}-title`}
      className="glass pointer-events-auto flex max-h-[48vh] min-h-0 flex-col overflow-hidden animate-fade-up lg:max-h-full"
    >
      <header className="flex items-start justify-between gap-3 px-4 pb-2 pt-4 md:px-5 md:pt-5">
        <div>
          <p className="eyebrow">
            Station {String(index).padStart(2, "0")} · {def.codename}
          </p>
          <h2 id={`panel-${station}-title`} className="mt-1 text-xl font-semibold md:text-2xl">
            {def.label}
          </h2>
        </div>
        {actions}
      </header>
      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-5 md:pb-5">{children}</div>
    </section>
  );
}

export function ItemButton({
  active,
  onClick,
  eyebrow,
  title,
  subtitle,
  controls,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  controls: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="item-button disabled:opacity-40"
      aria-expanded={active}
      aria-controls={controls}
      onClick={onClick}
      disabled={disabled}
    >
      {eyebrow && <span className="block font-mono text-[11px] uppercase tracking-widest text-nexus-cyan">{eyebrow}</span>}
      <span className="block text-sm font-semibold text-nexus-text">{title}</span>
      {subtitle && <span className="block text-xs text-nexus-muted">{subtitle}</span>}
    </button>
  );
}

export function StepNav({ onPrev, onNext, onClose, label }: { onPrev: () => void; onNext: () => void; onClose: () => void; label: string }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={`${label} navigation`}>
      <button type="button" className="btn !px-3 !py-2" onClick={onPrev}>
        Previous
      </button>
      <button type="button" className="btn !px-3 !py-2" onClick={onNext}>
        Next
      </button>
      <button type="button" className="btn !px-3 !py-2" onClick={onClose}>
        Back to overview
      </button>
    </div>
  );
}

export function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <h3 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-nexus-muted">{title}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-nexus-text/90">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
