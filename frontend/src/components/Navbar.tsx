import ThemeToggle from './ThemeToggle';
import type { SiteTheme } from '../siteTheme';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  theme: SiteTheme;
  onThemeChange: (t: SiteTheme) => void;
}

const navItems = [
  { label: 'Home', page: 'home', accent: '#94c5ff', glow: 'rgba(148, 197, 255, 0.45)' },
  { label: 'About Me', page: 'about', accent: '#f0a8d8', glow: 'rgba(240, 168, 216, 0.4)' },
  { label: 'Skills', page: 'skills', accent: '#5ee7df', glow: 'rgba(94, 231, 223, 0.4)' },
  { label: 'Projects', page: 'projects', accent: '#86f0b4', glow: 'rgba(134, 240, 180, 0.38)' },
  { label: 'Education', page: 'education', accent: '#fcd28a', glow: 'rgba(252, 210, 138, 0.4)' },
  { label: 'Certifications', page: 'certifications', accent: '#ffa8c8', glow: 'rgba(255, 168, 200, 0.38)' },
  { label: 'Contact', page: 'contact', accent: '#c4b5fd', glow: 'rgba(196, 181, 253, 0.42)' },
];

export default function Navbar({ activePage, onNavigate, theme, onThemeChange }: NavbarProps) {
  const day = theme === 'day';

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-2 py-3 sm:px-4 sm:py-4">
      <div
        className="liquid-glass-bar flex max-w-[min(100%,1200px)] flex-wrap items-center justify-center gap-1.5 rounded-full px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5"
        style={{
          background: day
            ? `linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,252,248,0.42) 45%, rgba(220,240,236,0.38) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 45%, rgba(200,220,255,0.06) 100%)`,
          backdropFilter: 'blur(22px) saturate(1.35)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
          border: day ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.22)',
          boxShadow: day
            ? `0 10px 40px rgba(80,100,130,0.12), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(180,190,200,0.15) inset`
            : `
            0 8px 32px rgba(0,0,0,0.45),
            0 1px 0 rgba(255,255,255,0.35) inset,
            0 -1px 0 rgba(0,0,0,0.2) inset,
            0 0 0 1px rgba(255,255,255,0.05),
            0 24px 48px -12px rgba(120, 160, 255, 0.15)
          `,
        }}
      >
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              type="button"
              onClick={() => onNavigate(item.page)}
              className="group liquid-glass-pill relative cursor-pointer overflow-hidden rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm"
              style={{
                background: isActive
                  ? day
                    ? `linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.55))`
                    : `linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))`
                  : day
                    ? `linear-gradient(160deg, rgba(255,255,255,0.45), rgba(255,255,255,0.2))`
                    : `linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))`,
                border: isActive
                  ? day
                    ? `1px solid rgba(255,255,255,0.85)`
                    : `1px solid rgba(255,255,255,0.35)`
                  : day
                    ? '1px solid rgba(255,255,255,0.5)'
                    : '1px solid rgba(255,255,255,0.14)',
                boxShadow: isActive
                  ? day
                    ? `
                    0 0 0 1px rgba(255,255,255,0.5),
                    0 6px 20px ${item.glow},
                    0 12px 28px -8px rgba(60,80,100,0.12),
                    inset 0 2px 0 rgba(255,255,255,0.95),
                    inset 0 -1px 0 rgba(180,190,200,0.2)
                  `
                    : `
                    0 0 0 1px rgba(255,255,255,0.1),
                    0 4px 16px ${item.glow},
                    0 12px 28px -8px rgba(0,0,0,0.5),
                    inset 0 2px 0 rgba(255,255,255,0.25),
                    inset 0 -1px 0 rgba(0,0,0,0.15)
                  `
                  : day
                    ? `inset 0 1px 0 rgba(255,255,255,0.75), 0 2px 10px rgba(80,100,120,0.08)`
                    : `
                    inset 0 1px 0 rgba(255,255,255,0.12),
                    0 2px 8px rgba(0,0,0,0.25)
                  `,
                color: isActive ? (day ? 'rgba(32,34,48,0.95)' : '#ffffff') : day ? 'rgba(55,58,72,0.72)' : 'rgba(255,255,255,0.72)',
                textShadow: isActive && !day ? `0 0 20px ${item.accent}88` : 'none',
                minWidth: 'max-content',
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${item.accent}33, transparent 55%)`,
                }}
              />
              <span className="relative z-10 whitespace-nowrap tracking-wide">{item.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-1 left-1/2 h-px w-1/2 max-w-[70%] -translate-x-1/2 rounded-full opacity-90"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                    boxShadow: `0 0 12px ${item.accent}`,
                  }}
                />
              )}
            </button>
          );
        })}
        <div className="ml-1 flex shrink-0 items-center pl-1 sm:ml-2 sm:pl-2" style={{ borderLeft: day ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.12)' }}>
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>
      </div>
    </nav>
  );
}
