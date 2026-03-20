"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  Loader2,
  ShoppingBag,
  BookOpen,
  Info,
  Star,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import anime from "animejs";
import ReactMarkdown from "react-markdown";
import { ReviewFormContent } from "@/components/store/ReviewFormContent";
import { toast } from "sonner";

interface Message {
  role: "user" | "model" | "system" | "function";
  parts: { text?: string; functionCall?: any; functionResponse?: any }[];
}

export function UnifiedSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "review">("ai");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, activeTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Entry animation
      anime({
        targets: chatRef.current,
        translateY: [40, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: "easeOutElastic(1, .8)",
      });

      if (messages.length === 0) {
        setMessages([
          {
            role: "model",
            parts: [
              {
                text: "Bonjour ! ✨ Je suis l'assistant intelligent de **Boutique Diary**. \n\nComment puis-je vous accompagner aujourd'hui ? Je peux vous aider à trouver la tenue parfaite, vous conseiller sur les tailles ou répondre à vos questions sur la livraison.",
              },
            ],
          },
        ]);
      }
    }
  }, [isOpen]);

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
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          history: messages.map(m => ({
            role: m.role,
            parts: m.parts
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur assistant");

      if (data.history) {
        setMessages(data.history);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.text }] },
        ]);
      }
    } catch (error: any) {
      toast.error(error.message || "Impossible de communiquer avec l'IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { label: "Nouveautés", icon: ShoppingBag, prompt: "Quelles sont les dernières nouveautés ?", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { label: "Conseils mode", icon: BookOpen, prompt: "Donne-moi des conseils de mode pour cette saison.", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { label: "Livraison", icon: Info, prompt: "Quelles sont les options de livraison ?", color: "bg-amber-50 text-amber-700 border-amber-100" },
  ];

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed z-50 transition-all duration-500 ease-in-out",
        isMaximized && isOpen 
          ? "inset-0 flex items-center justify-center p-4 sm:p-8 bg-black/20 backdrop-blur-sm" 
          : "bottom-8 right-8"
      )}
    >
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-2xl bg-zinc-950 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center">
             <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
             <div className="absolute inset-0 flex items-center justify-center translate-y-[-1px] translate-x-[1px]">
                <span className="text-white font-bold text-[10px]">+</span>
             </div>
          </div>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-zinc-950 animate-pulse" />
        </button>
      )}

      {/* Main Support Window */}
      {isOpen && (
        <Card
          ref={chatRef}
          className={cn(
            "shadow-[0_32px_80px_rgba(0,0,0,0.2)] border-border/50 bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out rounded-[32px]",
            isMaximized ? "w-full max-w-5xl h-full max-h-[90vh]" : "w-[380px] sm:w-[440px] h-[640px]"
          )}
        >
          {/* Header */}
          <CardHeader className="p-5 border-b bg-zinc-950 text-white flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                {activeTab === "ai" ? <Bot className="w-7 h-7 text-white" /> : <Star className="w-6 h-6 fill-amber-400 text-amber-400" />}
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-black uppercase tracking-widest font-[family-name:var(--font-playfair)] flex items-center gap-2">
                  {activeTab === "ai" ? "Assistant IA" : "Espace Avis"}
                  <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold border border-white/10">PREMIUM</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Disponible 24h/7j</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-zinc-400 hover:text-white hidden sm:block"
                title={isMaximized ? "Réduire" : "Agrandir"}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>

          {/* Navigation Bar - Modern Glassmorphism */}
          <div className="flex p-1.5 bg-muted/30 border-b shrink-0">
            <button
              onClick={() => setActiveTab("ai")}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-2",
                activeTab === "ai" 
                  ? "bg-white text-zinc-950 shadow-sm border border-zinc-100" 
                  : "text-muted-foreground hover:bg-black/5"
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Assistant IA
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-2",
                activeTab === "review" 
                  ? "bg-white text-zinc-950 shadow-sm border border-zinc-100" 
                  : "text-muted-foreground hover:bg-black/5"
              )}
            >
              <Star className="w-3.5 h-3.5" />
              Donner un avis
            </button>
          </div>

          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-zinc-50/50">
            {activeTab === "ai" ? (
              <>
                <ScrollArea className="flex-1 px-5 py-6">
                  <div className="space-y-8 pb-4">
                    {messages
                      .filter((msg) => msg.parts.some((p) => p.text))
                      .map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex flex-col gap-2 max-w-[90%] group animate-in fade-in slide-in-from-bottom-4 duration-500",
                            msg.role === "user" ? "ml-auto items-end" : "items-start",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                {msg.role === "user" ? "Vous" : "Diary Bot"}
                             </span>
                             {msg.role === "model" && <Bot className="w-3 h-3 text-zinc-300" />}
                          </div>
                          <div
                            className={cn(
                              "px-5 py-4 text-sm leading-relaxed shadow-sm transition-all",
                              msg.role === "user"
                                ? "bg-zinc-950 text-white rounded-[24px] rounded-tr-none"
                                : "bg-white text-zinc-800 rounded-[24px] rounded-tl-none border border-zinc-100",
                            )}
                          >
                            <div className="prose prose-sm dark:prose-invert max-w-none font-[family-name:var(--font-montserrat)] prose-p:leading-relaxed prose-p:my-0 prose-strong:text-inherit prose-a:text-indigo-400 prose-ul:my-2 prose-li:my-0.5">
                              <ReactMarkdown>
                                {msg.parts.map((part) => part.text).join("")}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))}
                    {isLoading && (
                      <div className="flex gap-4 items-center text-zinc-500 text-xs font-black pl-1 animate-pulse font-[family-name:var(--font-montserrat)]">
                        <div className="w-8 h-8 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                        </div>
                        L'ASSISTANT ANALYSE VOTRE DEMANDE...
                      </div>
                    )}
                    <div ref={scrollBottomRef} className="h-4" />
                  </div>
                </ScrollArea>

                {/* Footer Controls */}
                <div className="p-5 space-y-5 bg-white border-t border-zinc-100 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                  {/* Suggestions Chips */}
                  {!isLoading && messages.length <= 1 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(s.prompt)}
                          className={cn(
                            "px-4 py-2.5 rounded-2xl border text-[11px] font-black uppercase tracking-tight transition-all flex items-center gap-2.5 hover:scale-105 active:scale-95 shadow-sm",
                            s.color
                          )}
                        >
                          <s.icon className="w-3.5 h-3.5" />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="relative group">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Comment puis-je vous aider ?"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-[22px] pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:border-zinc-950 focus:bg-white transition-all font-[family-name:var(--font-montserrat)] placeholder:text-zinc-400 font-medium"
                    />
                    <Button 
                      onClick={() => handleSend()} 
                      disabled={isLoading || !input.trim()} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white shadow-xl transition-all active:scale-90"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <ScrollArea className="flex-1 px-6 py-8">
                <div className="max-w-2xl mx-auto">
                   <ReviewFormContent onSuccess={() => setActiveTab("ai")} />
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
