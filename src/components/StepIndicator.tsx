import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = ["Marque", "Modèle", "Résultat"] as const;

export function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <li key={label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex size-5 items-center justify-center rounded-full text-[10px] tabular-nums transition-colors",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary/10 text-primary ring-1 ring-primary",
                !done && !active && "bg-secondary text-primary/40",
              )}
            >
              {done ? <Check className="size-3" strokeWidth={3} /> : n}
            </span>
            <span
              className={cn(
                done && "text-primary/50",
                active && "text-primary",
                !done && !active && "text-primary/30",
              )}
            >
              {label}
            </span>
            {n < STEPS.length && (
              <span
                className={cn(
                  "mx-1 h-px w-6 sm:w-10",
                  done ? "bg-primary/30" : "bg-primary/10",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
