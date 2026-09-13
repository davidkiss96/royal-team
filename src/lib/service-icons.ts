import {
  Cog,
  Cpu,
  Disc,
  Droplets,
  Filter,
  Fuel,
  Settings,
  Snowflake,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Per-service icon, keyed by the real `slug` field. `Service` has no icon
 * field in the approved schema (docs/content-model.md Section 2) — this
 * mirrors design-system.md Section 12's recommendation to keep icon
 * selection a presentation-layer mapping maintained in code, not content.
 */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "altalanos-karbantartas": Wrench,
  "elektronikai-diagnosztika": Cpu,
  "dpf-szuro-tisztitas": Filter,
  "futomu-beallitas": Settings,
  "kuplung-es-kettostomegu-lendkerek-csere": Disc,
  "motor-mechanikus-javitasa": Cog,
  "dizel-uzemanyagrendszer": Fuel,
  "diohejas-tisztitas": Wind,
  "klimarendszer-javitas": Snowflake,
  "gepi-atmosasos-automata-valtoolajcsere": Droplets,
};
