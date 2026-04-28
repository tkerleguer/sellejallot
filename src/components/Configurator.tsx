import { useMemo, useState } from "react";
import { database } from "@/data/bikes";
import { BrandSelector } from "./BrandSelector";
import { ModelSelector } from "./ModelSelector";
import { ResultCard } from "./ResultCard";
import { StepIndicator } from "./StepIndicator";

export function Configurator() {
  const [brandName, setBrandName] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);

  const brand = useMemo(
    () => database.brands.find((b) => b.name === brandName) ?? null,
    [brandName],
  );

  const incompatBrand = useMemo(
    () => database.incompatibleBrands.find((b) => b.name === brandName) ?? null,
    [brandName],
  );

  const step = brandName ? (modelName ? 3 : 2) : 1;
  const model = brand && modelName ? brand.models[modelName] : null;

  return (
    <div className="space-y-4">
      <StepIndicator step={step} />

      {/* Step 1 — Brand */}
      <BrandSelector
        compatibleBrands={database.brands}
        incompatibleBrands={database.incompatibleBrands}
        selected={brandName}
        onSelect={(name) => {
          setBrandName(name);
          setModelName(null);
        }}
        onClear={() => {
          setBrandName(null);
          setModelName(null);
        }}
      />

      {/* If brand is fully incompatible, show result immediately */}
      {brandName && incompatBrand && !brand && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.04] p-6 ring-1 ring-destructive/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-destructive/70">
            Marque non compatible
          </div>
          <h2 className="mt-1 text-2xl font-bold">{incompatBrand.name}</h2>
          <p className="mt-3 text-sm text-primary/80">{incompatBrand.reason}</p>
          {Array.isArray(incompatBrand.scope) && (
            <p className="mt-3 text-xs text-primary/60">
              Modèles concernés : {incompatBrand.scope.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Step 2 — Model */}
      {brand && (
        <ModelSelector
          brand={brand}
          selectedModel={modelName}
          onSelect={setModelName}
          onClear={() => setModelName(null)}
        />
      )}

      {/* Step 3 — Result */}
      {brand && modelName && model && (
        <ResultCard
          brandName={brand.name}
          modelName={modelName}
          model={model}
          brandFlag={brand.flag}
          brandIncompatibility={incompatBrand ?? undefined}
        />
      )}
    </div>
  );
}
