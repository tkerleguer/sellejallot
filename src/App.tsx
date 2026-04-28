import { Header } from "./components/Header";
import { Configurator } from "./components/Configurator";
import { IncompatibleList } from "./components/IncompatibleList";
import { database } from "./data/bikes";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
            Configurateur · 30 sec.
          </span>
          <h1 className="mt-3 text-balance text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            Trouvez la bonne taille de tige de selle pour votre vélo.
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary/70 sm:text-lg">
            Plusieurs méthodes permettent de connaître le diamètre de votre
            tige de selle.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                1
              </span>
              <p className="flex-1 text-sm leading-relaxed text-primary/80 sm:text-[15px]">
                Il est généralement gravé directement sur la tige de selle (à
                environ 7 cm de l'extrémité). Il vous suffit de la retirer de
                votre vélo pour lire l'inscription.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                2
              </span>
              <p className="flex-1 text-sm leading-relaxed text-primary/80 sm:text-[15px]">
                Cette information est souvent indiquée dans les spécifications
                techniques de votre vélo.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-mono text-xs font-bold">
                3
              </span>
              <p className="flex-1 text-sm leading-relaxed text-primary/80 sm:text-[15px]">
                Pour vous aider, vous pouvez également utiliser notre outil
                ci-dessous.{" "}
                <span className="font-semibold text-primary">
                  Attention toutefois
                </span>{" "}
                : des erreurs peuvent subsister, il est donc recommandé de
                vérifier la mesure par vous-même si nécessaire.
              </p>
            </li>
          </ol>
        </section>

        <Configurator />

        <IncompatibleList />

        <footer className="mt-16 border-t border-border/60 pt-6 font-mono text-[11px] text-primary/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Database màj le{" "}
              <strong className="font-bold text-primary/70">
                {new Date(database.meta.updated).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </strong>
            </span>
            <span>
              Diamètres standards :{" "}
              {database.meta.diametersSupported.join(" · ")} mm
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
