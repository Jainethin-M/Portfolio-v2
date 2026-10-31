import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resolveShots, TOUR_TIMING } from "@/config/cameraPaths";
import { useNexusStore } from "@/stores/nexusStore";
import { releaseFocus, rigState } from "@/lib/camera/rigState";
import { clamp } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * TOUR ENGINE
 * -----------
 * ONE master GSAP timeline owns the camera path (it writes `rigState.t`).
 * Everything else only moves the playhead of that timeline:
 *
 *   auto   -> timeline.play()
 *   scroll -> ScrollTrigger progress -> timeline.tweenTo(time)
 *   paused -> timeline.pause()
 *   idle   -> timeline parked at the start (or the end after a finished tour)
 *
 * Modes are mutually exclusive: `onScroll` ignores input unless mode === "scroll",
 * and scrolling is disabled (CSS) outside that mode. Because the playhead is the
 * single source of truth, switching modes never loses progress.
 */

interface ShotTime {
  start: number;
  arrive: number;
  end: number;
}

let tl: gsap.core.Timeline | null = null;
let trigger: ScrollTrigger | null = null;
let spacer: HTMLElement | null = null;
let moveTween: gsap.core.Tween | null = null;
let shotTimes: ShotTime[] = [];
let duration = 0;
let seeking = false;
let reduced = false;

const store = () => useNexusStore.getState();

export function computeTourDuration(reducedMotion: boolean): number {
  return resolveShots(reducedMotion).reduce((sum, s) => sum + s.travel + s.dwell, 0);
}

function setScrollEnabled(on: boolean) {
  document.documentElement.classList.toggle("scroll-enabled", on);
}

function scrollMax() {
  return spacer ? Math.max(1, spacer.offsetHeight - window.innerHeight) : 1;
}

function syncScrollPosition() {
  if (!tl || duration === 0) return;
  window.scrollTo(0, (tl.time() / duration) * scrollMax());
}

function computeActive(time: number): { shot: number; docked: boolean } {
  let shot = 0;
  for (let k = 1; k < shotTimes.length; k++) {
    const { start, arrive } = shotTimes[k];
    if (time >= start + (arrive - start) * 0.5) shot = k;
  }
  if (shot === 0) return { shot, docked: time < 0.25 };
  const { arrive, end } = shotTimes[shot];
  return { shot, docked: time >= arrive - 0.3 && time <= end };
}

function sync() {
  if (!tl) return;
  const { shot, docked } = computeActive(tl.time());
  const effectiveDocked = docked && !seeking;
  const s = store();
  s.setActive(shot, effectiveDocked);
  if (!effectiveDocked && Object.keys(s.selection).length > 0) {
    s.clearSelection();
    releaseFocus();
  }
}

function onScroll(progress: number) {
  if (!tl || seeking || store().mode !== "scroll") return;
  const target = clamp(progress, 0, 1) * duration;
  if (Math.abs(target - tl.time()) < 0.01) return;
  const s = store();
  if (Object.keys(s.selection).length > 0) {
    s.clearSelection();
    releaseFocus();
  }
  moveTween?.kill();
  moveTween = tl.tweenTo(target, { duration: reduced ? 0.25 : 0.8, ease: "power3.out" });
}

function seek(index: number, onDone?: () => void, resumeAuto = true) {
  if (!tl) return;
  const wasAuto = resumeAuto && store().mode === "auto";
  const target = index <= 0 ? 0 : shotTimes[Math.min(index, shotTimes.length - 1)].arrive;
  moveTween?.kill();
  if (wasAuto) tl.pause();

  const distance = Math.abs(target - tl.time());
  const finish = () => {
    seeking = false;
    sync();
    if (wasAuto && store().mode === "auto") tl?.play();
    onDone?.();
  };

  if (distance < 0.05) {
    finish();
    return;
  }

  seeking = true;
  moveTween = tl.tweenTo(target, {
    duration: reduced ? 0.4 : clamp(distance * 0.22, 1.4, 4.2),
    ease: "power2.inOut",
    onUpdate: () => {
      if (store().mode === "scroll") syncScrollPosition();
    },
    onComplete: finish,
  });
}

function buildTimeline() {
  const shots = resolveShots(reduced);
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "none" },
    onUpdate: sync,
    onComplete: () => {
      if (store().mode === "auto") store().setMode("idle");
    },
  });

  shotTimes = [{ start: 0, arrive: 0, end: 0 }];
  let time = 0;
  for (let k = 1; k < shots.length; k++) {
    const { travel, dwell } = shots[k];
    const start = time;
    const arrive = start + travel;
    timeline.to(rigState, { t: k, dolly: 0, duration: travel, ease: reduced ? "power1.inOut" : "power2.inOut" }, start);
    if (!reduced) timeline.to(rigState, { dolly: 1, duration: dwell, ease: "sine.out" }, arrive);
    else timeline.to(rigState, { t: k, duration: dwell }, arrive);
    time = arrive + dwell;
    shotTimes.push({ start, arrive, end: time });
  }
  duration = time;
  return timeline;
}

export const tour = {
  init(spacerEl: HTMLElement, reducedMotion: boolean) {
    tour.destroy();
    spacer = spacerEl;
    reduced = reducedMotion;
    rigState.t = 0;
    rigState.dolly = 0;
    tl = buildTimeline();
    trigger = ScrollTrigger.create({
      trigger: spacerEl,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => onScroll(self.progress),
    });
    sync();
  },

  destroy() {
    moveTween?.kill();
    trigger?.kill();
    tl?.kill();
    moveTween = null;
    trigger = null;
    tl = null;
    spacer = null;
    seeking = false;
    if (typeof document !== "undefined") setScrollEnabled(false);
    rigState.t = 0;
    rigState.dolly = 0;
  },

  startAuto() {
    if (!tl) return;
    moveTween?.kill();
    seeking = false;
    releaseFocus();
    store().clearSelection();
    setScrollEnabled(false);
    if (tl.progress() >= 1) tl.progress(0);
    tl.timeScale(1).play();
    store().setMode("auto");
  },

  pause() {
    if (!tl || store().mode !== "auto") return;
    tl.pause();
    store().setMode("paused");
  },

  resume() {
    if (!tl || store().mode !== "paused") return;
    releaseFocus();
    store().clearSelection();
    tl.play();
    store().setMode("auto");
  },

  togglePause() {
    if (store().mode === "auto") tour.pause();
    else if (store().mode === "paused") tour.resume();
  },

  startScroll() {
    if (!tl) return;
    moveTween?.kill();
    seeking = false;
    tl.pause();
    setScrollEnabled(true);
    ScrollTrigger.refresh();
    syncScrollPosition();
    store().setMode("scroll");
  },

  /** Animate the playhead to a shot. From idle this enters scroll exploration. */
  goTo(index: number) {
    if (!tl) return;
    if (store().mode === "idle") tour.startScroll();
    releaseFocus();
    store().clearSelection();
    seek(index);
  },

  next() {
    tour.goTo(Math.min(store().activeShot + 1, shotTimes.length - 1));
  },

  prev() {
    tour.goTo(Math.max(store().activeShot - 1, 0));
  },

  replay() {
    if (!tl) return;
    releaseFocus();
    store().clearSelection();
    tl.pause();
    seek(0, () => tour.startAuto(), false);
  },

  /** Return to the landing view at the hub without a camera cut. */
  reset() {
    if (!tl) return;
    releaseFocus();
    store().clearSelection();
    tl.pause();
    seek(
      0,
      () => {
        setScrollEnabled(false);
        window.scrollTo(0, 0);
        store().setMode("idle");
      },
      false,
    );
  },

  /** Called when the visitor interacts with a 3D object during the auto tour. */
  interact() {
    if (store().mode === "auto") tour.pause();
  },

  getProgress() {
    return tl && duration > 0 ? tl.time() / duration : 0;
  },

  getShotCount() {
    return shotTimes.length;
  },
};

export const SCROLL_VH = (reducedMotion: boolean) =>
  Math.ceil(computeTourDuration(reducedMotion) * TOUR_TIMING.scrollVhPerSecond) + 100;
