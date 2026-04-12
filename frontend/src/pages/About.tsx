import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassShatter from '../components/GlassShatter';
import myImg from '../assets/my_img.jpg';
import type { PageProps } from '../pageProps';

const CATCHY_HEADLINE = 'From Models to Living Products';

export default function About({ theme }: PageProps) {
  const [revealed, setRevealed] = useState(false);
  const d = theme === 'day';

  return (
    <div className="relative min-h-screen w-full px-6 py-24 flex items-center justify-center" style={{ zIndex: 1 }}>
      <div className="relative z-10 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-6xl font-thin tracking-[0.3em] mb-12 text-center"
            style={{ color: d ? 'rgba(38,40,52,0.88)' : 'rgba(255,255,255,0.9)' }}
          >
            ABOUT ME
          </h2>

          <div
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: d
                ? 'linear-gradient(145deg, rgba(255,255,255,0.78) 0%, rgba(255,252,248,0.5) 45%, rgba(220,240,236,0.42) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(8,12,24,0.82) 45%, rgba(6,10,20,0.88) 100%)',
              border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(48px) saturate(180%)',
              WebkitBackdropFilter: 'blur(48px) saturate(180%)',
              boxShadow: d
                ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 24px 80px rgba(80,100,120,0.12)'
                : 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 80px rgba(0,0,0,0.35)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background: d
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 42%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 42%)',
              }}
              aria-hidden
            />

            <div className="relative z-[1] flex flex-col md:flex-row gap-10 items-start">
              <motion.div
                className="w-44 h-44 rounded-2xl flex-shrink-0 overflow-hidden mx-auto md:mx-0"
                style={{
                  border: d ? '1px solid rgba(255,255,255,0.75)' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: d
                    ? '0 12px 40px rgba(80,120,140,0.12), 0 0 30px rgba(100,200,190,0.12)'
                    : '0 12px 40px rgba(0,0,0,0.35), 0 0 30px rgba(120,180,255,0.08)',
                }}
                animate={
                  revealed
                    ? {
                        y: [0, -10, 0],
                      }
                    : { y: 0 }
                }
                transition={{
                  duration: 4.5,
                  repeat: revealed ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                <img src={myImg} alt="Profile" className="w-full h-full object-cover" />
              </motion.div>

              <div className="flex-1 space-y-5">
                <motion.h3
                  className="text-2xl md:text-[1.65rem] font-light tracking-wide leading-snug"
                  style={{
                    color: d ? 'rgba(32,36,48,0.92)' : 'rgba(255,255,255,0.92)',
                    textShadow: d ? '0 0 40px rgba(100, 180, 170, 0.15)' : '0 0 40px rgba(120, 200, 255, 0.12)',
                  }}
                  initial={false}
                  animate={
                    revealed
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: 14, filter: 'blur(10px)' }
                  }
                  transition={{
                    duration: 0.95,
                    delay: revealed ? 0.2 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {CATCHY_HEADLINE}
                </motion.h3>

                <p className="leading-relaxed text-sm" style={{ color: d ? 'rgba(55,58,72,0.72)' : 'rgba(255,255,255,0.55)', lineHeight: '1.9' }}>
                  I am a results-driven software engineer at the intersection of solid backend architecture and practical
                  machine learning inside full-stack products. I am pursuing my B.Tech with a 100% scholarship and dual
                  Honors List recognition, and I focus on turning complex models into approachable software that solves
                  real problems.
                </p>
                <p className="leading-relaxed text-sm" style={{ color: d ? 'rgba(55,58,72,0.72)' : 'rgba(255,255,255,0.55)', lineHeight: '1.9' }}>
                  My work spans modern SPAs, scalable REST APIs, automated computer vision utilities, and production-minded
                  ML from high-fidelity image pipelines to gesture-based control systems and data layers. I care about
                  clean, efficient code that connects research-grade ideas to smooth, intuitive experiences.
                </p>
                <p className="leading-relaxed text-sm" style={{ color: d ? 'rgba(55,58,72,0.72)' : 'rgba(255,255,255,0.55)', lineHeight: '1.9' }}>
                  Beyond individual projects, I learn by shipping consistently and driving community-oriented technical
                  initiatives. I want to use this blend of full-stack engineering and ML to build scalable platforms that
                  deliver measurable value and raise the bar for how people interact with technology.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {['React', 'TypeScript', 'Python', 'REST APIs', 'OpenCV', 'ML'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs tracking-wider"
                      style={{
                        background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.06)',
                        border: d ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.12)',
                        color: d ? 'rgba(55,58,72,0.65)' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {!revealed && <GlassShatter onReveal={() => setRevealed(true)} theme={theme} />}
    </div>
  );
}
