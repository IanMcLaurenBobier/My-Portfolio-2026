import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PERSONAL_PROFILE, TECH_BADGES, THEME_OPTIONS } from '../data/portfolioData';
import type { AccentTheme, TechBadgeItem } from '../types/portfolio';
import { playClickSound } from '../utils/sound';
import { MiniGlobe } from './MiniGlobe';
import { TerminalCore3D } from './TerminalCore3D';

export type OverlaySection =
  | 'projects'
  | 'experience'
  | 'network'
  | 'playground'
  | 'about'
  | 'contact'
  | 'admin'
  | null;

interface BentoHomepageProps {
  accent: AccentTheme;
  onChangeAccent: (accent: AccentTheme) => void;
  reducedMotion: boolean;
  soundEnabled: boolean;
  onOpenSection: (section: OverlaySection) => void;
}

const PIXEL_CELLS = [
  { top: '12%', left: '14%', delay: '0s' },
  { top: '22%', left: '70%', delay: '0.5s' },
  { top: '44%', left: '36%', delay: '1.0s' },
  { top: '66%', left: '76%', delay: '0.3s' },
  { top: '70%', left: '16%', delay: '1.4s' },
  { top: '18%', left: '46%', delay: '0.8s' },
  { top: '54%', left: '56%', delay: '1.7s' },
];

const STACK_GROUPS = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'PHP', 'VB.NET', 'SQL'] },
  { label: 'Frontend & UI', items: ['React', 'Astro', 'Tailwind CSS', 'React Native', 'HTML5 / CSS3', 'Figma'] },
  { label: 'Backend & Data', items: ['Node.js', 'Express.js', 'Laravel', 'REST APIs', 'MySQL', 'Firebase'] },
  { label: 'Systems, Net & AI', items: ['Hardware Diagnostics', 'Workstation & AIO Setup', 'M365 & Google Workspace', 'Router Setup & Config', 'TCP/IP & Subnets', 'Docker & Git/GitHub', 'AI Integration', 'OCR Pipelines'] },
];

function formatClock(date: Date, timeZone: string | undefined, use24h: boolean): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: use24h ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: !use24h,
    }).format(date);
  } catch {
    return '--:--';
  }
}

function getTimezoneDiffLabel(): { offsetText: string; localZoneLabel: string } {
  const now = new Date();
  const localMinutesFromUtc = -now.getTimezoneOffset();
  const manilaMinutesFromUtc = 8 * 60;
  const diffHours = Math.round((manilaMinutesFromUtc - localMinutesFromUtc) / 60);

  const localHours = localMinutesFromUtc / 60;
  const sign = localHours >= 0 ? '+' : '';
  const localZoneLabel = `UTC${sign}${Number.isInteger(localHours) ? localHours : localHours.toFixed(1)}`;

  if (diffHours === 0) {
    return { offsetText: 'Same timezone', localZoneLabel };
  }
  const absH = Math.abs(diffHours);
  const unit = absH === 1 ? 'hr' : 'hrs';
  return {
    offsetText: diffHours > 0 ? `Manila +${absH} ${unit}` : `Manila -${absH} ${unit}`,
    localZoneLabel,
  };
}

export function BentoHomepage({
  accent,
  onChangeAccent,
  reducedMotion,
  soundEnabled,
  onOpenSection,
}: BentoHomepageProps) {
  const [use24h, setUse24h] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const [hoveredTech, setHoveredTech] = useState<TechBadgeItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === accent) || THEME_OPTIONS[0];

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  const phTime = formatClock(now, 'Asia/Manila', use24h);
  const visitorTime = formatClock(now, undefined, use24h);
  const { offsetText, localZoneLabel } = getTimezoneDiffLabel();

  const findBadgeMeta = (name: string): TechBadgeItem | undefined =>
    TECH_BADGES.find((b) => b.name.toLowerCase() === name.toLowerCase());

  const handleCopyEmail = async () => {
    playClickSound(soundEnabled);
    try {
      await navigator.clipboard.writeText(PERSONAL_PROFILE.contactEmail);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      onOpenSection('contact');
    }
  };

  return (
    <main className="relative z-10 flex min-h-screen lg:h-screen lg:overflow-hidden items-center justify-center p-3 sm:p-5 lg:px-12 lg:py-5">
      {/* Subtle dual atmospheric depth gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-35"
        style={{
          background: `radial-gradient(circle at 18% 12%, var(--accent-glow), transparent 36%), radial-gradient(circle at 82% 88%, var(--accent-glow), transparent 38%)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-[1180px] lg:h-[min(860px,calc(100vh-40px))] grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(8,minmax(0,1fr))]">
        {/* 1. TOP-LEFT INTRO CARD (3 cols x 4 rows) */}
        <article className="bento-card bento-card-intro bento-animate group md:col-span-2 lg:col-span-3 lg:row-span-4 p-5 sm:p-6 flex flex-col lg:flex-row items-stretch justify-between gap-4">
          <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-title)]">
                <span>Ian Mc Lauren Bobier</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">Mac</span>
              </div>

              <h1 className="mt-2 font-display text-2xl sm:text-[1.6rem] font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                Junior Software Developer, IT Technical Support &amp; Networking.
              </h1>

              <p className="mt-2.5 text-[13px] sm:text-sm leading-relaxed text-zinc-300">
                Computer Science graduate from <span className="text-zinc-100 font-medium">Taguig City University</span>. During my internship at <span className="text-zinc-100 font-medium">DOST-FNRI</span>, I supported IT operations, built and repaired desktop workstations, configured event routers, and helped redesign the IFNRI web frontend.
              </p>

              <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
                Focused on full-stack web workflows, database architecture, network infrastructure, and practical AI applications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenSection('projects');
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] px-3.5 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-[var(--accent)]"
              >
                <span>Explore Builds</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <a
                href={PERSONAL_PROFILE.githubUrlPlaceholder}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                title="GitHub — IanMcLaurenBobier"
                onClick={() => playClickSound(soundEnabled)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#13161e] px-3 text-xs font-medium text-zinc-200 whitespace-nowrap transition-colors hover:border-[var(--accent-border)] hover:text-white"
              >
                <Github className="h-3.5 w-3.5 text-[var(--accent-title)]" />
                <span>GitHub</span>
              </a>

              <a
                href={PERSONAL_PROFILE.linkedinUrlPlaceholder}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                title="LinkedIn — Ian Mc Lauren Bobier"
                onClick={() => playClickSound(soundEnabled)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#13161e] px-3 text-xs font-medium text-zinc-200 whitespace-nowrap transition-colors hover:border-[var(--accent-border)] hover:text-white"
              >
                <Linkedin className="h-3.5 w-3.5 text-[var(--accent-title)]" />
                <span>LinkedIn</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenSection('contact');
                }}
                aria-label="Open contact form"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#13161e] px-3 text-xs font-medium text-zinc-200 whitespace-nowrap transition-colors hover:border-[var(--accent-border)] hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-[var(--accent-title)]" />
                <span>Contact</span>
              </button>
            </div>
          </div>

          {/* Framed 3D Engineering Viewport */}
          <div className="relative h-[210px] lg:h-full lg:w-[41%] shrink-0 rounded-xl border border-white/8 bg-[#08090d]/85 overflow-hidden">
            {/* Subtle corner crosshair reticles */}
            <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 text-[10px] font-mono text-zinc-600">+</span>
            <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 text-[10px] font-mono text-zinc-600">+</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-2 bottom-2 text-[10px] font-mono text-zinc-600">+</span>
            <span aria-hidden="true" className="pointer-events-none absolute right-2 bottom-2 text-[10px] font-mono text-zinc-600">+</span>
            <TerminalCore3D
              accentColorHex={currentThemeObj.threeColor}
              reducedMotion={reducedMotion}
            />
          </div>
        </article>

        {/* 2. RIGHT TALL CARD: CAPABILITIES & STACK (1 col x 6 rows) */}
        <article className="bento-card bento-animate group md:col-span-2 lg:col-span-1 lg:row-span-6 p-4 sm:p-5 flex flex-col justify-between min-h-0">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/8 shrink-0">
            <h2 className="font-display text-base font-bold card-title-accent">
              Technical Stack
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">
              {TECH_BADGES.length} tools
            </span>
          </div>

          <div className="flex-1 overflow-y-auto thin-scroll pr-1 pt-2.5 space-y-3 min-h-0">
            {STACK_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="text-[11px] font-semibold text-zinc-400 mb-1.5">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((techName) => {
                    const meta = findBadgeMeta(techName);
                    const isActive = hoveredTech?.name === techName;
                    return (
                      <button
                        key={techName}
                        type="button"
                        onMouseEnter={() => meta && setHoveredTech(meta)}
                        onFocus={() => meta && setHoveredTech(meta)}
                        onClick={() => {
                          if (meta) setHoveredTech(meta);
                          playClickSound(soundEnabled);
                        }}
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap transition-all duration-150 ${
                          isActive
                            ? 'border-[var(--accent-bright)] bg-[var(--accent-muted)] text-white'
                            : 'border-white/10 bg-[#13161e] text-zinc-300 hover:border-[var(--accent-bright)] hover:bg-[var(--accent-muted)] hover:text-white'
                        }`}
                      >
                        {techName}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] leading-snug text-zinc-400 shrink-0 min-h-[38px]">
            {hoveredTech ? (
              <div>
                <span className="font-semibold text-zinc-100">{hoveredTech.name}</span>
                <span className="text-[var(--accent-title)]"> · {hoveredTech.tier}</span>
                <span className="block text-zinc-400 truncate">{hoveredTech.summary}</span>
              </div>
            ) : (
              <span>Inspect any item for project or internship usage.</span>
            )}
          </div>
        </article>

        {/* 3. BOTTOM-LEFT TALL CARD: WORK WITH ME (1 col x 4 rows) */}
        <article className="bento-card bento-animate group lg:col-span-1 lg:row-span-4 p-5 flex flex-col justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold leading-snug card-title-accent">
              Open to Work &amp; Collaboration
            </h2>

            <div className="mt-3.5 space-y-1.5">
              <div className="text-[11px] font-mono text-[var(--accent-title)]">
                Direct Email
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#12151d] px-2.5 py-2">
                <a
                  href={`mailto:${PERSONAL_PROFILE.contactEmail}`}
                  onClick={() => playClickSound(soundEnabled)}
                  className="text-[11px] font-mono text-zinc-200 hover:text-white truncate"
                >
                  {PERSONAL_PROFILE.contactEmail}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  title="Copy email"
                  className="shrink-0 text-zinc-400 hover:text-[var(--accent-title)] transition-colors"
                >
                  {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="text-xs text-zinc-400">
                {PERSONAL_PROFILE.location}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400">
              Quick Actions
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenSection('contact');
                }}
                className="flex items-center justify-between rounded-lg border border-[var(--accent-border-subtle)] bg-[var(--accent-muted)] px-3 py-1.5 text-zinc-100 transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                <span>Send Inquiry</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenSection('admin');
                }}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-[#12151d] px-3 py-1.5 text-zinc-300 transition-colors hover:border-[var(--accent-border)] hover:text-white"
              >
                <span>Admin Console</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
              </button>
            </div>
          </div>
        </article>

        {/* 4. DUAL TIMEZONE SYNC CARD (1 col x 2 rows) */}
        <article className="bento-card bento-animate group lg:col-span-1 lg:row-span-2 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono tracking-wider text-zinc-400">
                MANILA · PH
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setUse24h((prev) => !prev);
                }}
                aria-label="Toggle 12-hour or 24-hour clock"
                className="rounded border border-white/12 bg-[#141720] px-1.5 py-0.5 text-[10px] font-mono text-zinc-200 hover:border-[var(--accent-bright)]"
              >
                {use24h ? '24H' : '12H'}
              </button>
            </div>
            <div className="mt-1 font-display text-2xl font-bold tracking-tight text-white tabular-nums">
              {phTime}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              UTC+8 · Taguig City
            </div>
          </div>

          <div className="relative my-1.5 flex items-center justify-center">
            <div className="h-px w-full bg-white/10" />
            <span className="absolute bg-[#0e1016] px-2 text-[10px] font-mono text-zinc-400 whitespace-nowrap">
              {offsetText}
            </span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono tracking-wider text-zinc-500">
                LOCAL TIME
              </div>
              <div className="font-display text-lg font-semibold tracking-tight text-zinc-200 tabular-nums">
                {visitorTime}
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 pb-0.5">
              {localZoneLabel}
            </div>
          </div>
        </article>

        {/* 5. SELECTED PROJECTS COLLAGE CARD (1 col x 1 row) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenSection('projects');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSection('projects');
            }
          }}
          className="bento-card bento-animate group cursor-pointer lg:col-span-1 lg:row-span-1 p-4 flex items-center justify-between min-h-[78px]"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src="/src/assets/images/dpmis_lite_preview.png"
              alt=""
              referrerPolicy="no-referrer"
              className="absolute right-12 -top-2 h-16 w-24 rounded object-cover opacity-35 -rotate-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            />
            <img
              src="/src/assets/images/hyperdiasense_preview.png"
              alt=""
              referrerPolicy="no-referrer"
              className="absolute -right-2 -bottom-2 h-16 w-24 rounded object-cover opacity-35 rotate-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1016] via-[#0e1016]/85 to-[#0e1016]/45" />
          </div>

          <div className="relative z-10">
            <h2 className="font-display text-base font-bold card-title-accent">
              Selected Projects
            </h2>
            <p className="text-[11px] text-zinc-400">DPMIS Lite, HyperDiaSense &amp; more</p>
          </div>
          <ArrowUpRight className="relative z-10 h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-title)]" />
        </article>

        {/* 6. QUICK UPDATE CARD (1 col x 1 row) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenSection('about');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSection('about');
            }
          }}
          className="bento-card bento-animate group cursor-pointer lg:col-span-1 lg:row-span-1 px-4 py-3 flex flex-col justify-between min-h-[78px]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-bold card-title-accent">
              Quick Update
            </h2>
            <span className="text-[10px] font-mono text-[var(--accent-title)]">
              Open to work
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-snug line-clamp-2">
            Currently looking for a role that fits my skills and interests.
          </p>
        </article>

        {/* 7. INTERACTIVE LAB / PLAYGROUND CARD (1 col x 1 row, animated pixel-grid) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenSection('playground');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSection('playground');
            }
          }}
          className="bento-card bento-animate group cursor-pointer lg:col-span-1 lg:row-span-1 p-4 flex items-center justify-between min-h-[78px]"
        >
          <div className="pattern-pixel-grid pointer-events-none absolute inset-0" aria-hidden="true">
            {PIXEL_CELLS.map((cell, idx) => (
              <span
                key={idx}
                className="pixel-block pixel-animate absolute h-3.5 w-3.5 rounded-[2px]"
                style={{ top: cell.top, left: cell.left, animationDelay: cell.delay }}
              />
            ))}
          </div>
          <div className="relative z-10 flex items-center gap-2.5">
            <Terminal className="h-4 w-4 text-[var(--accent-title)]" />
            <div>
              <h2 className="font-display text-base font-bold card-title-accent">
                Code &amp; API Lab
              </h2>
              <p className="text-[11px] text-zinc-400">Shell · JSON · Patterns</p>
            </div>
          </div>
          <ArrowUpRight className="relative z-10 h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-title)]" />
        </article>

        {/* 8. DOST-FNRI EXPERIENCE CARD (1 col x 1 row, diagonal pattern) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenSection('experience');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSection('experience');
            }
          }}
          className="bento-card bento-animate group cursor-pointer lg:col-span-1 lg:row-span-1 p-4 flex items-center justify-between min-h-[78px]"
        >
          <div className="pattern-diagonal pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative z-10">
            <h2 className="font-display text-base font-bold card-title-accent">
              DOST-FNRI
            </h2>
            <p className="text-[11px] text-zinc-300">IT / MIS Intern Experience</p>
          </div>
          <ArrowUpRight className="relative z-10 h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-title)]" />
        </article>

        {/* 9. ABOUT & CAPABILITIES CARD (1 col x 1 row, outlined dot pattern) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenSection('about');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSection('about');
            }
          }}
          className="bento-card bento-animate group cursor-pointer lg:col-span-1 lg:row-span-1 p-4 flex items-center justify-between min-h-[78px]"
        >
          <div className="pattern-dots dots-animate pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative z-10">
            <h2 className="font-display text-base font-bold card-title-accent">
              About &amp; Matrix
            </h2>
            <p className="text-[11px] text-zinc-400">Profile &amp; skill context</p>
          </div>
          <ArrowUpRight className="relative z-10 h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-title)]" />
        </article>

        {/* 10. NETWORK TOPOLOGY CARD (1 col x 1 row, rotating network mesh sphere) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenSection('network');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSection('network');
            }
          }}
          className="bento-card bento-animate group cursor-pointer lg:col-span-1 lg:row-span-1 px-4 py-2 flex items-center justify-between gap-2 min-h-[78px]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <MiniGlobe accentHex={currentThemeObj.swatchHex} reducedMotion={reducedMotion} />
            <div className="min-w-0">
              <h2 className="font-display text-sm sm:text-base font-bold card-title-accent truncate">
                Network Lab
              </h2>
              <p className="text-[11px] text-zinc-400 truncate">Topology &amp; VLANs</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-title)]" />
        </article>

        {/* 11. MACHINED THEME ACCENT SWITCHER (1 col x 1 row) */}
        <article
          aria-label="Accent color selector"
          className="bento-card bento-animate lg:col-span-1 lg:row-span-1 px-4 py-2.5 flex flex-col justify-center gap-1.5 min-h-[78px]"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Accent Theme</span>
            <span className="text-[var(--accent-title)]">{currentThemeObj.label}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/8 bg-[#090b10] px-3 py-1.5">
            {THEME_OPTIONS.map((option) => {
              const selected = accent === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChangeAccent(option.id);
                    playClickSound(soundEnabled);
                  }}
                  aria-label={`Switch accent theme to ${option.label}`}
                  aria-pressed={selected}
                  title={option.label}
                  className={`h-5 w-5 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    selected
                      ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#090b10]'
                      : 'opacity-80 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{ backgroundColor: option.swatchHex }}
                />
              );
            })}
          </div>
        </article>

        {/* 12. COMPACT SIGNATURE FOOTER CARD (1 col x 1 row) */}
        <article className="bento-card bento-animate lg:col-span-1 lg:row-span-1 px-4 py-3 flex items-center justify-between min-h-[78px]">
          <div className="text-xs">
            <div className="font-display font-semibold text-zinc-200">
              Mac Bobier
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              &copy; 2026 · Philippines
            </div>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">
            React · TS · Laravel API
          </span>
        </article>
      </div>
    </main>
  );
}
