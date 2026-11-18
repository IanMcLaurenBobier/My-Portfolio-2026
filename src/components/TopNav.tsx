interface TopNavProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'network', label: 'Network' },
  { id: 'playground', label: 'Playground' },
];

export function TopNav({ onNavigate }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090b]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('overview');
          }}
          className="font-display text-lg font-bold tracking-tight text-zinc-100 whitespace-nowrap shrink-0 transition-colors hover:text-[var(--accent-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        >
          Mac Bobier
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.id);
              }}
              className="text-sm font-medium text-zinc-400 whitespace-nowrap shrink-0 transition-colors hover:text-zinc-100 hover:underline hover:decoration-[var(--accent)] hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center shrink-0">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact');
            }}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] px-4 py-2 text-xs font-semibold text-zinc-100 whitespace-nowrap shrink-0 transition-all hover:bg-[var(--accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
