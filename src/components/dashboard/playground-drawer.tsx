'use client';

import { useState } from 'react';
import { playgroundChatAction } from '@/lib/actions/chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bot, Send, Loader2, MessageCircle, RefreshCw, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  needsHandover?: boolean;
  whatsappUrl?: string | null;
  waCtaText?: string;
  latencyMs?: number;
}

interface PlaygroundDrawerProps {
  chatbotName?: string;
  greeting?: string;
  primaryColor?: string;
}

export function PlaygroundDrawer({
  chatbotName = 'Asisten SIBISA',
  greeting = 'Halo! Ada yang bisa kami bantu?',
  primaryColor = '#4F46E5',
}: PlaygroundDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const initialGreetingMsg: ChatMessage = {
    id: 'msg-greeting',
    role: 'assistant',
    content: greeting,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreetingMsg]);

  const handleResetChat = () => {
    setMessages([initialGreetingMsg]);
    setInputMsg('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    setInputMsg('');

    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
    };

    const newHistory = [...messages, userMsgObj];
    setMessages(newHistory);
    setLoading(true);

    try {
      const historyPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await playgroundChatAction(historyPayload);

      if (res.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `[Error]: ${res.error}`,
          },
        ]);
      } else if (res.result) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: res.result.reply,
            needsHandover: res.result.needsHandover,
            whatsappUrl: res.result.whatsappUrl,
            waCtaText: res.result.waCtaText,
            latencyMs: res.result.latencyMs,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Terjadi kesalahan koneksi saat memproses balasan AI.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-md shadow-primary/20">
          <Sparkles className="h-4 w-4 text-amber-300" />
          Buka Playground AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border rounded-2xl">
        {/* Widget Header */}
        <DialogHeader
          className="p-4 text-white flex flex-row items-center justify-between space-y-0"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-sm font-bold text-white leading-tight">
                {chatbotName}
              </DialogTitle>
              <span className="text-[10px] text-white/80 font-medium">
                ● Online (Simulasi Playground SIBISA)
              </span>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            title="Reset Chat"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Chat Messages Body */}
        <div className="h-[380px] p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-1.5 max-w-[85%]">
                  {!isUser && (
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      AI
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                    {/* Handover CTA WhatsApp Button */}
                    {msg.needsHandover && msg.whatsappUrl && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <a
                          href={msg.whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {msg.waCtaText || 'Lanjut chat via WhatsApp'}
                        </a>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                {msg.latencyMs && (
                  <span className="text-[9px] text-muted-foreground mt-1 px-1">
                    Waktu respons AI: {msg.latencyMs} ms
                  </span>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>AI SIBISA sedang berpikir...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-card flex gap-2">
          <Input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ketik pertanyaan untuk menguji AI..."
            className="text-xs h-10"
            disabled={loading}
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="bg-slate-100 px-3 py-1.5 text-center text-[10px] text-slate-500 border-t border-slate-200">
          Uji Coba Playground SIBISA · Tanpa Memotong Kuota Langganan
        </div>
      </DialogContent>
    </Dialog>
  );
}
