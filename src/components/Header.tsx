import { database } from "@/data/bikes";

export function Header() {
  const { brands, models } = database.meta.counts;
  return (
    <header className="border-b border-border/60 bg-card/30 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="https://sellejallot.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Selle Jallot — accueil"
          className="flex items-center"
        >
          <img
            src="/logos/logo-long-vert.png"
            alt="Selle Jallot"
            className="h-7 w-auto sm:h-8"
            width={210}
            height={32}
          />
        </a>
        <div className="text-right text-[11px] tabular-nums text-primary/60 leading-tight">
          <div>
            <strong className="font-bold text-primary">{brands}</strong>{" "}
            marques
          </div>
          <div>
            <strong className="font-bold text-primary">{models}</strong>{" "}
            modèles vérifiés
          </div>
        </div>
      </div>
    </header>
  );
}
