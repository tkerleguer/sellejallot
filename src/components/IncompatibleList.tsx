import { database } from "@/data/bikes";
import { XCircle } from "lucide-react";

export function IncompatibleList() {
  const items = database.incompatibleBrands;
  if (items.length === 0) return null;
  return (
    <section className="mt-12">
      <div className="mb-3 flex items-center gap-2">
        <XCircle className="size-4 text-destructive/60" strokeWidth={2.5} />
        <h3 className="text-sm font-bold">Marques non compatibles</h3>
        <span className="text-[11px] tabular-nums text-primary/50">
          {items.length}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((b) => (
          <div
            key={b.name}
            className="rounded-lg border border-destructive/15 bg-destructive/[0.02] p-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-destructive/80">{b.name}</span>
              {Array.isArray(b.scope) && (
                <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                  {b.scope.length} modèles
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-primary/65">
              {b.reason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
