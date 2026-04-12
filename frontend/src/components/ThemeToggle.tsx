import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import type { SiteTheme } from '../siteTheme';

type ThemeToggleProps = {
  theme: SiteTheme;
  onChange: (next: SiteTheme) => void;
};

export default function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const day = theme === 'day';

  return (
    <div
      className="relative flex shrink-0 items-center rounded-full p-1"
      style={{
        background: day
          ? 'linear-gradient(145deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))'
          : 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
        border: day ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: day
          ? '0 6px 24px rgba(100,120,160,0.15), inset 0 1px 0 rgba(255,255,255,0.95)'
          : '0 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      }}
      role="group"
      aria-label="Theme"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="pointer-events-none absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full"
        style={{
          left: day ? 'calc(50% + 1px)' : '1px',
          background: day
            ? 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(230,245,242,0.75))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))',
          boxShadow: day
            ? '0 4px 14px rgba(45,180,170,0.25), inset 0 1px 0 rgba(255,255,255,0.9)'
            : '0 4px 12px rgba(120,160,255,0.2), inset 0 1px 0 rgba(255,255,255,0.35)',
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => onChange('night')}
        className="relative z-[1] flex h-8 w-[2.65rem] items-center justify-center rounded-full transition-opacity"
        style={{ color: !day ? '#fff' : 'rgba(55,58,72,0.45)' }}
        aria-pressed={!day}
        aria-label="Night mode"
      >
        <Moon size={15} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => onChange('day')}
        className="relative z-[1] flex h-8 w-[2.65rem] items-center justify-center rounded-full transition-opacity"
        style={{ color: day ? 'rgba(30,90,85,0.92)' : 'rgba(255,255,255,0.45)' }}
        aria-pressed={day}
        aria-label="Day mode"
      >
        <Sun size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}
