import { ExternalLink, Github, X } from 'lucide-react';
import { useEffect } from 'react';
import type { ProjectItem } from '../types/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--accent-border)] bg-[#121217] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#121217]/95 px-6 py-4">
          <div className="text-xs font-mono text-[var(--accent-bright)]">
            {project.category} Project · {project.year}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a21] text-zinc-300 transition-colors hover:border-[var(--accent-border)] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {project.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0e]">
              <img
                src={project.imageUrl}
                alt={`${project.title} interface`}
                referrerPolicy="no-referrer"
                className="max-h-72 w-full object-cover"
              />
            </div>
          )}

          <div>
            <h3 id="project-modal-title" className="font-display text-2xl font-bold text-zinc-50">
              {project.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--accent-bright)]">{project.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{project.summary}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#17171d] p-4">
              <h4 className="font-display text-sm font-bold text-zinc-100">System Architecture</h4>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">{project.architectureNotes}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#17171d] p-4">
              <h4 className="font-display text-sm font-bold text-zinc-100">Key Capabilities</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
                {project.features.map((feat) => (
                  <li key={feat}>· {feat}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-zinc-400 mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/12 bg-[#1a1a21] px-3 py-1 text-xs font-mono text-zinc-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <span>Open Live Demonstration</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#1a1a21] px-4 py-2 text-xs font-semibold text-zinc-100 hover:border-[var(--accent-border)]"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>View Repository</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#17171d] px-3.5 py-2 text-xs text-zinc-400">
                  <Github className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{project.repoPlaceholder || 'Repository URL placeholder'}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
