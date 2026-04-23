import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PHASES } from "@/data/election-data";
import { useState } from "react";

export const Route = createFileRoute("/timeline")({
  component: TimelinePage,
  head: () => ({
    meta: [
      { title: "12 Phases — ElectionGuide Bot" },
      { name: "description", content: "Visual timeline of the 12 phases of an Indian election: announcement, nominations, campaigning, polling, counting and government formation." },
      { property: "og:title", content: "The 12 Phases of an Indian Election" },
      { property: "og:description", content: "Visual journey from ECI announcement to the swearing-in ceremony." },
    ],
  }),
});

function TimelinePage() {
  const [active, setActive] = useState<number>(1);
  const phase = PHASES.find((p) => p.id === active)!;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-saffron/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-saffron">
            Election Cycle
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl">
            The 12 phases, from announcement to oath
          </h1>
          <p className="mt-3 text-muted-foreground">
            Click any phase to dive in. Approximate timelines based on the Lok Sabha cycle.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Vertical timeline */}
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-muted to-accent" />
            <ol className="space-y-2">
              {PHASES.map((p) => {
                const isActive = p.id === active;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => setActive(p.id)}
                      className={`group flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-all ${
                        isActive ? "bg-card shadow-soft" : "hover:bg-secondary/60"
                      }`}
                    >
                      <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-all ${
                        isActive ? "bg-gradient-hero text-primary-foreground shadow-glow scale-110" : "bg-card text-foreground border border-border"
                      }`}>
                        {p.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                          <span className="text-muted-foreground mr-1.5">{String(p.id).padStart(2, "0")}</span>
                          {p.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{p.duration}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Detail panel */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div key={phase.id} className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-elegant">
              <div className="bg-gradient-hero p-6 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 text-3xl backdrop-blur">
                    {phase.icon}
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-white/70">Phase {phase.id} of 12</div>
                    <h2 className="mt-0.5 font-display text-2xl font-bold">{phase.title}</h2>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-saffron/15 px-2.5 py-1 font-semibold text-saffron">{phase.duration}</span>
                  <span className="text-muted-foreground">{phase.short}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{phase.details}</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setActive(Math.max(1, active - 1))}
                    disabled={active === 1}
                    className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setActive(Math.min(12, active + 1))}
                    disabled={active === 12}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
