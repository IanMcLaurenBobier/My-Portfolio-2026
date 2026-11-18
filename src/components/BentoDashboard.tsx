import { ArrowUpRight, Cpu, Github, Globe, Linkedin, Mail, Network, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DOST_FNRI_EXPERIENCE,
  PERSONAL_PROFILE,
  TECH_BADGES,
  TECH_CATEGORIES,
  THEME_OPTIONS,
} from '../data/portfolioData';
import type { AccentTheme, TechBadgeItem, TechCategory } from '../types/portfolio';
import { playClickSound } from '../utils/sound';
import { TerminalCore3D } from './TerminalCore3D';

interface BentoDashboardProps {
  accent: AccentTheme;
  onChangeAccent: (accent: AccentTheme) => void;
  reducedMotion: boolean;
  soundEnabled: boolean;
  onNavigate: (sectionId: string) => void;
  projectCount: number;
}

const PIXEL_CELLS = [
  { top: '12%', left: '14%', delay: '0s' },
  { top: '24%', left: '72%', delay: '0.6s' },
  { top: '48%', left: '34%', delay: '1.1s' },
  { top: '62%', left: '80%', delay: '0.3s' },
  { top: '76%', left: '22%', delay: '1.5s' },
  { top: '18%', left: '48%', delay: '0.9s' },
  { top: '52%', left: '58%', delay: '1.8s' },
  { top: '80%', left: '66%', delay: '0.4s' },
];

export function BentoDashboard({
  accent,
  onChangeAccent,
  reducedMotion,
  soundEnabled,
  onNavigate,
  projectCount,
}: BentoDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('Programming Languages');
  const [activeTech, setActiveTech] = useState<TechBadgeItem>(TECH_BADGES[0]);
  const [manilaTime, setManilaTime] = useState<string>('');

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === accent) || THEME_OPTIONS[0];

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-PH', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setManilaTime(formatted);
      } catch {
        setManilaTime('UTC+8');
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredTechs = TECH_BADGES.filter((item) => item.category === selectedCategory);

  const handleCategoryChange = (cat: TechCategory) => {
    setSelectedCategory(cat);
    const first = TECH_BADGES.find((t) => t.category === cat);
    if (first) setActiveTech(first);
    playClickSound(soundEnabled);
  };

  return (
    <section id="overview" aria-label="Portfolio Dashboard Overview" className="pt-6 pb-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        {/* 1. Introduction / Profile Card with 3D Centerpiece */}
        <article className="bento-card bento-card-intro bento-animate group md:col-span-6 lg:col-span-7 lg:row-span-2 flex flex-col justify-between p-6 sm:p-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center h-full">
            <div className="lg:col-span-7 flex flex-col justify-between gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>{PERSONAL_PROFILE.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{manilaTime || '--:--:--'} PHT</span>
                  <span aria-hidden="true">·</span>
                  <span>Class of {PERSONAL_PROFILE.graduation}</span>
                </div>

                <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08] [text-wrap:balance]">
                  {PERSONAL_PROFILE.preferredName}
                  <span className="block text-xl sm:text-2xl font-semibold text-zinc-300 mt-1">
                    {PERSONAL_PROFILE.fullName}
                  </span>
                </h1>

                <p className="mt-2 text-sm font-medium text-[var(--accent-bright)]">
                  {PERSONAL_PROFILE.headlineRole}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-zinc-300 max-w-xl">
                  {PERSONAL_PROFILE.introHook}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`mailto:${PERSONAL_PROFILE.contactEmail}`}
                  aria-label="Email Mac Bobier"
                  onClick={() => playClickSound(soundEnabled)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-muted)] px-4 text-xs font-semibold text-zinc-100 whitespace-nowrap shrink-0 transition-all hover:bg-[var(--accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Mail className="h-4 w-4" />
                  <span>Get in Touch</span>
                </a>

                <a
                  href={PERSONAL_PROFILE.githubUrlPlaceholder}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  title="GitHub — IanMcLaurenBobier"
                  onClick={() => playClickSound(soundEnabled)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-border-subtle)] bg-[#1b1b22] text-zinc-300 transition-colors hover:border-[var(--accent-bright)] hover:bg-[var(--accent-muted)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Github className="h-4 w-4" />
                </a>

                <a
                  href={PERSONAL_PROFILE.linkedinUrlPlaceholder}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  title="LinkedIn — Ian Mc Lauren Bobier"
                  onClick={() => playClickSound(soundEnabled)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-border-subtle)] bg-[#1b1b22] text-zinc-300 transition-colors hover:border-[var(--accent-bright)] hover:bg-[var(--accent-muted)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Linkedin className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    onNavigate('projects');
                  }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-[#1a1a21] px-3.5 text-xs font-medium text-zinc-200 whitespace-nowrap shrink-0 transition-colors hover:border-[var(--accent-border)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-[270px] sm:h-[310px] lg:h-[340px] rounded-xl border border-white/5 bg-[#0c0c10]/80 overflow-hidden">
              <TerminalCore3D accentColorHex={currentThemeObj.threeColor} reducedMotion={reducedMotion} />
            </div>
          </div>
        </article>

        {/* 2. About Me Card */}
        <article className="bento-card bento-animate group md:col-span-3 lg:col-span-5 p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-zinc-100">About Me</h2>
              <span className="text-xs font-mono text-zinc-400">Philippines</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {PERSONAL_PROFILE.aboutSummary}
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
              {PERSONAL_PROFILE.aboutSecondary}
            </p>
          </div>

          <div className="pt-3 border-t border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="font-medium text-zinc-200">{PERSONAL_PROFILE.degree}</span>
            <span>
              {PERSONAL_PROFILE.university} · {PERSONAL_PROFILE.graduation}
            </span>
          </div>
        </article>

        {/* 3. Theme Selector & Quick Navigation Card */}
        <article className="bento-card bento-animate group md:col-span-3 lg:col-span-5 p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-zinc-100">Accent Theme</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Switch workspace accent across borders, patterns, and 3D core lighting.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--accent-bright)] whitespace-nowrap shrink-0">
              {currentThemeObj.label}
            </span>
          </div>

          <div className="flex items-center gap-3" role="group" aria-label="Dashboard accent color selector">
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
                  aria-label={`Select ${option.label} accent`}
                  aria-pressed={selected}
                  className={`h-8 w-8 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    selected
                      ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#141419]'
                      : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: option.swatchHex }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onNavigate('network');
              }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1a1a21] px-3.5 py-2.5 text-xs font-medium text-zinc-200 whitespace-nowrap transition-colors hover:border-[var(--accent-border)] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Network className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
                <span>Topology Lab</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onNavigate('playground');
              }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1a1a21] px-3.5 py-2.5 text-xs font-medium text-zinc-200 whitespace-nowrap transition-colors hover:border-[var(--accent-border)] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
                <span>Playground</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
        </article>

        {/* 4. Technology Stack & Tools Card (with outlined dot pattern + independent badge hover) */}
        <article className="bento-card bento-animate group md:col-span-6 lg:col-span-7 p-6 flex flex-col justify-between gap-4">
          <div className="pattern-dots dots-animate pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-zinc-100">Stack &amp; Tools</h2>
                <p className="text-xs text-zinc-400">
                  Hover or select any technology to inspect hands-on context.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-400">{TECH_BADGES.length} capabilities</span>
            </div>

            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Technology categories">
              {TECH_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      active
                        ? 'bg-[var(--accent-muted)] text-white border border-[var(--accent-border)]'
                        : 'bg-[#1a1a21]/90 text-zinc-400 border border-white/8 hover:text-zinc-200 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 py-1">
              {filteredTechs.map((tech) => {
                const isSelected = activeTech.id === tech.id;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onMouseEnter={() => setActiveTech(tech)}
                    onFocus={() => setActiveTech(tech)}
                    onClick={() => {
                      setActiveTech(tech);
                      playClickSound(soundEnabled);
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isSelected
                        ? 'border-[var(--accent-bright)] bg-[var(--accent-muted)] text-white'
                        : 'border-white/12 bg-[#1a1a21]/90 text-zinc-300 hover:border-[var(--accent-bright)] hover:bg-[var(--accent-muted)] hover:text-white'
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 rounded-xl border border-white/10 bg-[#0d0d11]/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-zinc-100">{activeTech.name}</span>
                <span aria-hidden="true" className="text-zinc-500">·</span>
                <span className="font-mono text-[var(--accent-bright)]">{activeTech.tier}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">{activeTech.summary}</p>
            </div>
          </div>
        </article>

        {/* 5. Featured Projects Collage Card */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onNavigate('projects');
          }}
          className="bento-card bento-animate group cursor-pointer md:col-span-6 lg:col-span-5 min-h-[260px] p-6 flex flex-col justify-end"
        >
          {/* Collage images positioned behind title */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src="/src/assets/images/dpmis_lite_preview.png"
              alt="DPMIS Lite interface preview"
              referrerPolicy="no-referrer"
              className="absolute -right-6 -top-4 h-44 w-64 rounded-lg object-cover opacity-55 rotate-3 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
            />
            <img
              src="/src/assets/images/hyperdiasense_preview.png"
              alt="HyperDiaSense interface preview"
              referrerPolicy="no-referrer"
              className="absolute left-6 top-6 h-40 w-60 rounded-lg object-cover opacity-45 -rotate-3 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1"
            />
            <img
              src="/src/assets/images/project_lapse_time_1795013815002.jpg"
              alt="Lapse Through Time interface preview"
              referrerPolicy="no-referrer"
              className="absolute right-10 bottom-10 h-36 w-52 rounded-lg object-cover opacity-35 rotate-2 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/82 to-[#09090b]/45" />
          </div>

          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[var(--accent-bright)]">
                {projectCount} Systems &amp; Prototypes
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-zinc-50">
                Featured Works &amp; Case Studies
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-300 max-w-sm">
                DPMIS Lite, HyperDiaSense AI nutrition analyzer, Lapse Through Time, and academic builds.
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-muted)] text-white transition-colors group-hover:bg-[var(--accent)]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </article>

        {/* 6. Networking & Infrastructure Card (diagonal pattern) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onNavigate('network');
          }}
          className="bento-card bento-animate group cursor-pointer md:col-span-2 lg:col-span-4 p-6 flex flex-col justify-between gap-4"
        >
          <div className="pattern-diagonal pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[var(--accent-bright)]">Infrastructure</div>
              <h2 className="mt-1 font-display text-lg font-bold text-zinc-100">
                Networking &amp; Systems
              </h2>
            </div>
            <Globe className="h-5 w-5 text-[var(--accent-bright)] shrink-0" />
          </div>

          <div className="relative z-10 overflow-hidden rounded-xl border border-white/10 h-24 bg-[#0d0d11]">
            <img
              src="/src/assets/images/project_network_lab_1795013815610.jpg"
              alt="Enterprise rack switch and router cabling"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-75 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/85 via-transparent to-transparent" />
          </div>

          <p className="relative z-10 text-xs leading-relaxed text-zinc-300">
            Event router configuration at DOST-FNRI, endpoint setup, and an interactive office topology demonstration.
          </p>
        </article>

        {/* 7. Work Experience Card (circuit pattern) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onNavigate('experience');
          }}
          className="bento-card bento-animate group cursor-pointer md:col-span-2 lg:col-span-4 p-6 flex flex-col justify-between gap-4"
        >
          <div className="pattern-circuit pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[var(--accent-bright)]">
                {DOST_FNRI_EXPERIENCE.organization}
              </div>
              <h2 className="mt-1 font-display text-lg font-bold text-zinc-100">
                {DOST_FNRI_EXPERIENCE.role}
              </h2>
            </div>
            <Cpu className="h-5 w-5 text-[var(--accent-bright)] shrink-0" />
          </div>

          <ul className="relative z-10 space-y-1.5 text-xs text-zinc-300">
            <li>· Hardware diagnostics, PC build &amp; AIO setup</li>
            <li>· Agency event router setup &amp; peripheral ops</li>
            <li>· IFNRI web frontend redesign (Figma, Docker, Git)</li>
          </ul>

          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/8 text-xs text-zinc-400">
            <span>IT Support · Web Dev · Infra</span>
            <span className="text-[var(--accent-bright)] font-medium">Read details →</span>
          </div>
        </article>

        {/* 8. Playground / Experiments Card (animated pixel-grid clipped inside card) */}
        <article
          onClick={() => {
            playClickSound(soundEnabled);
            onNavigate('playground');
          }}
          className="bento-card bento-animate group cursor-pointer md:col-span-2 lg:col-span-4 p-6 flex flex-col justify-between gap-4"
        >
          <div className="pattern-pixel-grid pointer-events-none absolute inset-0" aria-hidden="true">
            {PIXEL_CELLS.map((cell, idx) => (
              <span
                key={idx}
                className="pixel-block pixel-animate absolute h-5 w-5 rounded-[3px]"
                style={{ top: cell.top, left: cell.left, animationDelay: cell.delay }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[var(--accent-bright)]">Interactive Workspace</div>
              <h2 className="mt-1 font-display text-lg font-bold text-zinc-100">
                Developer Playground
              </h2>
            </div>
            <Terminal className="h-5 w-5 text-[var(--accent-bright)] shrink-0" />
          </div>

          <div className="relative z-10 rounded-xl border border-white/10 bg-[#0b0b0f]/92 p-3 font-mono text-[11px] text-zinc-300">
            <div>
              <span className="text-[var(--accent-bright)]">mac@lab</span>:~$ ping 192.168.10.1
            </div>
            <div className="text-zinc-500 mt-0.5">
              64 bytes from gateway: time=1.4 ms
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400">
            <span>Terminal · Live API · Pattern Lab</span>
            <span className="text-[var(--accent-bright)] font-medium">Open lab →</span>
          </div>
        </article>
      </div>
    </section>
  );
}
