import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, CalendarClock, ShieldCheck, Sparkles, ArrowRight, Vote } from "lucide-react";
import heroImage from "@/assets/hero-democracy.jpg";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ElectionGuide Bot — Your AI guide to Indian elections" },
      { name: "description", content: "Chat with an AI election expert, explore the 12 phases, check voter eligibility, and test your knowledge with quizzes." },
      { property: "og:title", content: "ElectionGuide Bot — Your AI guide to Indian elections" },
      { property: "og:description", content: "Chat with an AI election expert, explore the 12 phases, check voter eligibility, and test your knowledge." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-95" />
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <img src={heroImage} alt="" width={1536} height={1024} className="h-full w-full object-cover" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
            <div className="max-w-2xl animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-powered · Built for India 🇮🇳</span>
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold text-white text-balance sm:text-5xl lg:text-6xl">
                Get the basics of Indian elections in 5 minutes,
                <span className="block bg-gradient-to-r from-saffron to-white bg-clip-text text-transparent">
                  no stress.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
                A conversational guide through the 12 phases — from ECI's poll-date announcement
                to the swearing-in. Personalized to your age, state, and curiosity.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/chat" className="group inline-flex items-center gap-2 rounded-xl bg-saffron px-6 py-3 text-sm font-semibold text-saffron-foreground shadow-elegant transition-all hover:scale-[1.02] hover:shadow-glow">
                  Start chatting <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/timeline" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
                  See the 12 phases
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-white/60">
                <span className="flex items-center gap-1.5"><Vote className="h-4 w-4" /> ECI-aligned content</span>
                <span>·</span>
                <span>No login required</span>
                <span>·</span>
                <span>Free forever</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-tricolor" />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Everything you need to vote with confidence</h2>
            <p className="mt-3 text-muted-foreground">Four interactive tools, zero jargon.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/chat" as const, icon: MessageCircle, title: "AI Chat", desc: "Ask anything — from EVM mechanics to nomination deadlines.", accent: "bg-primary/10 text-primary" },
              { to: "/timeline" as const, icon: CalendarClock, title: "12 Phases", desc: "Visual timeline of every step from announcement to oath.", accent: "bg-saffron/15 text-saffron" },
              { to: "/eligibility" as const, icon: ShieldCheck, title: "Eligibility", desc: "Quick checker — am I ready to register and vote?", accent: "bg-india-green/15 text-india-green" },
              { to: "/quiz" as const, icon: Sparkles, title: "Quiz Mode", desc: "6 questions to test your civic knowledge.", accent: "bg-primary-glow/15 text-primary-glow" },
            ].map((f) => (
              <Link key={f.to} to={f.to} className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.accent}`}>
                  <f.icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">
                  Open <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-3">
            {[
              { num: "968M+", label: "Registered voters in India" },
              { num: "12", label: "Phases of an election cycle" },
              { num: "543", label: "Lok Sabha constituencies" },
            ].map((s) => (
              <div key={s.label} className="bg-card p-8 text-center">
                <div className="font-display text-4xl font-bold text-primary">{s.num}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
