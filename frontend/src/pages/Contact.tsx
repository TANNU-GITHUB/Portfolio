import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, Send, Github, Linkedin, FileText, Download, Eye } from 'lucide-react';
import type { PageProps } from '../pageProps';

export default function Contact({ theme }: PageProps) {
  const d = theme === 'day';
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Backend URL (Update this when deploying)
  const API_URL = 'https://portfolio-backend-r3qi.onrender.com/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const resumeHref = (format: 'pdf' | 'docx', mode: 'view' | 'download') =>
    mode === 'view' ? `${API_URL}/resume/${format}?mode=view` : `${API_URL}/resume/${format}`;

  const handleDownload = (format: 'pdf' | 'docx') => {
    window.location.href = resumeHref(format, 'download');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-x-hidden" style={{ zIndex: 1 }}>
      <div className="max-w-4xl w-full space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-thin tracking-[0.3em] text-center"
          style={{ color: d ? 'rgba(38,40,52,0.88)' : 'rgba(255,255,255,0.9)' }}
        >
          CONTACT
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column: Info & Resume */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-2 space-y-5"
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.03)',
                border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(15px) saturate(150%)',
              }}
            >
              <h3 className="text-sm tracking-[0.3em] mb-5 font-light" style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}>
                GET IN TOUCH
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: d ? 'rgba(55,58,72,0.62)' : 'rgba(255,255,255,0.5)', lineHeight: '1.9' }}>
                Open to exciting opportunities, collaborations, and creative projects. Let's build something extraordinary together.
              </p>
              <a href="mailto:tannu.learning@gmail.com" className="text-sm block mb-2" style={{ color: '#22d3ee' }}>
                tannu.learning@gmail.com
              </a>
            </div>

            {/* NEW: Resume Download Section */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.03)',
                border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(15px) saturate(150%)',
              }}
            >
              <h3 className="text-sm tracking-[0.3em] mb-4 font-light" style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}>
                CURRICULUM VITAE
              </h3>
              <div className="flex flex-col gap-3">
                {(
                  [
                    { format: 'pdf' as const, label: 'PDF Version', iconClass: 'text-red-400' },
                    { format: 'docx' as const, label: 'Word (.docx)', iconClass: 'text-blue-400' },
                  ] as const
                ).map(({ format, label, iconClass }) => (
                  <div
                    key={format}
                    className="flex w-full items-stretch overflow-hidden rounded-xl text-sm font-light transition-colors hover:bg-white/[0.04]"
                    style={{
                      border: d ? '1px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.1)',
                      color: d ? 'rgba(32,36,48,0.88)' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5">
                      <FileText size={16} className={iconClass} />
                      <span className="truncate">{label}</span>
                    </div>
                    <a
                      href={resumeHref(format, 'view')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex shrink-0 items-center gap-1.5 border-l px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${d ? 'border-black/10 hover:bg-black/[0.04]' : 'border-white/10 hover:bg-white/10'}`}
                      style={{ color: '#67e8f9' }}
                    >
                      <Eye size={14} strokeWidth={1.75} />
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDownload(format)}
                      title="Download"
                      className={`flex shrink-0 items-center justify-center border-l px-3 py-2.5 transition-colors ${d ? 'border-black/10 hover:bg-black/[0.04]' : 'border-white/10 hover:bg-white/10'}`}
                      style={{ color: d ? 'rgba(55,58,72,0.5)' : 'rgba(255,255,255,0.45)' }}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-5 flex justify-center gap-6"
              style={{
                background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.03)',
                border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(15px) saturate(150%)',
              }}
            >
              {(
                [
                  { Icon: Github, href: 'https://github.com/TANNU-GITHUB', label: 'GitHub' as const },
                  {
                    Icon: Linkedin,
                    href: 'https://www.linkedin.com/in/tannu-bagadia-03b918285/',
                    label: 'LinkedIn' as const,
                  },
                ] as const
              ).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${d ? 'hover:bg-black/[0.05]' : 'hover:bg-white/10'}`}
                  style={{
                    background: d ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.05)',
                    border: d ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Icon
                    size={16}
                    style={{ color: label === 'GitHub' ? (d ? '#24292f' : '#ffffff') : '#22d3ee' }}
                  />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:col-span-3 rounded-2xl p-7 space-y-5 flex flex-col justify-between"
            style={{
              background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.03)',
              border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(15px) saturate(150%)',
            }}
          >
            {[
              { label: 'Name', key: 'name', Icon: User, type: 'text', placeholder: 'Your full name' },
              { label: 'Email', key: 'email', Icon: Mail, type: 'email', placeholder: 'your@email.com' },
            ].map(({ label, key, Icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs tracking-[0.25em] mb-2 font-light" style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}>
                  {label.toUpperCase()}
                </label>
                <div className="relative">
                  <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: d ? 'rgba(55,58,72,0.35)' : 'rgba(255,255,255,0.3)' }} />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-light transition-all duration-300 outline-none focus:border-cyan-500/40"
                    style={{
                      background: d ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.04)',
                      border: d ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)',
                      color: d ? 'rgba(32,36,48,0.88)' : 'rgba(255,255,255,0.8)',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="flex-1">
              <label className="block text-xs tracking-[0.25em] mb-2 font-light" style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}>
                MESSAGE
              </label>
              <div className="relative h-[calc(100%-2rem)]">
                <MessageSquare size={14} className="absolute left-4 top-4" style={{ color: d ? 'rgba(55,58,72,0.35)' : 'rgba(255,255,255,0.3)' }} />
                <textarea
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  required
                  className="w-full h-full min-h-[120px] pl-10 pr-4 py-3 rounded-xl text-sm font-light transition-all duration-300 outline-none resize-none focus:border-cyan-500/40"
                  style={{
                    background: d ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.04)',
                    border: d ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)',
                    color: d ? 'rgba(32,36,48,0.88)' : 'rgba(255,255,255,0.8)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 rounded-xl text-sm font-medium tracking-widest flex items-center justify-center gap-3 transition-all duration-300"
              style={{
                background: status === 'sent'
                  ? 'linear-gradient(135deg, rgba(52,211,153,0.25), rgba(52,211,153,0.1))'
                  : status === 'error'
                  ? 'linear-gradient(135deg, rgba(248,113,113,0.25), rgba(248,113,113,0.1))'
                  : 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(96,165,250,0.15))',
                border: `1px solid ${status === 'sent' ? 'rgba(52,211,153,0.4)' : status === 'error' ? 'rgba(248,113,113,0.4)' : 'rgba(34,211,238,0.3)'}`,
                color: status === 'sent' ? '#34d399' : status === 'error' ? '#f87171' : '#22d3ee',
              }}
            >
              <Send size={14} />
              {status === 'sending' ? 'SENDING...' : status === 'sent' ? 'MESSAGE SENT!' : status === 'error' ? 'ERROR: TRY AGAIN' : 'SEND MESSAGE'}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}