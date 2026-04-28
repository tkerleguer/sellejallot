import { cn } from "@/lib/utils";
import type { CompatibilityStatus } from "@/data/bikes";
import { Check, AlertTriangle, X } from "lucide-react";

const STATUS_META: Record<
  CompatibilityStatus,
  { label: string; tone: string; icon: typeof Check }
> = {
  compatible: {
    label: "Compatible",
    tone: "bg-emerald-100 text-emerald-800",
    icon: Check,
  },
  check: {
    label: "À vérifier",
    tone: "bg-amber-100 text-amber-900",
    icon: AlertTriangle,
  },
  incompatible: {
    label: "Incompatible",
    tone: "bg-destructive/10 text-destructive",
    icon: X,
  },
};

export function StatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: CompatibilityStatus;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide",
        size === "xs" && "px-1.5 py-0.5 text-[10px]",
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-3 py-1 text-xs",
        m.tone,
        className,
      )}
    >
      <Icon
        className={cn(
          size === "xs" && "size-2.5",
          size === "sm" && "size-3",
          size === "md" && "size-3.5",
        )}
        strokeWidth={3}
      />
      {m.label}
    </span>
  );
}
