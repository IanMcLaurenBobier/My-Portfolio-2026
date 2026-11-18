import { CheckCircle2, Github, Linkedin, Mail, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { PERSONAL_PROFILE } from '../data/portfolioData';
import { apiUrl } from '../utils/api';
import { playClickSound, playSuccessSound } from '../utils/sound';

interface ContactSectionProps {
  soundEnabled: boolean;
}

export function ContactSection({ soundEnabled }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot spam trap

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClickSound(soundEnabled);
    setSubmitting(true);
    setFieldErrors({});
    setStatusMessage(null);

    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          setFieldErrors(data.errors);
        }
        setStatusMessage({
          type: 'error',
          text: data.message || 'Please check the form fields and try again.',
        });
        return;
      }

      playSuccessSound(soundEnabled);
      setStatusMessage({
        type: 'success',
        text: data.message || 'Your message has been sent successfully.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Unable to reach the contact API right now. You can also reach me directly via email.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-reveal py-14 border-t border-white/8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-[var(--accent-bright)]">Connect</p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 [text-wrap:balance]">
              Let&apos;s build or troubleshoot something practical.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Open to software engineering, IT support, and network infrastructure opportunities. Send an inquiry through the API-backed form or connect directly.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`mailto:${PERSONAL_PROFILE.contactEmail}`}
              className="bento-card flex items-center justify-between p-4 text-sm text-zinc-200 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--accent-bright)]" />
                <span>{PERSONAL_PROFILE.contactEmail}</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">Email</span>
            </a>

            <a
              href={PERSONAL_PROFILE.githubUrlPlaceholder}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-card flex items-center justify-between p-4 text-sm text-zinc-200 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <Github className="h-4 w-4 text-[var(--accent-bright)]" />
                <span>GitHub (@IanMcLaurenBobier)</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">GitHub</span>
            </a>

            <a
              href={PERSONAL_PROFILE.linkedinUrlPlaceholder}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-card flex items-center justify-between p-4 text-sm text-zinc-200 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <Linkedin className="h-4 w-4 text-[var(--accent-bright)]" />
                <span>LinkedIn (Ian Mc Lauren Bobier)</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="bento-card lg:col-span-7 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Hidden honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/12 bg-[#0c0c10] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[var(--accent-bright)] focus:outline-none"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/12 bg-[#0c0c10] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[var(--accent-bright)] focus:outline-none"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.email[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Project collaboration, role inquiry, or question"
                className="w-full rounded-xl border border-white/12 bg-[#0c0c10] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[var(--accent-bright)] focus:outline-none"
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.subject[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a brief note about your team, project, or inquiry..."
                className="w-full rounded-xl border border-white/12 bg-[#0c0c10] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[var(--accent-bright)] focus:outline-none"
              />
              {fieldErrors.message && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.message[0]}</p>
              )}
            </div>

            {statusMessage && (
              <div
                role="status"
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${
                  statusMessage.type === 'success'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-red-500/40 bg-red-500/10 text-red-200'
                }`}
              >
                {statusMessage.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-[11px] font-mono text-zinc-500">
                Validated via POST /api/contact
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
