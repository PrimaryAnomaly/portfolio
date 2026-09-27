import { DaemonDiagram } from "./Daemon";
import { AmbicDiagram } from "./Ambic";
import { LyoDiagram } from "./Lyo";

/** Architecture diagrams keyed by project slug. They replace the hero image on the project page. */
export const diagrams: Record<string, () => React.ReactElement> = {
  daemon: DaemonDiagram,
  "ambic-data-lake": AmbicDiagram,
  "lyo-mech-model": LyoDiagram,
};
