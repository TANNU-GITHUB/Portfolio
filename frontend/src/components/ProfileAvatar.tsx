import { motion } from 'framer-motion';
import { useId } from 'react';
import type { ImgHTMLAttributes } from 'react';

type ProfileAvatarProps = {
  src: string;
  alt: string;
  className?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

/** Centered circular portrait + SVG neon ring traced around the edge */
export default function ProfileAvatar({ src, alt, className = '', ...imgProps }: ProfileAvatarProps) {
  const gradId = `neon-ring-${useId().replace(/:/g, '')}`;

  return (
    <div className="avatar-3d-root mx-auto w-fit shrink-0">
      <motion.div
        className="avatar-3d-tilt"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: [0, 5.5, -4, 3.5, 0],
          rotateX: [0, -3.5, 2.5, -2, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="avatar-neon-frame relative aspect-square w-[clamp(7.75rem,33vw,12rem)] sm:w-[clamp(8.75rem,29vw,13rem)]">
          <svg
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00fff0" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#ff2d95" />
              </linearGradient>
            </defs>
            <circle
              className="avatar-ring-path"
              cx="50"
              cy="50"
              r="47.25"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="2.4"
              strokeLinecap="round"
              pathLength={1}
            />
          </svg>
          <div className="avatar-3d-inner absolute inset-[2px] z-[1] overflow-hidden rounded-full bg-[#050508]">
            <img
              src={src}
              alt={alt}
              className={`avatar-3d-img h-full w-full rounded-full object-cover object-top ${className}`}
              draggable={false}
              {...imgProps}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
