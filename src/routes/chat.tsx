import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, Sparkles, Bot, User as UserIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "Chat — ElectionGuide Bot" },
      { name: "description", content: "Have a conversation with an AI assistant about Indian elections, voter rights, and the 12 phases of polling." },
      { property: "og:title", content: "Chat with ElectionGuide Bot" },
      { property: "og:description", content: "Ask anything about Indian elections — get instant, friendly, ECI-aligned answers." },
    ],
  }),
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "I'm 20 in Delhi — how do I register?",
  "What happens during the silence period?",
  "Explain VVPAT in simple words",
  "What's the timeline for nominations?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm **ElectionGuide Bot**. Ask me anything about Indian elections — voting steps, timelines, eligibility, or how the EVM works.\n\nTry one of the suggestions below to get started." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/election-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) throw new Error("Too many messages — please wait a moment.");
        if (resp.status === 402) throw new Error("AI credits exhausted. Add funds in  Cloud.");
        throw new Error("Failed to start chat. Try again.");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let done = false;

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && m.role === "assistant" && m.content === "")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Chat with ElectionGuide</h1>
          <p className="text-sm text-muted-foreground">Conversational, personalized, and grounded in ECI processes.</p>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-gradient-card p-4 shadow-soft sm:p-6" style={{ minHeight: "50vh", maxHeight: "65vh" }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-saffron text-saffron-foreground" : "bg-gradient-hero text-primary-foreground"}`}>
                {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
        )}

        {messages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <Sparkles className="h-3 w-3 text-primary" /> {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mt-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about voter ID, polling phases, eligibility…"
            className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-soft outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-50"
            aria-label="Send"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
