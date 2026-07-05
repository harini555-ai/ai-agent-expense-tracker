import { useEffect, useRef, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { parseTransactionMessage } from "../services/aiService";
import ChatMessage from "../components/ai/ChatMessage";
import ConfirmationCard from "../components/ai/ConfirmationCard";
import Button from "../components/ui/Button";

const SUGGESTIONS = [
  "Spent ₹250 on food today",
  "Got ₹500 from freelance work",
  "Paid ₹1200 for electricity bill",
];

export default function AIAssistant() {
  const { categories, addTransaction } = useApp();
  const toast = useToast();

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! Tell me about a transaction in plain English — for example \"Spent ₹250 on food today\" — and I'll log it for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, ...msg }]);
  };

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || isLoading) return;

    pushMessage({ role: "user", content: text });
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const draft = await parseTransactionMessage(text, categories, apiKey);

      pushMessage({
        role: "ai",
        content: "Here's what I found. Want me to log it?",
        draft,
      });
    } catch (err) {
      const errorText = err?.message || "Something went wrong while talking to the AI. Please try again.";
      pushMessage({ role: "ai", content: errorText, isError: true });
      toast.error(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = (messageId, draft) => {
    addTransaction(draft);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, draft: null, resolved: "confirmed" } : m))
    );
    pushMessage({ role: "ai", content: "Done! I've added that to your transactions. 🎉" });
  };

  const handleDiscard = (messageId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, draft: null, resolved: "discarded" } : m))
    );
    pushMessage({ role: "ai", content: "No problem, I discarded that one." });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">AI Assistant</h2>
        <p className="mt-1 text-sm text-muted">
          Describe a transaction in natural language and let AI log it for you.
        </p>
      </div>

      <div className="glass flex-1 overflow-y-auto rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-3">
              <ChatMessage role={m.role}>
                <p className={m.isError ? "text-coral" : ""}>{m.content}</p>
              </ChatMessage>
              {m.draft && (
                <div className={m.role === "user" ? "" : "ml-11"}>
                  <ConfirmationCard
                    draft={m.draft}
                    onConfirm={() => handleConfirm(m.id, m.draft)}
                    onDiscard={() => handleDiscard(m.id)}
                  />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <ChatMessage role="ai">
              <span className="flex items-center gap-2 text-muted">
                <Sparkles size={14} className="animate-pulse text-gold" />
                Thinking...
              </span>
            </ChatMessage>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="glass rounded-full px-3 py-1.5 text-xs text-muted transition hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="glass flex items-center gap-2 rounded-2xl p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a transaction, e.g. Spent ₹250 on food today"
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none"
        />
        <Button icon={Send} loading={isLoading} disabled={!input.trim()} onClick={() => handleSend()}>
          Send
        </Button>
      </div>
    </div>
  );
}
