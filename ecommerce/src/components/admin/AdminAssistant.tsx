"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  Loader2,
  BarChart3,
  Package,
  AlertTriangle,
  X,
  History,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import anime from "animejs";
import ReactMarkdown from "react-markdown";

import { toast } from "sonner";

interface Message {
  role: "user" | "model" | "system" | "function";
  parts: { text?: string; functionCall?: any; functionResponse?: any }[];
}

export function AdminAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior });
    }
  };

  // Close outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;

      const isOutsideChat = chatRef.current && !chatRef.current.contains(event.target as Node);
      const isOutsideToggle = !toggleButtonRef.current || !toggleButtonRef.current.contains(event.target as Node);

      if (isOutsideChat && isOutsideToggle) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle scrolling when messages change or window opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, isOpen]);

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
                text: "Bonjour ! Je suis votre assistant Boutique Diary. Je peux vous aider à gérer votre boutique efficacement. Que souhaitez-vous faire ?",
              },
            ],
          },
        ]);
      }
    }
  }, [isOpen, messages.length]);

  const handleSend = async (customInput?: string) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      parts: [{ text: messageToSend }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      if (data.history) {
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
      toast.error(error.message || "Impossible de communiquer avec l'IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    {
      label: "Ventes 7j",
      icon: TrendingUp,
      prompt: "Donne-moi un rapport des ventes des 7 derniers jours.",
      color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 dark:text-blue-400",
    },
    {
      label: "Stock Faible",
      icon: AlertTriangle,
      prompt: "Quels sont les produits en stock faible ?",
      color: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/50 dark:text-amber-400",
    },
    {
      label: "Top Ventes",
      icon: Package,
      prompt: "Quels sont mes meilleurs produits ?",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50 dark:text-emerald-400",
    },
    {
      label: "Commandes",
      icon: History,
      prompt: "Montre-moi les dernières commandes.",
      color: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900/50 dark:text-purple-400",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          ref={toggleButtonRef}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className="w-[440px] h-[680px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-border bg-card flex flex-col overflow-hidden rounded-[32px] animate-in zoom-in-95 duration-300"
        >
          {/* Header */}
          <CardHeader className="p-5 border-b bg-zinc-950 text-white flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">
                  Assistant Boutique
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                    Pro
                  </span>
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    IA en ligne
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 flex flex-col min-h-0 bg-muted/30 relative">
            <ScrollArea
              className="h-full w-full"
              type="always"
            >
              <div className="px-5 py-6 space-y-6">
                {messages
                  .filter((msg) => msg.parts.some((p) => p.text))
                  .map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col gap-1.5 max-w-[88%] group animate-in fade-in slide-in-from-bottom-3 duration-500",
                        msg.role === "user" ? "ml-auto items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-3 text-sm leading-relaxed shadow-sm",
                          msg.role === "user"
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[22px] rounded-tr-none"
                            : "bg-card text-foreground rounded-[22px] rounded-tl-none border border-border shadow-sm",
                        )}
                      >
                        <div className="react-markdown prose prose-sm dark:prose-invert max-w-none prose-p:leading-normal prose-p:my-0 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-inherit">
                          <ReactMarkdown
                            components={{
                              code: ({ children }) => (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-[13px] font-mono border border-border/50">{children}</code>
                              ),
                            }}
                          >
                            {msg.parts.map((part) => part.text).join("")}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                {isLoading && (
                  <div className="flex gap-3 items-center text-muted-foreground text-[11px] font-bold animate-pulse pl-1">
                    <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border">
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    </div>
                    Réflexion en cours...
                  </div>
                )}
                <div ref={scrollBottomRef} className="h-1 w-full" />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <CardContent className="p-5 space-y-5 bg-card border-t border-border shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            {/* Feature Chips */}
            {!isLoading && messages.length <= 1 && (
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className={cn(
                      "p-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-sm",
                      s.color,
                    )}
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/50 dark:bg-zinc-950/50 flex items-center justify-center border border-current/10">
                      <s.icon className="w-3.5 h-3.5" />
                    </div>
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Field */}
            <div className="relative group">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Posez votre question..."
                className="w-full bg-muted border-none rounded-2xl pl-5 pr-14 py-4 text-sm focus:ring-2 focus:ring-primary/10 focus:bg-card transition-all shadow-inner placeholder:text-muted-foreground font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-30 transition-all shadow-lg active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
