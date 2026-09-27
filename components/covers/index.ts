import type { ComponentType } from "react";
import BioCubesat from "./bio-cubesat";
import FleetCoord from "./fleet-coord";
import LyoMechModel from "./lyo-mech-model";
import ManifestLabor from "./manifest-labor";
import AmbicDataLake from "./ambic-data-lake";
import Daemon from "./daemon";

/** Home-card covers keyed by project slug (400×300 art boards). */
export const covers: Record<string, ComponentType> = {
  "bio-cubesat": BioCubesat,
  "fleet-coord": FleetCoord,
  "lyo-mech-model": LyoMechModel,
  "manifest-labor": ManifestLabor,
  "ambic-data-lake": AmbicDataLake,
  daemon: Daemon,
};
