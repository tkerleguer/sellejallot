import { useState, useMemo } from "react";
import { Command } from "cmdk";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";
import type { CompatibleBrand, IncompatibleBrand } from "@/data/bikes";

interface Props {
  compatibleBrands: CompatibleBrand[];
  incompatibleBrands: IncompatibleBrand[];
  selected: string | null;
  onSelect: (brand: string) => void;
  onClear: () => void;
}

function topTypes(brand: CompatibleBrand): string[] {
  const counts = new Map<string, number>();
  for (const m of Object.values(brand.models)) {
    counts.set(m.type, (counts.get(m.type) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

export function BrandSelector({
  compatibleBrands,
  incompatibleBrands,
  selected,
  onSelect,
  onClear,
}: Props) {
  const [query, setQuery] = useState("");

  const allBrands = useMemo(() => {
    const incompatNames = new Set(incompatibleBrands.map((b) => b.name));
    return [
      ...compatibleBrands.map((b) => ({
        type: "compat" as const,
        name: b.name,
        types: topTypes(b),
        flag: b.flag,
        models: Object.keys(b.models).length,
      })),
      ...incompatibleBrands
        .filter((b) => !compatibleBrands.find((c) => c.name === b.name))
        .map((b) => ({
          type: "incompat" as const,
          name: b.name,
          reason: b.reason,
        })),
    ].sort((a, b) =>
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
    );
    void incompatNames;
  }, [compatibleBrands, incompatibleBrands]);

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary/60">
            Marque
          </span>
          <span className="text-base font-bold">{selected}</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full p-1 text-primary/60 transition-colors hover:bg-primary/5 hover:text-primary"
          aria-label="Changer de marque"
        >
          <X className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <Command
      className="overflow-hidden rounded-xl border border-border bg-card"
      filter={(value, search) => {
        const v = value.toLowerCase();
        const s = search.toLowerCase();
        return v.includes(s) ? 1 : 0;
      }}
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search className="size-4 shrink-0 text-primary/40" />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Cherche ta marque (ex. Trek, Giant, Decathlon…)"
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-primary/30"
        />
      </div>
      <Command.List className="max-h-[420px] overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-sm text-primary/50">
          Aucune marque ne correspond à « {query} ».
        </Command.Empty>
        {allBrands.map((b) => (
          <Command.Item
            key={b.name}
            value={b.name}
            onSelect={() => onSelect(b.name)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 transition-all",
              "data-[selected=true]:bg-primary/[0.04]",
              b.type === "incompat"
                ? "mb-1 bg-destructive/[0.03] border-destructive/20 hover:border-destructive/40"
                : "mb-1 bg-card border-border hover:border-primary hover:shadow-[0_2px_12px_hsl(170_100%_13%_/_0.04)]",
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  "truncate font-bold",
                  b.type === "incompat" && "text-destructive/70",
                )}
              >
                {b.name}
              </span>
              {b.type === "incompat" && (
                <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                  Incompatible
                </span>
              )}
              {b.type === "compat" && b.flag === "attention_modele" && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  À vérifier
                </span>
              )}
            </div>
            {b.type === "compat" && (
              <div className="flex shrink-0 items-center gap-1.5">
                {b.types.slice(0, 2).map((t) => (
                  <TypeBadge key={t} type={t} size="xs" />
                ))}
                {b.types.length > 2 && (
                  <span className="text-[10px] opacity-30">
                    +{b.types.length - 2}
                  </span>
                )}
                <span className="ml-1 font-mono text-[11px] tabular-nums opacity-25">
                  {b.models}
                </span>
              </div>
            )}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
}
