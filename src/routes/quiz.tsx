import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QUIZ } from "@/data/election-data";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Election Quiz — ElectionGuide Bot" },
      { name: "description", content: "Test your knowledge of Indian elections with a 6-question interactive quiz. Get explanations and earn a civic-knowledge badge." },
      { property: "og:title", content: "Take the Indian Elections Quiz" },
      { property: "og:description", content: "Six quick questions to test your civic knowledge. Earn a badge!" },
    ],
  }),
});

function QuizPage() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[idx];
  const progress = ((idx + (picked !== null ? 1 : 0)) / QUIZ.length) * 100;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= QUIZ.length) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const reset = () => { setIdx(0); setPicked(null); setScore(0); setDone(false); };

  const badge = score === QUIZ.length ? "🏆 Election Sage" : score >= 4 ? "🎖️ Civic Pro" : score >= 2 ? "✨ Curious Citizen" : "🌱 Just Beginning";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            6 questions · 2 min
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Test your election IQ</h1>
        </div>

        {!done ? (
          <>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-gradient-hero transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Question {idx + 1} of {QUIZ.length}</span>
              <span>Score: {score}</span>
            </div>

            <div key={idx} className="mt-6 animate-fade-up rounded-2xl border border-border bg-gradient-card p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{q.q}</h2>
              <div className="mt-6 space-y-2.5">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isAnswer = q.answer === i;
                  let style = "border-border bg-card hover:bg-secondary text-foreground";
                  if (picked !== null) {
                    if (isAnswer) style = "border-india-green bg-india-green/10 text-foreground";
                    else if (isPicked) style = "border-destructive bg-destructive/10 text-foreground";
                    else style = "border-border bg-card text-muted-foreground";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${style}`}
                    >
                      <span>{opt}</span>
                      {picked !== null && isAnswer && <CheckCircle2 className="h-5 w-5 text-india-green shrink-0" />}
                      {picked !== null && isPicked && !isAnswer && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div className="mt-6 animate-fade-up rounded-xl bg-secondary/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Why?</p>
                  <p className="mt-1 text-sm text-foreground/85">{q.explain}</p>
                  <button
                    onClick={next}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {idx + 1 >= QUIZ.length ? "See results" : "Next question →"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-8 animate-fade-up overflow-hidden rounded-2xl border border-border shadow-elegant">
            <div className="bg-gradient-hero p-8 text-center text-primary-foreground">
              <Trophy className="mx-auto h-12 w-12 text-saffron" />
              <div className="mt-4 font-display text-5xl font-bold">{score}/{QUIZ.length}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-white/80">Your civic score</div>
              <div className="mt-4 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">{badge}</div>
            </div>
            <div className="space-y-3 bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {score === QUIZ.length ? "Perfect run! You're ready to teach others." : "Great effort. Brush up with the chat or timeline."}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button onClick={reset} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  <RotateCcw className="h-4 w-4" /> Try again
                </button>
                <Link to="/chat" className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Ask the bot →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
