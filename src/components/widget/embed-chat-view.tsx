'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Loader2, MessageCircle, X, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WidgetConfig {
  publicKey: string;
  name: string;
  greeting: string;
  tone: string;
  primaryColor: string;
  position: string;
  waCtaText: string;
  quickReplies: string[];
}

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  handover?: boolean;
  cta?: { type: string; label: string; url: string } | null;
  limitReached?: boolean;
}

function generateUniqueId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

function getOrCreateSessionId(key: string): string {
  if (typeof window === 'undefined') return 'sess-temp';
  const storageKey = `sibisa_sess_${key}`;
  let sid = localStorage.getItem(storageKey);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(storageKey, sid);
  }
  return sid;
}

export function EmbedChatView({ publicKey }: { publicKey: string }) {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState('');

  const [sessionId] = useState<string>(() => getOrCreateSessionId(publicKey));
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);

  // Lead Form Modal State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/widget/config?key=${encodeURIComponent(publicKey)}`);
        const data = await res.json();

        if (!res.ok) {
          setConfigError(data.error || 'Widget tidak tersedia');
        } else {
          setConfig(data);
          setMessages([
            {
              id: generateUniqueId('greet'),
              role: 'assistant',
              content: data.greeting || 'Halo! Ada yang bisa kami bantu?',
            },
          ]);

          // Post config to parent window for launcher button color & positioning
          if (window.parent) {
            window.parent.postMessage(
              JSON.stringify({
                type: 'SIBISA_CONFIG',
                primaryColor: data.primaryColor,
                position: data.position,
              }),
              '*'
            );
          }
        }
      } catch {
        setConfigError('Gagal memuat widget chat');
      } finally {
        setLoadingConfig(false);
      }
    }

    loadConfig();
  }, [publicKey]);

  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage(JSON.stringify({ type: 'SIBISA_CLOSE' }), '*');
    }
  };

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsgObj: MessageItem = {
      id: generateUniqueId('user'),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');
    setSending(true);

    try {
      const res = await fetch('/api/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey,
          sessionId,
          message: textToSend,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateUniqueId('err'),
            role: 'assistant',
            content: data.error || 'Maaf, terjadi kendala koneksi.',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: generateUniqueId('ai'),
            role: 'assistant',
            content: data.reply,
            handover: data.handover,
            cta: data.cta,
            limitReached: data.limitReached,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId('err'),
          role: 'assistant',
          content: 'Terjadi gangguan jaringan. Silakan coba lagi.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageText(inputMsg);
  };

  const handleCtaClick = async (ctaUrl: string) => {
    // Record event to analytics/leads
    try {
      await fetch('/api/widget/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey,
          sessionId,
          eventName: 'whatsapp_click',
        }),
      });
    } catch {}
    window.open(ctaUrl, '_blank');
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadContact.trim()) return;

    try {
      await fetch('/api/widget/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey,
          sessionId,
          name: leadName,
          contact: leadContact,
          source: 'form',
        }),
      });
      setLeadSaved(true);
      setTimeout(() => {
        setShowLeadModal(false);
        setLeadSaved(false);
      }, 1500);
    } catch {}
  };

  if (loadingConfig) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-6">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-6 text-center">
        <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
        <p className="text-xs font-bold text-slate-700">{configError}</p>
      </div>
    );
  }

  const primaryColor = config?.primaryColor || '#4F46E5';

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 text-slate-900 shadow-2xl overflow-hidden rounded-2xl border border-slate-200">
      {/* Header */}
      <header
        className="flex h-14 shrink-0 items-center justify-between px-4 text-white shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-bold text-white text-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold leading-tight">{config?.name}</span>
            <span className="text-[10px] opacity-80">● Siap Melayani 24/7</span>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          title="Tutup Widget"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Messages List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* WhatsApp Handover Button */}
                  {msg.cta && msg.cta.url && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleCtaClick(msg.cta!.url)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm w-full justify-center"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {msg.cta.label}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex items-center gap-2 p-2 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
            <span>Sedang mengetik...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Chips */}
      {config?.quickReplies && config.quickReplies.length > 0 && messages.length <= 2 && (
        <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto bg-white border-t border-slate-100">
          {config.quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => sendMessageText(qr)}
              className="shrink-0 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Form Input Footer */}
      <form onSubmit={handleSendMessage} className="flex h-14 shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ketik pertanyaanmu..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !inputMsg.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Footer Branding */}
      <div className="bg-slate-100 py-1 text-center text-[10px] text-slate-400 border-t border-slate-200">
        Dijawab oleh asisten AI · Ditenagai SIBISA
      </div>

      {/* Lead Form Modal */}
      {showLeadModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Tinggalkan Kontak Kamu</h4>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Admin kami akan menghubungi kamu kembali perihal pertanyaanmu.
            </p>

            {leadSaved ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 py-4">
                <CheckCircle2 className="h-5 w-5" />
                <span>Kontak Berhasil Terkirim!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveLead} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="No. WhatsApp / Email *"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-xl py-2 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Kirim Kontak
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
