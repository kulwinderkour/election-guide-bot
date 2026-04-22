import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/eligibility")({
  component: EligibilityPage,
  head: () => ({
    meta: [
      { title: "Eligibility Checker — ElectionGuide Bot" },
      { name: "description", content: "Quickly check if you're eligible to vote in Indian elections and get personalized next steps for registration." },
      { property: "og:title", content: "Am I eligible to vote? — ElectionGuide Bot" },
      { property: "og:description", content: "Find out in 30 seconds whether you can register and vote in the next Indian election." },
    ],
  }),
});

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other UT",
];

function EligibilityPage() {
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [citizen, setCitizen] = useState<boolean | null>(null);
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const ageNum = parseInt(age || "0", 10);
  const eligible = ageNum >= 18 && citizen === true;

  const reset = () => {
    setAge(""); setState(""); setCitizen(null); setRegistered(null); setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <span className="inline-flex rounded-full bg-india-green/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-india-green">
            30-second check
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Are you ready to vote?</h1>
          <p className="mt-2 text-muted-foreground">Tell us a little about yourself — we'll guide you to the next step.</p>
        </div>

        {!submitted ? (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mt-8 space-y-6 rounded-2xl border border-border bg-gradient-card p-6 shadow-soft sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">Your age</span>
                <input
                  type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} required
                  placeholder="e.g. 22"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">State / UT</span>
                <select
                  value={state} onChange={(e) => setState(e.target.value)} required
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select…</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">Are you an Indian citizen?</legend>
              <div className="mt-2 flex gap-2">
                {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map((o) => (
                  <button
                    key={o.l} type="button" onClick={() => setCitizen(o.v)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      citizen === o.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >{o.l}</button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">Already registered as a voter?</legend>
              <div className="mt-2 flex gap-2">
                {[{ v: true, l: "Yes" }, { v: false, l: "Not yet" }].map((o) => (
                  <button
                    key={o.l} type="button" onClick={() => setRegistered(o.v)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      registered === o.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >{o.l}</button>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={citizen === null || registered === null || !age || !state}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              Check eligibility <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="mt-8 animate-fade-up overflow-hidden rounded-2xl border border-border shadow-elegant">
            <div className={`p-6 ${eligible ? "bg-india-green text-india-green-foreground" : "bg-saffron text-saffron-foreground"}`}>
              <div className="flex items-center gap-3">
                {eligible ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                <h2 className="font-display text-2xl font-bold">
                  {eligible ? "You're eligible!" : ageNum < 18 ? "Almost there!" : "A few things to check"}
                </h2>
              </div>
              <p className="mt-2 text-sm opacity-90">
                {eligible
                  ? `${state ? state + " · " : ""}${ageNum} years · Indian citizen`
                  : ageNum < 18
                  ? `Wait ${18 - ageNum} more year${18 - ageNum === 1 ? "" : "s"} — then you can register.`
                  : "You need to be 18+ and an Indian citizen to vote."}
              </p>
            </div>

            <div className="space-y-4 bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-foreground">Your next steps</h3>
              <ol className="space-y-3 text-sm">
                {eligible && !registered && (
                  <>
                    <Step n={1} title="Register on Form 6" desc={`Visit voters.eci.gov.in and submit Form 6 with proof of age & address (${state || "your state"}).`} />
                    <Step n={2} title="Track your application" desc="ECI usually processes within 30 days; an EPIC (Voter ID) is mailed to you." />
                    <Step n={3} title="Check the electoral roll" desc="Search your name at electoralsearch.in before poll day." />
                  </>
                )}
                {eligible && registered && (
                  <>
                    <Step n={1} title="Verify your details" desc="Search your name on electoralsearch.in to confirm your booth and EPIC." />
                    <Step n={2} title="Find your polling booth" desc="Use the Voter Helpline app or your state CEO's website." />
                    <Step n={3} title="Carry valid ID" desc="EPIC card or any 11 alternate IDs (Aadhaar, PAN, passport, etc.) on poll day." />
                  </>
                )}
                {!eligible && ageNum < 18 && (
                  <>
                    <Step n={1} title="Pre-register at 17" desc="ECI now allows 17-year-olds to apply in advance — your name activates on your 18th birthday." />
                    <Step n={2} title="Learn while you wait" desc="Take the quiz and explore the 12 phases on this site." />
                  </>
                )}
                {!eligible && ageNum >= 18 && (
                  <>
                    <Step n={1} title="Citizenship required" desc="Only Indian citizens may vote. NRIs may register at their Indian address." />
                  </>
                )}
              </ol>
              <button
                onClick={reset}
                className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Check again
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{n}</span>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="mt-0.5 text-muted-foreground">{desc}</div>
      </div>
    </li>
  );
}
