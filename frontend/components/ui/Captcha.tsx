'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

interface CaptchaProps {
  onCaptchaChange: (token: string, answer: string) => void;
  error?: string;
}

export default function Captcha({ onCaptchaChange, error }: CaptchaProps) {
  const [question, setQuestion] = useState('7 + 5 = ?');
  const [token, setToken] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCaptcha = async () => {
    setLoading(true);
    try {
      const res = await api.get('/captcha');
      if (res.data?.status === 'success' && res.data?.data) {
        setQuestion(res.data.data.question);
        setToken(res.data.data.token);
        setUserAnswer('');
        onCaptchaChange(res.data.data.token, '');
      }
    } catch (e) {
      // Local graceful fallback
      const n1 = Math.floor(Math.random() * 9) + 1;
      const n2 = Math.floor(Math.random() * 8) + 1;
      setQuestion(`Berapa ${n1} + ${n2} = ?`);
      const fallbackToken = btoa(JSON.stringify({ answer: n1 + n2, exp: Date.now() + 600000 }));
      setToken(fallbackToken);
      setUserAnswer('');
      onCaptchaChange(fallbackToken, '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setUserAnswer(val);
    onCaptchaChange(token, val);
  };

  return (
    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          Verifikasi Keamanan (Anti-Bot) *
        </label>
        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading}
          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
          title="Ganti Soal Captcha"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ganti Soal</span>
        </button>
      </div>
      <p className="text-[11px] text-slate-500">
        Jawab pertanyaan matematika sederhana di bawah ini untuk memastikan Anda bukan robot:
      </p>

      <div className="flex items-center gap-3 pt-1">
        <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 font-mono text-sm font-extrabold text-slate-900 select-none shadow-2xs tracking-wider">
          {question}
        </div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          required
          value={userAnswer}
          onChange={handleChange}
          placeholder="Jawaban angka"
          className="w-32 px-3.5 py-2.5 text-xs font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
        />
      </div>

      {error && (
        <p className="text-[11px] font-semibold text-rose-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
