'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, X, Send, Bot, User, ArrowRight, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function AiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; actionButton?: any }>>([
    {
      sender: 'bot',
      text: 'Halo! Selamat datang di Pusat Informasi & Layanan Desa Jombe. Ada yang bisa kami bantu terkait persyaratan surat atau panduan administrasi desa?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt: userText });
      if (res.data.status === 'success') {
        const botData = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: botData.reply,
            actionButton: botData.actionButton,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Mohon maaf, terjadi kendala saat memproses informasi. Silakan periksa koneksi atau hubungi kontak kantor desa.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl shadow-xl transition-all flex items-center gap-2 group ${
          isOpen ? 'hidden' : 'flex'
        }`}
        title="Bantuan Informasi Layanan"
      >
        <HelpCircle className="w-5 h-5 text-emerald-200" />
        <span className="text-xs font-bold pr-1">Bantuan Layanan</span>
      </button>

      {/* Clean Help Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <HelpCircle className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">Panduan Informasi Desa</h3>
                <span className="text-[10px] text-emerald-200 block">Layanan Responsif 24 Jam</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.actionButton && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <Link
                        href={msg.actionButton.url}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-lg text-[11px] transition-colors border border-emerald-200"
                      >
                        {msg.actionButton.label} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200/80 text-xs text-slate-500 w-fit">
                Memproses informasi...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan syarat surat atau informasi desa..."
              className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
