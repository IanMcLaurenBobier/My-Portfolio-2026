import gsap from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AdminModal } from './components/AdminModal';
import { BentoHomepage, type OverlaySection } from './components/BentoHomepage';
import { ContactSection } from './components/ContactSection';
import { ExperienceSection } from './components/ExperienceSection';
import { NetworkTopologySection } from './components/NetworkTopologySection';
import { PlaygroundSection } from './components/PlaygroundSection';
import { ProjectModal } from './components/ProjectModal';
import { ProjectsSection } from './components/ProjectsSection';
import { SectionOverlayModal } from './components/SectionOverlayModal';
import { UtilityToolbar } from './components/UtilityToolbar';
import { INITIAL_PROJECTS } from './data/portfolioData';
import type { AccentTheme, ProjectItem } from './types/portfolio';
import { apiUrl } from './utils/api';

const SECTION_TITLES: Record<Exclude<OverlaySection, null>, string> = {
  projects: 'Projects & Case Studies',
  experience: 'DOST-FNRI Experience & Education',
  network: 'Networking & Infrastructure Lab',
  playground: 'Developer Playground',
  about: 'About Ian Mc Lauren "Mac" Bobier',
  contact: 'Contact & Inquiry',
  admin: 'Portfolio Admin',
};

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [accent, setAccent] = useState<AccentTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('mac_portfolio_accent') as AccentTheme | null;
      if (saved && ['red', 'blue', 'purple', 'green', 'orange'].includes(saved)) {
        return saved;
      }
    }
    return 'red';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeOverlay, setActiveOverlay] = useState<OverlaySection>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/projects'));
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setProjects(json.data);
        }
      }
    } catch {
      // Keep seeded projects
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    window.localStorage.setItem('mac_portfolio_accent', accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'standard');
  }, [highContrast]);

  // Fast staggered card entrance on initial load
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.bento-animate', {
        y: 12,
        opacity: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleOpenSection = (section: OverlaySection) => {
    setActiveOverlay(section);
  };

  return (
    <div
      ref={containerRef}
      className="bg-canvas-grid min-h-screen lg:h-screen lg:overflow-hidden text-[var(--text-primary)]"
    >
      <BentoHomepage
        accent={accent}
        onChangeAccent={setAccent}
        reducedMotion={reducedMotion}
        soundEnabled={soundEnabled}
        onOpenSection={handleOpenSection}
      />

      <UtilityToolbar
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Interactive Section Overlay Views (keeping homepage 100vh non-scrollable) */}
      <SectionOverlayModal
        activeSection={activeOverlay && activeOverlay !== 'admin' ? activeOverlay : null}
        onClose={() => setActiveOverlay(null)}
        title={activeOverlay && activeOverlay !== 'admin' ? SECTION_TITLES[activeOverlay] : ''}
      >
        {activeOverlay === 'projects' && (
          <ProjectsSection
            projects={projects}
            onSelectProject={setSelectedProject}
            onOpenAdmin={() => setActiveOverlay('admin')}
            soundEnabled={soundEnabled}
          />
        )}
        {activeOverlay === 'experience' && <ExperienceSection />}
        {activeOverlay === 'network' && (
          <NetworkTopologySection reducedMotion={reducedMotion} soundEnabled={soundEnabled} />
        )}
        {activeOverlay === 'playground' && (
          <PlaygroundSection onChangeAccent={setAccent} soundEnabled={soundEnabled} />
        )}
        {activeOverlay === 'about' && <AboutSection />}
        {activeOverlay === 'contact' && <ContactSection soundEnabled={soundEnabled} />}
      </SectionOverlayModal>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AdminModal
        open={activeOverlay === 'admin'}
        onClose={() => setActiveOverlay(null)}
        projects={projects}
        onProjectsUpdated={fetchProjects}
      />
    </div>
  );
}
