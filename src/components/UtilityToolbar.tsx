import { Contrast, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface UtilityToolbarProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function UtilityToolbar({
  reducedMotion,
  onToggleReducedMotion,
  highContrast,
  onToggleHighContrast,
  soundEnabled,
  onToggleSound,
}: UtilityToolbarProps) {
  return (
    <aside
      aria-label="Accessibility and sound controls"
      className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-2"
    >
      <button
        type="button"
        onClick={() => {
          onToggleHighContrast();
          playClickSound(soundEnabled);
        }}
        aria-pressed={highContrast}
        title={highContrast ? 'Standard contrast mode' : 'High contrast mode'}
        aria-label="Toggle high contrast mode"
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          highContrast
            ? 'border-[var(--accent-bright)] bg-[var(--accent-muted)] text-white'
            : 'border-[var(--accent-border)] bg-[#0c0c10]/95 text-zinc-300 hover:border-[var(--accent-bright)] hover:text-white'
        }`}
      >
        <Contrast className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          onToggleReducedMotion();
          playClickSound(soundEnabled);
        }}
        aria-pressed={reducedMotion}
        title={reducedMotion ? 'Motion reduced (click to enable)' : 'Reduce animations'}
        aria-label="Toggle reduced motion"
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          reducedMotion
            ? 'border-[var(--accent-bright)] bg-[var(--accent-muted)] text-white'
            : 'border-white/15 bg-[#0c0c10]/95 text-zinc-300 hover:border-[var(--accent-bright)] hover:text-white'
        }`}
      >
        <EyeOff className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onToggleSound}
        aria-pressed={soundEnabled}
        title={soundEnabled ? 'Mute UI sound effects' : 'Enable UI sound effects'}
        aria-label="Toggle UI sound effects"
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          soundEnabled
            ? 'border-[var(--accent-bright)] bg-[var(--accent-muted)] text-white'
            : 'border-white/15 bg-[#0c0c10]/95 text-zinc-300 hover:border-[var(--accent-bright)] hover:text-white'
        }`}
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </aside>
  );
}
