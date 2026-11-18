import { ArrowLeft, X } from 'lucide-react';
import { useEffect } from 'react';
import type { OverlaySection } from './BentoHomepage';

interface SectionOverlayModalProps {
  activeSection: OverlaySection;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SectionOverlayModal({
  activeSection,
  onClose,
  title,
  children,
}: SectionOverlayModalProps) {
  useEffect(() => {
    if (!activeSection) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSection, onClose]);

  if (!activeSection) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-[#060608]/95 backdrop-blur-md overflow-y-auto"
    >
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#09090d]/95">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <h2 className="font-display text-sm sm:text-base font-bold accent-heading-glow">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close view"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-[#141419] text-zinc-300 hover:border-[var(--accent-bright)] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-6">
        {children}
      </div>
    </div>
  );
}
