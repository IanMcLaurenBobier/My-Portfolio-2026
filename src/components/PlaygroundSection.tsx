import { Play, RefreshCw, Terminal as TerminalIcon } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { PERSONAL_PROFILE, THEME_OPTIONS } from '../data/portfolioData';
import type { AccentTheme } from '../types/portfolio';
import { apiUrl } from '../utils/api';
import { playClickSound, playPingSound } from '../utils/sound';

interface PlaygroundSectionProps {
  onChangeAccent: (accent: AccentTheme) => void;
  soundEnabled: boolean;
}

type PlaygroundTab = 'terminal' | 'api' | 'patterns';

interface TerminalEntry {
  command: string;
  output: string[];
}

const INITIAL_HISTORY: TerminalEntry[] = [
  {
    command: 'whoami',
    output: [
      `${PERSONAL_PROFILE.fullName} (${PERSONAL_PROFILE.preferredName})`,
      `${PERSONAL_PROFILE.degree} · ${PERSONAL_PROFILE.university} (${PERSONAL_PROFILE.graduation})`,
      'Focus: Software Development, IT Operations & Network Engineering',
    ],
  },
];

export function PlaygroundSection({ onChangeAccent, soundEnabled }: PlaygroundSectionProps) {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('terminal');

  // Terminal state
  const [inputCmd, setInputCmd] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>(INITIAL_HISTORY);

  // API Explorer state
  const [endpoint, setEndpoint] = useState<'/api/health' | '/api/projects' | '/api/projects?category=Featured'>('/api/health');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<string>('Ready');
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  // Pattern Inspector state
  const [selectedPattern, setSelectedPattern] = useState<
    'pattern-pixel-grid' | 'pattern-diagonal' | 'pattern-dots' | 'pattern-circuit' | 'pattern-mesh'
  >('pattern-pixel-grid');

  const runTerminalCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const arg = parts[1];

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    let output: string[] = [];

    if (cmd === 'help') {
      output = [
        'Available commands:',
        '  whoami            Display developer profile',
        '  skills            List core technical domains',
        '  projects          Show featured builds',
        '  experience        Show DOST-FNRI internship summary',
        '  ping gateway      Run simulated LAN gateway check',
        '  theme <color>     Switch accent (red, blue, purple, green, orange)',
        '  clear             Clear terminal history',
      ];
    } else if (cmd === 'whoami') {
      output = [
        `${PERSONAL_PROFILE.fullName} — "${PERSONAL_PROFILE.preferredName}"`,
        `Location: ${PERSONAL_PROFILE.location}`,
        `Education: ${PERSONAL_PROFILE.degree}, ${PERSONAL_PROFILE.university}`,
      ];
    } else if (cmd === 'skills') {
      output = [
        'Languages : TypeScript, JavaScript, Python, Java, PHP, VB.NET, SQL',
        'Frontend  : React, Astro, Tailwind CSS, React Native, HTML5/CSS3',
        'Backend   : Node.js, Express.js, Laravel, REST APIs, MySQL, Firebase',
        'IT & Net  : Hardware diagnostics, AIO/PC builds, M365/GWS, Router setup',
      ];
    } else if (cmd === 'projects') {
      output = [
        '1. DPMIS Lite — Research Project Management System (dpmislite-demo.netlify.app)',
        '2. HyperDiaSense — AI Nutritional Label Analyzer (hyperdiasense.netlify.app)',
        '3. Lapse Through Time — Chronological Firebase Web App',
        '4. Additional: CarinderiApp, PlusGrade, Box Rush, Academic Continuity Repo, Campus Lost & Found',
      ];
    } else if (cmd === 'experience') {
      output = [
        'DOST-FNRI — IT / MIS Intern',
        '· Desktop hardware/software troubleshooting & complete PC assembly from recovered parts',
        '· Agency event router configuration & peripheral setup',
        '· IFNRI website frontend UI/UX redesign (Figma, GitHub, Docker)',
      ];
    } else if (cmd === 'ping') {
      playPingSound(soundEnabled);
      output = [
        `PING ${arg || '192.168.10.1'} (simulated): 56 data bytes`,
        '64 bytes: icmp_seq=0 ttl=64 time=1.32 ms',
        '64 bytes: icmp_seq=1 ttl=64 time=1.45 ms',
        '--- 2 packets transmitted, 2 packets received, 0% packet loss ---',
      ];
    } else if (cmd === 'theme') {
      const valid = THEME_OPTIONS.find((t) => t.id === arg);
      if (valid) {
        onChangeAccent(valid.id);
        output = [`Theme accent updated to ${valid.label}.`];
      } else {
        output = ['Usage: theme <red|blue|purple|green|orange>'];
      }
    } else {
      output = [`Command not found: ${cmd}. Type "help" for available commands.`];
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleTerminalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    playClickSound(soundEnabled);
    runTerminalCommand(inputCmd);
    setInputCmd('');
  };

  const handleFetchApi = async (target: typeof endpoint) => {
    playClickSound(soundEnabled);
    setEndpoint(target);
    setApiLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(apiUrl(target));
      const elapsed = Math.round(performance.now() - start);
      const json = await res.json();
      setApiStatus(`${res.status} ${res.statusText}`);
      setApiLatency(elapsed);
      setApiResponse(JSON.stringify(json, null, 2));
    } catch (err) {
      setApiStatus('Request Failed');
      setApiLatency(null);
      setApiResponse(String(err));
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <section id="playground" className="scroll-reveal py-14 border-t border-white/8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-mono text-[var(--accent-bright)]">Experiments &amp; API Contract</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Developer Playground
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            Interactive command terminal, live backend REST API inspector, and reusable CSS background pattern lab.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#121217] p-1 shrink-0">
          {(
            [
              { id: 'terminal', label: 'Terminal' },
              { id: 'api', label: 'REST API' },
              { id: 'patterns', label: 'CSS Patterns' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                playClickSound(soundEnabled);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--accent-muted)] text-white border border-[var(--accent-border)]'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'terminal' && (
        <div className="bento-card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#101015] px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <TerminalIcon className="h-4 w-4 text-[var(--accent-bright)]" />
              <span>mac@portfolio-shell:~</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['help', 'skills', 'projects', 'ping gateway', 'theme blue'].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    runTerminalCommand(quick);
                  }}
                  className="rounded-md border border-white/10 bg-[#1a1a21] px-2.5 py-1 text-[11px] font-mono text-zinc-300 transition-colors hover:border-[var(--accent-border)] hover:text-white"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0e] p-5 font-mono text-xs space-y-4 max-h-80 overflow-y-auto">
            {history.map((entry, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-zinc-200">
                  <span className="text-[var(--accent-bright)]">mac@lab</span>:~$ {entry.command}
                </div>
                <div className="pl-3 space-y-0.5 text-zinc-400">
                  {entry.output.map((line, lIdx) => (
                    <div key={lIdx}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleTerminalSubmit}
            className="flex items-center gap-2 border-t border-white/10 bg-[#0e0e13] px-5 py-3"
          >
            <span className="font-mono text-xs text-[var(--accent-bright)] shrink-0">$</span>
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder='Type a command (try "help", "experience", or "theme green")...'
              aria-label="Terminal command input"
              className="w-full bg-transparent font-mono text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap shrink-0 hover:bg-[var(--accent)]"
            >
              <Play className="h-3 w-3" />
              <span>Run</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="bento-card p-6 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-zinc-100">
                Live REST API &amp; JSON Response Viewer
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Queries the live Express API server (mirroring the included Laravel 11 API routes in <code className="text-zinc-300">/backend-laravel</code>).
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
              <span>Status: <strong className="text-zinc-100">{apiStatus}</strong></span>
              {apiLatency !== null && (
                <span className="tabular-nums">Time: <strong className="text-[var(--accent-bright)]">{apiLatency}ms</strong></span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                '/api/health',
                '/api/projects',
                '/api/projects?category=Featured',
              ] as const
            ).map((ep) => (
              <button
                key={ep}
                type="button"
                onClick={() => handleFetchApi(ep)}
                disabled={apiLoading}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-colors ${
                  endpoint === ep && apiResponse
                    ? 'border-[var(--accent-border)] bg-[var(--accent-muted)] text-white'
                    : 'border-white/12 bg-[#17171d] text-zinc-300 hover:border-[var(--accent-border)]'
                }`}
              >
                <RefreshCw className={`h-3 w-3 ${apiLoading && endpoint === ep ? 'animate-spin' : ''}`} />
                <span>GET {ep}</span>
              </button>
            ))}
          </div>

          <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-[#09090c] p-4 font-mono text-xs leading-relaxed text-zinc-300">
            {apiResponse || '// Click an endpoint button above to execute a live GET request and inspect the JSON response.'}
          </pre>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="bento-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-zinc-100">
                Reusable CSS Pattern System
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Lightweight gradient and pseudo-element textures clipped inside dashboard cards, synced with CSS theme variables.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'pattern-pixel-grid', label: 'Pixel Grid' },
                  { id: 'pattern-diagonal', label: 'Diagonal' },
                  { id: 'pattern-dots', label: 'Outlined Dots' },
                  { id: 'pattern-circuit', label: 'Circuit Grid' },
                  { id: 'pattern-mesh', label: 'Network Mesh' },
                ] as const
              ).map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => {
                    setSelectedPattern(pat.id);
                    playClickSound(soundEnabled);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedPattern === pat.id
                      ? 'border-[var(--accent-border)] bg-[var(--accent-muted)] text-white'
                      : 'border-white/10 bg-[#17171d] text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {pat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="group relative h-56 overflow-hidden rounded-xl border border-[var(--accent-border-subtle)] bg-[#0b0b0f] flex items-center justify-center">
            <div className={`${selectedPattern} absolute inset-0`} aria-hidden="true" />
            <div className="relative z-10 rounded-xl border border-white/12 bg-[#141419]/92 px-5 py-3 text-center">
              <div className="font-mono text-xs text-[var(--accent-bright)]">.{selectedPattern}</div>
              <div className="mt-1 text-xs text-zinc-300">Hover over this preview surface to inspect hover state intensity</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
