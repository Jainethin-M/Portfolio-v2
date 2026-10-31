"use client";

import { Profile3D } from "./Profile3D";
import { Education3D } from "./Education3D";
import { Experience3D } from "./Experience3D";
import { Skills3D } from "./Skills3D";
import { Projects3D } from "./Projects3D";
import { Certificates3D } from "./Certificates3D";
import { Achievements3D } from "./Achievements3D";
import { Contact3D } from "./Contact3D";

export function StationsLayer() {
  return (
    <group>
      <Profile3D />
      <Education3D />
      <Experience3D />
      <Skills3D />
      <Projects3D />
      <Certificates3D />
      <Achievements3D />
      <Contact3D />
    </group>
  );
}
