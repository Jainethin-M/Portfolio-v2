"use client";

import { useEffect, type ReactNode } from "react";
import { AssetsProvider } from "@/components/ui/AssetsContext";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { Boot } from "@/components/tour/Boot";
import { Immersive } from "@/components/tour/Immersive";
import { detectQualityTier } from "@/lib/quality";
import { detectWebGL } from "@/lib/webgl";
import { useNexusStore } from "@/stores/nexusStore";

function setStoredView(view: "3d" | "classic") {
  try {
    localStorage.setItem("nexus:view", view);
  } catch {
    /* storage unavailable */
  }
}

function ClassicBar({ canEnter3D }: { canEnter3D: boolean }) {
  const setView = useNexusStore((s) => s.setView);
  const setWebgl = useNexusStore((s) => s.setWebgl);
  return (
    <div className="sticky top-0 z-40 border-b border-nexus-cyan/20 bg-nexus-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <p className="font-display text-lg font-bold tracking-[0.3em] text-nexus-cyan">NEXUS</p>
        <div className="flex flex-wrap items-center gap-2">
          <ResumeButton className="!px-3 !py-2" />
          {canEnter3D && (
            <button
              type="button"
              className="btn btn-primary !px-3 !py-2"
              onClick={() => {
                setStoredView("3d");
                setWebgl("yes");
                setView("3d");
                window.scrollTo(0, 0);
              }}
            >
              Enter 3D experience
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NexusApp({ existingAssets, children }: { existingAssets: string[]; children: ReactNode }) {
  const webgl = useNexusStore((s) => s.webgl);
  const view = useNexusStore((s) => s.view);

  useEffect(() => {
    const store = useNexusStore.getState();
    const supported = detectWebGL();
    store.setWebgl(supported ? "yes" : "no");
    store.setQuality(detectQualityTier());

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    store.setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => useNexusStore.getState().setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    let saved: string | null = null;
    try {
      saved = localStorage.getItem("nexus:view");
    } catch {
      /* storage unavailable */
    }
    const requested = new URLSearchParams(window.location.search).get("view");
    if (!supported || saved === "classic" || requested === "classic") store.setView("classic");

    return () => mq.removeEventListener("change", onChange);
  }, []);

  const show3d = webgl === "yes" && view === "3d";
  const showClassic = webgl !== "unknown" && !show3d;
  const Wrapper = show3d ? "div" : "main";

  return (
    <AssetsProvider existing={existingAssets}>
      <a
        href={show3d ? "#nexus-content" : "#classic-main"}
        className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>
      {show3d ? <Immersive /> : webgl === "unknown" ? <Boot enabled={false} /> : null}
      {/* Real HTML content stays in the DOM for search engines, no-JS visitors and the text view. */}
      <Wrapper
        id="classic-main"
        {...(show3d ? { inert: true, "aria-hidden": true } : {})}
        className={show3d || webgl === "unknown" ? "nexus-seo sr-only-seo" : ""}
      >
        {showClassic && <ClassicBar canEnter3D={webgl === "yes"} />}
        {children}
      </Wrapper>
    </AssetsProvider>
  );
}
