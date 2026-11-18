import { Code2, Cpu, GraduationCap, Network } from 'lucide-react';
import { PERSONAL_PROFILE, TECH_BADGES, TECH_CATEGORIES } from '../data/portfolioData';

export function AboutSection() {
  return (
    <div className="space-y-8">
      <div className="bento-card p-6 sm:p-8 space-y-4">
        <div className="text-xs font-mono text-[var(--accent-bright)]">Profile &amp; Focus</div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-zinc-50">
          {PERSONAL_PROFILE.fullName} ({PERSONAL_PROFILE.preferredName})
        </h3>
        <p className="text-sm font-medium text-[var(--accent-title)]">
          {PERSONAL_PROFILE.headlineRole}
        </p>
        <p className="text-sm leading-relaxed text-zinc-300 max-w-3xl">
          {PERSONAL_PROFILE.aboutSummary}
        </p>
        <p className="text-sm leading-relaxed text-zinc-400 max-w-3xl">
          {PERSONAL_PROFILE.aboutSecondary}
        </p>

        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/10 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#101015] p-4">
            <Code2 className="h-4 w-4 text-[var(--accent-bright)]" />
            <h4 className="mt-2 font-display text-sm font-bold text-zinc-100">Software Development</h4>
            <p className="mt-1 text-xs text-zinc-400">
              Full-stack web prototypes, database workflows, REST APIs, and responsive UI engineering.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#101015] p-4">
            <Cpu className="h-4 w-4 text-[var(--accent-bright)]" />
            <h4 className="mt-2 font-display text-sm font-bold text-zinc-100">IT Operations</h4>
            <p className="mt-1 text-xs text-zinc-400">
              Desktop hardware troubleshooting, PC builds from recovered parts, AIO setup, M365 &amp; Workspace support.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#101015] p-4">
            <Network className="h-4 w-4 text-[var(--accent-bright)]" />
            <h4 className="mt-2 font-display text-sm font-bold text-zinc-100">Networking &amp; AI</h4>
            <p className="mt-1 text-xs text-zinc-400">
              Event router setup exposure, VLAN/subnet topology exploration, and AI-assisted web tooling.
            </p>
          </div>
        </div>
      </div>

      <div className="bento-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent-bright)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-zinc-100">{PERSONAL_PROFILE.degree}</h4>
            <p className="text-xs text-zinc-400">{PERSONAL_PROFILE.university} · {PERSONAL_PROFILE.location}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-zinc-300">Graduation: {PERSONAL_PROFILE.graduation}</span>
      </div>

      <div className="bento-card p-6 space-y-5">
        <div>
          <h4 className="font-display text-lg font-bold text-zinc-100">Complete Capability Matrix</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Organized honestly by project usage, hands-on experience, and technical interest.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TECH_CATEGORIES.map((category) => {
            const items = TECH_BADGES.filter((b) => b.category === category);
            return (
              <div key={category} className="rounded-xl border border-white/10 bg-[#101015] p-4 space-y-2.5">
                <h5 className="text-xs font-semibold tracking-wide text-[var(--accent-title)]">{category}</h5>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-100">{item.name}</span>
                        <span className="font-mono text-[11px] text-zinc-400">{item.tier}</span>
                      </div>
                      <p className="text-zinc-400 mt-0.5">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
