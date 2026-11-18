import { Lock, Plus, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { ContactSubmission, ProjectItem } from '../types/portfolio';
import { apiUrl } from '../utils/api';

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  onProjectsUpdated: () => Promise<void>;
}

export function AdminModal({ open, onClose, projects, onProjectsUpdated }: AdminModalProps) {
  const [passcode, setPasscode] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [tab, setTab] = useState<'projects' | 'messages'>('projects');

  // New project form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [domain, setDomain] = useState('Software Development');
  const [category, setCategory] = useState<'Featured' | 'Additional'>('Additional');
  const [summary, setSummary] = useState('');
  const [techList, setTechList] = useState('React, TypeScript, Tailwind CSS');
  const [liveUrl, setLiveUrl] = useState('');
  const [formFeedback, setFormFeedback] = useState<string | null>(null);

  if (!open) return null;

  const loadMessages = async (adminToken: string) => {
    const res = await fetch(apiUrl('/api/messages'), {
      headers: { 'X-Admin-Token': adminToken },
    });
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data || []);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch(apiUrl('/api/admin/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        setAuthError('Invalid admin passcode.');
        return;
      }
      setToken(passcode);
      await loadMessages(passcode);
    } catch {
      setAuthError('Failed to verify passcode.');
    }
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormFeedback(null);

    const technologies = techList
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch(apiUrl('/api/projects'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: JSON.stringify({
        title,
        subtitle,
        domain,
        category,
        summary,
        technologies,
        liveUrl: liveUrl || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setFormFeedback(data.message || 'Could not create project.');
      return;
    }

    setTitle('');
    setSubtitle('');
    setSummary('');
    setLiveUrl('');
    setFormFeedback('Project added to portfolio.');
    await onProjectsUpdated();
  };

  const handleDeleteProject = async (id: string) => {
    if (!token) return;
    const res = await fetch(apiUrl(`/api/projects/${id}`), {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token },
    });
    if (res.ok) {
      await onProjectsUpdated();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Administration Console"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--accent-border)] bg-[#121217] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-zinc-100">
              Portfolio Content &amp; Inquiry Admin
            </h3>
            <p className="text-xs text-zinc-400">
              Manage projects and review contact submissions via protected API routes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin panel"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a21] text-zinc-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!token ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="rounded-xl border border-white/10 bg-[#0d0d11] p-4 text-xs text-zinc-300">
              <div className="flex items-center gap-2 font-semibold text-zinc-100">
                <Lock className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
                <span>Protected Endpoint Access</span>
              </div>
              <p className="mt-1 text-zinc-400">
                Enter the admin passcode configured in <code className="text-zinc-200">PORTFOLIO_ADMIN_PASSCODE</code> (default local demo passcode: <code className="text-zinc-200">mac-admin-2026</code>).
              </p>
            </div>

            <div>
              <label htmlFor="admin-passcode" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Admin Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full rounded-xl border border-white/12 bg-[#0c0c10] px-3.5 py-2.5 text-sm text-zinc-100 focus:border-[var(--accent-bright)] focus:outline-none"
              />
              {authError && <p className="mt-1.5 text-xs text-red-400">{authError}</p>}
            </div>

            <button
              type="submit"
              className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white"
            >
              Authenticate
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setTab('projects')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  tab === 'projects'
                    ? 'bg-[var(--accent-muted)] text-white border border-[var(--accent-border)]'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Projects ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('messages');
                  loadMessages(token);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  tab === 'messages'
                    ? 'bg-[var(--accent-muted)] text-white border border-[var(--accent-border)]'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Inquiries ({messages.length})
              </button>
            </div>

            {tab === 'projects' && (
              <div className="space-y-5">
                <form onSubmit={handleAddProject} className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d11] p-4">
                  <h4 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
                    <span>Add Project Entry</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project Title"
                      className="rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                    />
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Subtitle"
                      className="rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                    />
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="Domain (e.g. Web Application)"
                      className="rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                    />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as 'Featured' | 'Additional')}
                      className="rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                    >
                      <option value="Additional">Additional</option>
                      <option value="Featured">Featured</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={techList}
                    onChange={(e) => setTechList(e.target.value)}
                    placeholder="Technologies (comma-separated)"
                    className="w-full rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                  />
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="Live Demo URL (optional)"
                    className="w-full rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                  />
                  <textarea
                    rows={2}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Short project summary..."
                    className="w-full rounded-lg border border-white/10 bg-[#14141a] px-3 py-2 text-xs text-zinc-100"
                  />
                  {formFeedback && <p className="text-xs text-[var(--accent-bright)]">{formFeedback}</p>}
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Save Project
                  </button>
                </form>

                <div className="space-y-2">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#16161b] px-4 py-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-zinc-100">{p.title}</span>
                        <span className="ml-2 font-mono text-zinc-500">({p.category})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(p.id)}
                        aria-label={`Delete ${p.title}`}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'messages' && (
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-4 text-center">
                    No contact inquiries submitted yet.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl border border-white/10 bg-[#16161b] p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-100">{m.subject}</span>
                        <span className="font-mono text-zinc-500">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--accent-bright)]">
                        {m.name} · {m.email}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
