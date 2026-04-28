import { useMemo, useState } from "react";
import { Command } from "cmdk";
import { Search, X, ChevronRight } from "lucide-react";
import { TypeBadge } from "./TypeBadge";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import type { CompatibleBrand, BikeModel } from "@/data/bikes";

interface Props {
  brand: CompatibleBrand;
  selectedModel: string | null;
  onSelect: (model: string) => void;
  onClear: () => void;
}

export function ModelSelector({
  brand,
  selectedModel,
  onSelect,
  onClear,
}: Props) {
  const [query, setQuery] = useState("");

  const models = useMemo(
    () =>
      Object.entries(brand.models).sort((a, b) => a[0].localeCompare(b[0], "fr")),
    [brand.models],
  );

  if (selectedModel) {
    const model = brand.models[selectedModel];
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary/60">
            Modèle
          </span>
          <span className="truncate text-base font-bold">{selectedModel}</span>
          {model && <TypeBadge type={model.type} size="xs" />}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full p-1 text-primary/60 transition-colors hover:bg-primary/5 hover:text-primary"
          aria-label="Changer de modèle"
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
          placeholder={`Choisis ton modèle ${brand.name}…`}
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-primary/30"
        />
      </div>
      <Command.List className="max-h-[420px] overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-sm text-primary/50">
          Aucun modèle ne correspond à « {query} ».
        </Command.Empty>
        {models.map(([name, m]: [string, BikeModel]) => (
          <Command.Item
            key={name}
            value={name}
            onSelect={() => onSelect(name)}
            className={cn(
              "group mb-1 flex cursor-pointer items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2.5 transition-all",
              "border-border hover:border-primary hover:shadow-[0_2px_12px_hsl(170_100%_13%_/_0.04)]",
              "data-[selected=true]:bg-primary/[0.04]",
              m.status === "incompatible" &&
                "bg-destructive/[0.03] border-destructive/20 hover:border-destructive/40",
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "truncate font-bold",
                  m.status === "incompatible" && "text-destructive/70",
                )}
              >
                {name}
              </span>
              <TypeBadge type={m.type} size="xs" />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-xs font-bold tabular-nums opacity-45">
                {m.diameter} mm
              </span>
              {m.status !== "compatible" ? (
                <StatusBadge status={m.status} size="xs" />
              ) : (
                <ChevronRight className="size-4 text-primary/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              )}
            </div>
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
}
