"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Loader2,
  BarChart3,
  Package,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import anime from "animejs";

interface Message {
  role: "user" | "model" | "system";
  parts: { text: string }[];
}

export function AdminAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      anime({
        targets: chatRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
        easing: "easeOutExpo",
      });

      if (messages.length === 0) {
        setMessages([
          {
            role: "model",
            parts: [
              {
                text: "Bonjour ! Je suis votre assistant Boutique Diary. Comment puis-je vous aider aujourd'hui ? Je peux générer des rapports de vente, vérifier vos stocks ou mettre à jour vos produits.",
              },
            ],
          },
        ]);
      }
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      parts: [{ text: input }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      // Original line: if (!response.ok) throw new Error("Erreur assistant");
      // This line is removed to allow parsing JSON even on error for detailed messages.

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      if (data.history) {
        // Sync full history from server to include tool calls/responses
        setMessages(data.history);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [{ text: data.text }],
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error calling assistant:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: `Désolé, une erreur est survenue : ${error.message || "Impossible de communiquer avec l'IA."}`,
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    {
      label: "Rapport de ventes 7j",
      icon: BarChart3,
      prompt: "Donne-moi un rapport des ventes des 7 derniers jours.",
    },
    {
      label: "Alertes stock",
      icon: AlertTriangle,
      prompt: "Quels sont les produits en stock faible ?",
    },
    {
      label: "Top produits",
      icon: Package,
      prompt: "Quels sont mes meilleurs produits ?",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-black text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <Sparkles className="absolute top-2 right-2 w-3 h-3 text-amber-400 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className="w-[400px] h-[600px] shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden"
        >
          <CardHeader className="p-4 border-b bg-muted/30 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">
                  Assistant IA
                </CardTitle>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    En ligne
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-white/50">
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-6 pb-2">
                {messages
                  .filter((msg) => msg.parts.some((p) => p.text))
                  .map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex max-w-[90%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm animate-in fade-in slide-in-from-bottom-2",
                        msg.role === "user"
                          ? "ml-auto bg-black text-white rounded-tr-none shadow-md"
                          : "bg-muted text-foreground rounded-tl-none border border-border/50 shadow-sm",
                      )}
                    >
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {msg.parts.map((part, idx) =>
                          part.text ? <div key={idx}>{part.text}</div> : null,
                        )}
                      </div>
                    </div>
                  ))}
                {isLoading && (
                  <div className="flex gap-2 items-center text-muted-foreground text-xs font-semibold animate-pulse pl-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Assistant en train d&apos;écrire...
                  </div>
                )}
                <div ref={scrollBottomRef} className="h-2" />
              </div>
            </ScrollArea>

            <div className="p-4 space-y-4 bg-muted/10 border-t">
              {messages.length < 3 && !isLoading && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s.prompt)}
                      className="px-3 py-1.5 rounded-full bg-background border border-border text-[11px] font-bold text-muted-foreground hover:border-black hover:text-black transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <s.icon className="w-3 h-3" />
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Posez une question ou demandez une action..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl bg-black hover:bg-gray-800 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
