import {
  AlertTriangle,
  Cpu,
  Droplets,
  Filter,
  Settings,
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
  "dpf-szuro-tisztitas": Filter,
  "elektronikai-diagnosztika": Cpu,
  "futomu-beallitas": Settings,
  "altalanos-karbantartas": Wrench,
  "fekrendszer-szerviz": AlertTriangle,
  "olajcsere-szerviz": Droplets,
};
