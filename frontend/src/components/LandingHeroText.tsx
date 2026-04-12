import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const FULL_NAME = 'TANNU BAGADIA';
const SUBTITLE = 'AI WEB DEVELOPER';

/** ~1.8s calm, ~0.2s RGB slice burst, repeat every 2s (matches CSS pseudo timing) */
const GLITCH_CYCLE_SEC = 2;

const glitchBurstTimes = [0, 0.88, 0.89, 0.9, 0.915, 0.93, 0.945, 0.96, 0.975, 0.99, 1] as const;

const glitchBurstX = [0, 0, -6, 7, -5, 6, -4, 5, -3, 0, 0];
const glitchBurstSkew = [0, 0, -1.4, 1.2, -1, 0.9, -0.7, 0.5, -0.3, 0, 0];

export function GlitchName() {
  return (
    <div className="flex w-full max-w-[100vw] justify-center overflow-x-auto overflow-y-visible px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <motion.div
        className="inline-block overflow-visible"
        animate={{ x: glitchBurstX, skewX: glitchBurstSkew }}
        transition={{
          duration: GLITCH_CYCLE_SEC,
          repeat: Infinity,
          ease: 'linear',
          times: [...glitchBurstTimes],
        }}
      >
        <h1
          className="glitch-name-ref text-center"
          style={{ fontSize: 'clamp(1.05rem, 5.2vw, 2.35rem)' }}
          data-text={FULL_NAME}
        >
          {FULL_NAME}
        </h1>
      </motion.div>
    </div>
  );
}

export function TypewriterSubtitle() {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      let i = 0;
      intervalRef.current = window.setInterval(() => {
        i += 1;
        setShown(SUBTITLE.slice(0, i));
        if (i >= SUBTITLE.length) {
          if (intervalRef.current !== undefined) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = undefined;
          }
          setDone(true);
        }
      }, 52);
    }, 480);

    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, []);

  return (
    <div className="flex w-full max-w-[100vw] justify-center overflow-x-auto overflow-y-visible px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <p
        className="subtitle-type-caps mx-auto mt-1.5 text-center sm:mt-2"
        style={{ fontSize: 'clamp(0.62rem, 2.35vw, 0.92rem)' }}
        aria-label={SUBTITLE}
      >
        {shown}
        {!done && (
          <span className="typewriter-cursor ml-0.5 inline-block font-semibold text-cyan-300/90">|</span>
        )}
      </p>
    </div>
  );
}
