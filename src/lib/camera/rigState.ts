import gsap from "gsap";
import { Vector3 } from "three";
import { FOCUS, INTRO, type Vec3 } from "@/config/cameraPaths";

/**
 * Mutable camera state read every frame by <CameraRig />.
 * Never stored in React state: GSAP writes it, the render loop reads it.
 *
 * - `t`      : position along the shot list (driven ONLY by the master tour timeline)
 * - `dolly`  : slow push-in while resting at a shot (also timeline driven)
 * - `intro`  : opening fly-in offset, 1 -> 0
 * - `focus*` : optional layer that blends the camera toward a selected object
 */
export const rigState = {
  t: 0,
  dolly: 0,
  intro: 1,
  focusWeight: 0,
  focusPos: new Vector3(),
  focusTarget: new Vector3(),
};

export function focusCamera(position: Vec3, target: Vec3, duration: number = FOCUS.duration) {
  if (rigState.focusWeight < 0.001) {
    rigState.focusPos.set(...position);
    rigState.focusTarget.set(...target);
  } else {
    gsap.to(rigState.focusPos, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration,
      ease: "power3.inOut",
      overwrite: true,
    });
    gsap.to(rigState.focusTarget, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration,
      ease: "power3.inOut",
      overwrite: true,
    });
  }
  gsap.to(rigState, { focusWeight: 1, duration, ease: "power3.inOut", overwrite: "auto" });
}

export function releaseFocus(duration = 1) {
  if (rigState.focusWeight <= 0.001) return;
  gsap.to(rigState, { focusWeight: 0, duration, ease: "power2.inOut", overwrite: "auto" });
}

export function playIntro(reducedMotion: boolean) {
  gsap.killTweensOf(rigState, "intro");
  if (reducedMotion) {
    rigState.intro = 0;
    return;
  }
  rigState.intro = 1;
  gsap.to(rigState, { intro: 0, duration: INTRO.duration, ease: "power3.out" });
}

export function skipIntro() {
  gsap.killTweensOf(rigState, "intro");
  gsap.to(rigState, { intro: 0, duration: 0.5, ease: "power2.out" });
}
