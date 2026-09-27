import type { ComponentType } from "react";
import { art as ambic } from "./ambic-data-lake";
import { art as bio } from "./bio-cubesat";
import { art as daemon } from "./daemon";
import { art as fleet } from "./fleet-coord";
import { art as lyo } from "./lyo-mech-model";
import { art as manifest } from "./manifest-labor";

/** All gallery illustrations. Keys are namespaced "<slug>/<name>". */
export const illustrations: Record<string, ComponentType> = {
  ...ambic,
  ...bio,
  ...daemon,
  ...fleet,
  ...lyo,
  ...manifest,
};
