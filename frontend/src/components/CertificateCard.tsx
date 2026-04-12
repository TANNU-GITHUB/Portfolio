import { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import type { SiteTheme } from '../siteTheme';

export type CertificateCardProps = {
  index: number;
  id: string;
  title: string;
  /** Optional image URL; when omitted, a glass placeholder panel is shown */
  image?: string;
  theme: SiteTheme;
};

/** Vertical offset between stacked tiles (~4–5% of card height → strong overlap) */
const PEEK_PER_INDEX_VH = 3.35;

export default function CertificateCard({ index, id, title, image, theme }: CertificateCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const d = theme === 'day';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.42, 0.82, 1], [1, 1, 0.965, 0.915]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.42, 0.82, 1], [0, 0, 0.22, 0.55]);
  const borderAlpha = useTransform(scrollYProgress, [0, 0.42, 0.82, 1], [0.22, 0.22, 0.14, 0.08]);
  const tileLift = useTransform(scrollYProgress, [0, 0.42, 0.82, 1], [0, 0, -2, -6]);

  /** Alternating horizontal “push” handoff as the next sticky card takes over */
  const pushDir = index % 2 === 0 ? -1 : 1;
  const entryX = index === 0 ? 0 : pushDir * 72;
  const entryRot = index === 0 ? 0 : pushDir * 2.4;
  const pushX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.4, 0.58, 0.78, 1],
    [entryX, 0, 0, pushDir * 36, pushDir * 92, pushDir * 128]
  );
  const pushRotate = useTransform(
    scrollYProgress,
    [0, 0.16, 0.4, 0.58, 0.78, 1],
    [entryRot, 0, 0, pushDir * -1.4, pushDir * -2.6, pushDir * -3.4]
  );

  const numberLabel = String(index + 1).padStart(2, '0');
  const stickyTop = `calc(11vh + ${index * PEEK_PER_INDEX_VH}vh)`;
  const borderColor = useMotionTemplate`rgba(255,255,255,${borderAlpha})`;

  return (
    <div ref={sectionRef} className="relative min-h-[130vh] w-full max-w-lg md:max-w-xl mx-auto px-3 sm:px-4">
      <div
        className="sticky w-full max-h-[min(84vh,calc(100dvh-4.5rem))] rounded-[1.35rem] overflow-visible will-change-transform flex flex-col isolate"
        style={{
          top: stickyTop,
          zIndex: 20 + index * 2,
        }}
      >
        <motion.article
          className="w-full max-h-[min(84vh,calc(100dvh-4.5rem))] rounded-[1.35rem] overflow-hidden will-change-transform flex flex-col isolate"
          style={{
            transformOrigin: 'top center',
            scale,
            x: pushX,
            rotateZ: pushRotate,
            y: tileLift,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor,
            background: d
              ? 'linear-gradient(165deg, rgba(255,255,255,0.82) 0%, rgba(255,252,248,0.48) 42%, rgba(220,238,234,0.42) 100%)'
              : 'linear-gradient(165deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 42%, rgba(12,18,32,0.65) 100%)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            boxShadow: d
              ? `
              0 0 0 1px rgba(255,255,255,0.65) inset,
              0 1px 0 rgba(255,255,255,0.95) inset,
              0 -12px 36px rgba(100,120,130,0.08) inset,
              0 ${20 + index * 4}px ${48 + index * 8}px rgba(70,100,110,${0.1 + index * 0.02})
            `
              : `
              0 0 0 1px rgba(255,255,255,0.06) inset,
              0 1px 0 rgba(255,255,255,0.22) inset,
              0 -18px 48px rgba(0,0,0,0.35) inset,
              0 ${28 + index * 6}px ${64 + index * 10}px rgba(0,0,0,${0.38 + index * 0.04})
            `,
          }}
        >
          {/* Specular + frost overlay (glass tile read) */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[1.35rem] opacity-90"
            style={{
              background: d
                ? 'linear-gradient(115deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 22%, transparent 48%, transparent 62%, rgba(180,200,255,0.12) 100%)'
                : 'linear-gradient(115deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 22%, transparent 48%, transparent 62%, rgba(120,170,255,0.06) 100%)',
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-px rounded-[1.2rem] border border-white/[0.07]"
            style={{ boxShadow: d ? 'inset 0 0 0 1px rgba(255,255,255,0.35)' : 'inset 0 0 0 1px rgba(0,0,0,0.25)' }}
            aria-hidden
          />

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[1.35rem]"
            style={{ opacity: overlayOpacity, background: d ? '#e8f0ee' : '#03060f' }}
            aria-hidden
          />

          <div className="relative p-5 sm:p-7 flex flex-col gap-5 min-h-0 flex-1">
            <div className="flex items-start justify-between gap-4 flex-shrink-0">
              <span
                className="text-5xl sm:text-6xl font-extralight tabular-nums leading-none tracking-tight select-none"
                style={{
                  color: d ? 'rgba(55,58,72,0.2)' : 'rgba(255,255,255,0.14)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  textShadow: d ? '0 0 24px rgba(100, 170, 200, 0.2)' : '0 0 32px rgba(160, 210, 255, 0.2)',
                }}
              >
                {numberLabel}
              </span>
              <div className="text-right space-y-1 min-w-0 flex-1">
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.38em] font-medium"
                  style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}
                >
                  Credential
                </p>
                <h3
                  className="text-base sm:text-lg font-light tracking-wide text-right break-words"
                  style={{ color: d ? 'rgba(32,36,48,0.92)' : 'rgba(255,255,255,0.94)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-[10px] sm:text-xs font-mono tracking-wider"
                  style={{ color: d ? 'rgba(55,58,72,0.38)' : 'rgba(255,255,255,0.28)' }}
                >
                  {id}
                </p>
              </div>
            </div>

            {/* Inner glass frame — certificate preview as a second tile */}
            <div
              className="relative w-full flex-1 min-h-[11rem] rounded-xl overflow-hidden flex items-center justify-center"
              style={{
                aspectRatio: '4 / 3',
                maxHeight: 'min(48vh, 100%)',
                background: d
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(230,242,240,0.35) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(6,10,20,0.55) 100%)',
                border: d ? '1px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.12)',
                boxShadow: d
                  ? `
                  inset 0 1px 0 rgba(255,255,255,0.85),
                  inset 0 -12px 32px rgba(100,120,130,0.08),
                  0 12px 32px rgba(70,100,110,0.1)
                `
                  : `
                  inset 0 1px 0 rgba(255,255,255,0.2),
                  inset 0 -24px 48px rgba(0,0,0,0.35),
                  0 12px 32px rgba(0,0,0,0.25)
                `,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                  background: d
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 35%, transparent 70%, rgba(80,100,110,0.08) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.25) 100%)',
                }}
                aria-hidden
              />
              {image ? (
                <img
                  src={image}
                  alt={`Certificate: ${title}`}
                  className="absolute inset-0 z-[1] w-full h-full object-cover opacity-[0.92]"
                  loading={index > 0 ? 'lazy' : 'eager'}
                />
              ) : (
                <div
                  className="relative z-[1] flex flex-col items-center justify-center gap-2 px-6 text-center"
                  style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.38)' }}
                >
                  <span className="text-[10px] uppercase tracking-[0.45em]">Certificate</span>
                  <span className="text-xs font-mono tracking-widest" style={{ color: d ? 'rgba(55,58,72,0.35)' : 'rgba(255,255,255,0.22)' }}>
                    IMAGE PLACEHOLDER
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}