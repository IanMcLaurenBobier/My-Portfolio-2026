import { ArrowUpRight, ExternalLink, FolderKanban, Plus } from 'lucide-react';
import { useState } from 'react';
import type { ProjectItem } from '../types/portfolio';
import { playClickSound } from '../utils/sound';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenAdmin: () => void;
  soundEnabled: boolean;
}

export function ProjectsSection({
  projects,
  onSelectProject,
  onOpenAdmin,
  soundEnabled,
}: ProjectsSectionProps) {
  const [filter, setFilter] = useState<'All' | 'Featured' | 'Additional'>('All');

  const featuredProjects = projects.filter((p) => p.category === 'Featured');
  const additionalProjects = projects.filter((p) => p.category === 'Additional');

  const showFeatured = filter === 'All' || filter === 'Featured';
  const showAdditional = filter === 'All' || filter === 'Additional';

  return (
    <section id="projects" className="scroll-reveal py-14 border-t border-white/8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-[var(--accent-bright)]">Software &amp; Systems</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 [text-wrap:balance]">
            Projects &amp; Prototypes
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            Production-oriented prototypes and academic software demonstrating workflow architecture, database integration, AI-assisted analysis, and responsive UI engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#121217] p-1">
            {(['All', 'Featured', 'Additional'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setFilter(tab);
                  playClickSound(soundEnabled);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  filter === tab
                    ? 'bg-[var(--accent-muted)] text-white border border-[var(--accent-border)]'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenAdmin();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#16161b] px-3.5 py-2 text-xs font-medium text-zinc-200 whitespace-nowrap shrink-0 transition-colors hover:border-[var(--accent-border)] hover:text-white"
          >
            <Plus className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      {showFeatured && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className="bento-card group flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#0e0e13] border-b border-white/8">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} preview`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center pattern-mesh">
                      <FolderKanban className="h-8 w-8 text-[var(--accent-bright)]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span>{project.domain}</span>
                    <span className="font-mono tabular-nums">{project.year}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-zinc-100 group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-[var(--accent-bright)]">
                    {project.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {project.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-[#1c1c23] px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/8 px-5 py-3.5 bg-[#101015]">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    onSelectProject(project);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200 whitespace-nowrap transition-colors hover:text-[var(--accent-bright)]"
                >
                  <span>Case Study &amp; Architecture</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound(soundEnabled)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[var(--accent)]"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-500">Prototype</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {showAdditional && (
        <div className={showFeatured ? 'mt-8' : ''}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-zinc-200">
              Additional Projects &amp; Academic Builds
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              {additionalProjects.length} entries
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {additionalProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onSelectProject(project);
                }}
                className="bento-card group cursor-pointer p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span>{project.domain}</span>
                    <span className="font-mono tabular-nums">{project.year}</span>
                  </div>
                  <h4 className="mt-2 font-display text-base font-bold text-zinc-100 group-hover:text-[var(--accent-bright)] transition-colors">
                    {project.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {project.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/8">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/10 bg-[#1a1a21] px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-[var(--accent-bright)] transition-colors" />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
