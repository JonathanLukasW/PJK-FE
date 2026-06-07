"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Send,
  Shield,
  User,
  Trash2,
  MessageSquare,
  Copy,
  Check,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { ChatMessage, RiskContext, LocationInput } from "@/types";
import {
  createChatSession,
  sendChatMessage,
  closeChatSession,
} from "@/services/api/chat";
import { ApiResponseError, BackendUnavailableError } from "@/services/api/client";
import { useAppStore } from "@/stores/app-store";
import { useChatStore } from "@/stores/chat-store";
import { getChatHistory } from "@/services/api/chat";
import { Menu } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatDrawer } from "@/components/chat/ChatDrawer";


let counter = 0;
function genId() {
  return `msg-${Date.now()}-${++counter}`;
}


function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 px-4 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-teal-700 border border-teal-600/40 flex items-center justify-center flex-shrink-0">
        <Shield className="w-3.5 h-3.5 text-white" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 200, 400].map((delay) => (
            <div
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-teal-400/70 animate-typing-dot"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


interface ChatBubbleProps {
  message: ChatMessage;
}

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "system") {
    return (
      <div className="flex justify-center px-4 animate-fade-in">
        <div
          className="px-4 py-2 rounded-xl text-center max-w-md"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="text-[11px] text-[var(--fg-subtle)]">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-2.5 px-4 animate-slide-up group ${isUser ? "flex-row-reverse" : ""
        }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? "bg-slate-600" : "bg-teal-700 border border-teal-600/40"
          }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Shield className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2">
          <div
            className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl ${isUser
              ? "rounded-br-sm text-white"
              : "rounded-bl-sm text-[var(--fg-muted)] shadow-sm"
              }`}
            style={
              isUser
                ? { background: "var(--color-teal-600)", border: "1px solid var(--color-teal-500)" }
                : { background: "var(--bg-card)", border: "1px solid var(--border)" }
            }
          >
            {message.content.split("\n").map((line, li) => {
              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              return (
                <React.Fragment key={li}>
                  {li > 0 && <br />}
                  {parts.map((part, pi) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={pi} className={`font-semibold ${isUser ? "text-white" : "text-[var(--fg)]"}`}>
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={pi}>{part}</span>
                    )
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--fg-subtle)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-all"
              title="Salin pesan"
            >
              {copied ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
        <p className={`text-[10px] text-[var(--fg-subtle)] px-1 ${isUser ? "text-right" : "text-left"}`}>
          {message.timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}


export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCity = useAppStore((s) => s.selectedCity);
  const storedPrediction = useAppStore((s) => s.prediction);
  const { activeSessionId, setActiveSession, addSession, updateSessionTitle, setIsDrawerOpen } = useChatStore();
  const activeChatSessionId = activeSessionId;

  const context: RiskContext = useMemo(() => ({
    city_name: selectedCity,
    risk_level: storedPrediction?.risk_level ?? "waspada",
    flood_probability: storedPrediction?.risk_score ?? 0.42,
  }), [selectedCity, storedPrediction]);

  const locationInput: LocationInput = useMemo(() => ({
    lat: 0,
    lng: 0,
    city: selectedCity,
    province: selectedCity,
    display_name: selectedCity,
  }), [selectedCity]);

  const suggestions = useMemo(() => [
    `Analisis risiko daerah saya (${selectedCity})`,
    "Info cuaca hari ini",
    "Apa yang harus dilakukan saat banjir?",
    "Informasi darurat terbaru",
  ], [selectedCity]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);


  useEffect(() => {
    let cancelled = false;

    if (!activeSessionId) {
      setTimeout(() => setMessages([]), 0);
      return;
    }

    async function loadHistory() {
      try {
        const history = await getChatHistory(activeSessionId!);
        if (!cancelled) {
          setMessages(
            history.messages.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp: new Date(m.timestamp),
            }))
          );
          setIsLive(true);
        }
      } catch {
        if (!cancelled) {
          setIsLive(false);
        }
      }
    }

    loadHistory();
    return () => { cancelled = true; };
  }, [activeSessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        let sessionId = activeChatSessionId;
        if (!sessionId) {
          const session = await createChatSession(locationInput);
          sessionId = session.session_id;

          // Add to store
          addSession({
            id: sessionId,
            title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
            city: locationInput.city,
            updatedAt: new Date().toISOString(),
          });

          setIsLive(true);
        } else {
          const currentTitle = useChatStore.getState().sessions.find(s => s.id === sessionId)?.title;
          updateSessionTitle(sessionId, currentTitle || "Percakapan");
        }

        const response = await sendChatMessage({
          message: content,
          session_id: sessionId,
          location: locationInput,
        });

        const aiMsg: ChatMessage = {
          id: genId(),
          role: "assistant",
          content: response.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLive(true);
      } catch (err) {
        let errorContent = "Maaf, terjadi gangguan koneksi. Silakan coba lagi dalam beberapa saat.";

        if (err instanceof ApiResponseError) {
          if (err.status === 404 || err.status === 422) {
            setActiveSession(null);
            errorContent = "Sesi obrolan berakhir. Silakan kirim pesan Anda lagi untuk memulai sesi baru.";
          } else {
            errorContent = `Terjadi kesalahan (${err.status}): ${err.message}`;
          }
        } else if (err instanceof BackendUnavailableError) {
          errorContent = "Maaf, terjadi gangguan koneksi. Silakan coba lagi dalam beberapa saat.";
          setIsLive(false);
        } else if (err instanceof Error) {
          errorContent = err.message;
        }


        setMessages((prev) => [
          ...prev,
          { id: genId(), role: "assistant" as const, content: errorContent, timestamp: new Date() },
        ]);
      } finally {
        setIsTyping(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [isTyping, activeChatSessionId, addSession, updateSessionTitle, locationInput, setActiveSession]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = async () => {
    if (activeChatSessionId) {
      await closeChatSession(activeChatSessionId);
      useChatStore.getState().removeSession(activeChatSessionId);
    }
    setMessages([]);
    setIsTyping(false);
    setIsLive(false);
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex w-full"
      style={{ height: "calc(100vh - var(--navbar-height))" }}
    >
      <ChatSidebar />
      <ChatDrawer />
      <div className="flex flex-col flex-1 min-w-0 mx-auto w-full relative border-l border-[var(--border-muted)] bg-[var(--bg)]">

        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b relative"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 -ml-2 text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex w-9 h-9 rounded-xl bg-teal-700 border border-teal-600/30 items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-[var(--fg-muted)]">Asisten SiagaAI — {context.city_name}</h1>
                {isLive ? (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-teal-500 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5" /> Live
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                    <WifiOff className="w-2.5 h-2.5" /> Mock
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--fg-subtle)] mt-0.5">
                Mitigasi bencana · {context.city_name}
              </p>
            </div>
          </div>

          {!isEmpty && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--fg)]">{context.city_name}</span>
                <span className="text-[10px] text-[var(--fg-subtle)]">Lokasi Pantauan</span>
              </div>
              <div className="w-px h-6 bg-[var(--border)]" />
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${context.risk_level === "awas" ? "text-red-500" :
                  context.risk_level === "siaga" ? "text-amber-500" :
                    "text-teal-500"
                  }`}>
                  {context.risk_level.toUpperCase()}
                </span>
                <span className="text-[10px] text-[var(--fg-subtle)]">Tingkat Risiko</span>
              </div>
              <div className="w-px h-6 bg-[var(--border)]" />
              <div className="flex flex-col hidden sm:flex">
                <span className={`text-xs font-semibold ${isLive ? "text-teal-500" : "text-amber-500"}`}>
                  {isLive ? "Online (Live)" : "Mock Mode"}
                </span>
                <span className="text-[10px] text-[var(--fg-subtle)]">Status Koneksi</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg-subtle)] hidden md:block">
              Diperbarui: Hari ini, {new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0 flex items-start gap-2.5 px-5 py-2.5 border-b"
          style={{
            borderColor: "var(--border)",
            background: "rgba(20,184,166,0.04)",
          }}
        >
          <Shield className="w-3.5 h-3.5 text-teal-500/70 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[var(--fg-subtle)] leading-relaxed">
            Informasi divalidasi berdasarkan panduan resmi BNPB. Selalu ikuti
            arahan petugas BPBD di lapangan.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/15 flex items-center justify-center">
                <Shield className="w-8 h-8 text-teal-500/60" />
              </div>
              <div className="text-center max-w-xs">
                <h2 className="text-sm font-semibold text-[var(--fg-muted)] mb-1.5">
                  Tanya Tentang Kesiapsiagaan Bencana
                </h2>
                <p className="text-xs text-[var(--fg-subtle)] leading-relaxed">
                  Panduan kesiapsiagaan siap membantu dengan prosedur evakuasi,
                  checklist darurat, dan langkah mitigasi banjir.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-sm">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors border border-[var(--border-muted)]"
                  >
                    <span className="mr-2 text-teal-500/70">›</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div
          className="flex-shrink-0 px-4 py-4 border-t"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          {!isEmpty && !isTyping && (
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] text-[var(--fg-subtle)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors border border-[var(--border-muted)] whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang mitigasi bencana..."
              disabled={isTyping}
              className="input flex-1 px-4 py-3 text-sm"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-600 text-white hover:bg-teal-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              aria-label="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-[var(--fg-subtle)] text-center mt-2.5">
            SiagaAI dapat memberikan informasi yang tidak akurat. Selalu ikuti arahan petugas BPBD setempat.
          </p>
        </div>
      </div>
    </div>
  );
}
