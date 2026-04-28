import { cn } from "@/lib/utils";
import {
  Mountain,
  Building2,
  Bike,
  Truck,
  Zap,
  Activity,
  Baby,
  PackageOpen,
  Clock,
} from "lucide-react";

const TYPE_META: Record<
  string,
  { icon: typeof Bike; label: string; tone: string }
> = {
  VTT: { icon: Mountain, label: "VTT", tone: "text-emerald-700 bg-emerald-50" },
  "VTT E": { icon: Mountain, label: "VTT élec.", tone: "text-emerald-700 bg-emerald-50" },
  VTTAE: { icon: Mountain, label: "VTTAE", tone: "text-emerald-700 bg-emerald-50" },
  Ville: { icon: Building2, label: "Ville", tone: "text-sky-700 bg-sky-50" },
  "Ville E": { icon: Building2, label: "Ville élec.", tone: "text-sky-700 bg-sky-50" },
  VTC: { icon: Bike, label: "VTC", tone: "text-indigo-700 bg-indigo-50" },
  "VTC E": { icon: Bike, label: "VTC élec.", tone: "text-indigo-700 bg-indigo-50" },
  Cargo: { icon: Truck, label: "Cargo", tone: "text-amber-700 bg-amber-50" },
  "Cargo E": { icon: Truck, label: "Cargo élec.", tone: "text-amber-700 bg-amber-50" },
  Fitness: { icon: Activity, label: "Fitness", tone: "text-rose-700 bg-rose-50" },
  Pliant: { icon: PackageOpen, label: "Pliant", tone: "text-purple-700 bg-purple-50" },
  Enfant: { icon: Baby, label: "Enfant", tone: "text-pink-700 bg-pink-50" },
  "Enfant E": { icon: Baby, label: "Enfant élec.", tone: "text-pink-700 bg-pink-50" },
  "Tricycle E": { icon: Bike, label: "Tricycle", tone: "text-teal-700 bg-teal-50" },
  Vintage: { icon: Clock, label: "Vintage", tone: "text-stone-700 bg-stone-100" },
};

const FALLBACK = { icon: Bike, label: "Vélo", tone: "text-stone-700 bg-stone-100" };

export function TypeBadge({
  type,
  size = "sm",
  className,
}: {
  type: string;
  size?: "xs" | "sm";
  className?: string;
}) {
  const meta = TYPE_META[type] ?? FALLBACK;
  const Icon = meta.icon;
  const isElec = type.includes(" E") || type === "VTTAE";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        meta.tone,
        className,
      )}
      title={type}
    >
      <Icon className={size === "xs" ? "size-2.5" : "size-3"} strokeWidth={2.5} />
      <span>{meta.label}</span>
      {isElec && type !== "VTTAE" && (
        <Zap className={size === "xs" ? "size-2.5" : "size-3"} strokeWidth={2.5} />
      )}
    </span>
  );
}
