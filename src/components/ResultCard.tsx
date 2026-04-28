import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Info,
  Sparkles,
} from "lucide-react";
import type { BikeModel, IncompatibleBrand } from "@/data/bikes";
import { TypeBadge } from "./TypeBadge";
import { isDiameterSupported, diameterFallback } from "@/lib/diameter";

interface Props {
  brandName: string;
  modelName: string;
  model: BikeModel;
  brandFlag: "attention_modele" | null;
  brandIncompatibility?: IncompatibleBrand;
}

export function ResultCard({
  brandName,
  modelName,
  model,
  brandFlag,
  brandIncompatibility,
}: Props) {
  const blanketIncompat = !!brandIncompatibility;
  const supported = isDiameterSupported(model.diameter);
  const isIncompatible =
    blanketIncompat || model.status === "incompatible" || !supported;
  const needsCheck = !blanketIncompat && model.status === "check" && supported;
  const fallback = diameterFallback(model.diameter);

  const tone = isIncompatible
    ? {
        ring: "ring-destructive/20",
        bg: "bg-destructive/[0.04]",
        border: "border-destructive/30",
        icon: XCircle,
        iconColor: "text-destructive",
        title: "Incompatible",
        intro: "Cette tige Selle Jallot ne convient pas pour ce modèle.",
      }
    : needsCheck
      ? {
          ring: "ring-amber-300/40",
          bg: "bg-amber-50/60",
          border: "border-amber-200",
          icon: AlertTriangle,
          iconColor: "text-amber-700",
          title: "À vérifier",
          intro: "Cette compatibilité dépend de ton modèle exact.",
        }
      : {
          ring: "ring-primary/15",
          bg: "bg-card",
          border: "border-primary/30",
          icon: CheckCircle2,
          iconColor: "text-primary",
          title: "Compatible",
          intro: "Tu peux installer une tige de selle Selle Jallot.",
        };
  const Icon = tone.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 ring-1 transition-all",
        tone.bg,
        tone.border,
        tone.ring,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "rounded-xl bg-card p-2.5 ring-1 ring-border/60",
            tone.iconColor,
          )}
        >
          <Icon className="size-7" strokeWidth={2.25} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary/50">
              Résultat
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                isIncompatible
                  ? "bg-destructive/10 text-destructive"
                  : needsCheck
                    ? "bg-amber-100 text-amber-900"
                    : "bg-primary/10 text-primary",
              )}
            >
              {tone.title}
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold leading-tight">
            {brandName} <span className="text-primary/60">·</span> {modelName}
          </h2>
          <p className="mt-2 text-sm text-primary/70">{tone.intro}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <TypeBadge type={model.type} size="sm" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/50">
                Diamètre tube
              </span>
              <span className="font-mono text-lg font-bold tabular-nums">
                {model.diameter} mm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation block */}
      {!isIncompatible && fallback.recommended && (
        <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2.25} />
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary/60">
                Tige Selle Jallot recommandée
              </div>
              <div className="mt-1 font-mono text-base font-bold">
                Ø {fallback.recommended} mm
                {fallback.needsShim && (
                  <span className="ml-2 font-sans text-xs font-medium text-primary/60">
                    (avec entretoise / shim)
                  </span>
                )}
              </div>
              {needsCheck && (
                <p className="mt-2 text-xs text-primary/70">
                  Vérifie le diamètre exact gravé sur ta tige actuelle ou sur la
                  fiche produit avant de commander.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note from DB */}
      {(model.note || brandFlag === "attention_modele" || blanketIncompat) && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-secondary/60 p-3 text-xs text-primary/80">
          <Info className="mt-0.5 size-4 shrink-0 text-primary/60" />
          <div className="flex-1 leading-relaxed">
            {blanketIncompat && (
              <>
                <strong>{brandIncompatibility.name}</strong> :{" "}
                {brandIncompatibility.reason}
              </>
            )}
            {!blanketIncompat && model.note && model.note}
          </div>
        </div>
      )}

      {/* Diameter not supported message */}
      {!blanketIncompat && !supported && !fallback.recommended && (
        <div className="mt-4 rounded-lg bg-destructive/[0.05] border border-destructive/20 p-4 text-sm">
          <div className="font-bold text-destructive">
            Diamètre <span className="font-mono">{model.diameter} mm</span> non
            couvert
          </div>
          <p className="mt-1 text-primary/70">
            Selle Jallot fabrique uniquement les diamètres standards :{" "}
            <strong className="font-mono">27.2 · 30.9 · 31.6 · 34 mm</strong>.
            Un diamètre{" "}
            <span className="font-mono">{model.diameter} mm</span> nécessite une
            tige propriétaire ou sur-mesure.
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
        <a
          href="https://sellejallot.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors",
            isIncompatible
              ? "bg-secondary text-primary hover:bg-secondary/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {isIncompatible ? "Voir tous les modèles" : "Commander la tige"}
          <ExternalLink className="size-3.5" strokeWidth={2.5} />
        </a>
        <span className="text-[11px] text-primary/50">
          Source : fiches constructeur · vérifié manuellement
        </span>
      </div>
    </div>
  );
}
