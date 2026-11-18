import { Building2, GraduationCap, MonitorCheck, Network, Wrench } from 'lucide-react';
import { DOST_FNRI_EXPERIENCE, PERSONAL_PROFILE } from '../data/portfolioData';

export function ExperienceSection() {
  const pillarIcons = [Wrench, Network, MonitorCheck];

  return (
    <section id="experience" className="scroll-reveal py-14 border-t border-white/8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-mono text-[var(--accent-bright)]">Practical Background</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Experience &amp; Education
          </h2>
        </div>
        <div className="text-xs text-zinc-400">
          Software development grounded in real IT support &amp; infrastructure operations
        </div>
      </div>

      {/* DOST-FNRI Main Experience Card */}
      <div className="bento-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-white/8 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent-bright)]">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-zinc-100">
                {DOST_FNRI_EXPERIENCE.role} — {DOST_FNRI_EXPERIENCE.organization}
              </h3>
              <p className="mt-0.5 text-sm text-zinc-300">
                {DOST_FNRI_EXPERIENCE.fullOrganization}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400 max-w-3xl">
                {DOST_FNRI_EXPERIENCE.summary}
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-zinc-400 shrink-0">
            {DOST_FNRI_EXPERIENCE.location}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {DOST_FNRI_EXPERIENCE.pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={pillar.title}
                className="rounded-xl border border-white/8 bg-[#101015] p-5"
              >
                <div className="flex items-center gap-2.5 text-sm font-bold text-zinc-100">
                  <Icon className="h-4 w-4 text-[var(--accent-bright)] shrink-0" />
                  <h4 className="font-display">{pillar.title}</h4>
                </div>
                <ul className="mt-3.5 space-y-2.5 text-xs leading-relaxed text-zinc-300">
                  {pillar.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education Strip */}
      <div className="mt-5 bento-card p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-[#1a1a21] text-[var(--accent-bright)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-zinc-100">
              {PERSONAL_PROFILE.degree}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {PERSONAL_PROFILE.university} · {PERSONAL_PROFILE.location}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-300 whitespace-nowrap">
          Graduation: {PERSONAL_PROFILE.graduation}
        </div>
      </div>
    </section>
  );
}
