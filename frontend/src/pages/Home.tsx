import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import GridBackground from '../components/GridBackground';
import { GlitchName, TypewriterSubtitle } from '../components/LandingHeroText';
import ProfileAvatar from '../components/ProfileAvatar';
import myImg from '../assets/my_img.jpg';
import type { PageProps } from '../pageProps';

export default function Home({ onNavigate, theme: _theme }: PageProps) {
  return (
    <div
      className="flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden bg-black"
      style={{ background: '#000000' }}
    >
      <GridBackground>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-xl flex-col items-center justify-center text-center"
        >
          <ProfileAvatar src={myImg} alt="Tannu Bagadia" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-3 flex w-full max-w-[100%] flex-col items-center sm:mt-4"
          >
            <GlitchName />
            <TypewriterSubtitle />
          </motion.div>

          <motion.button
            type="button"
            aria-label="Continue to portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.65, duration: 0.4 }}
            className="mt-3 flex flex-col items-center gap-0.5 text-white/25 transition-colors hover:text-white/55 sm:mt-4"
            onClick={() => onNavigate('about')}
          >
            <ChevronDown size={22} strokeWidth={1.35} className="animate-bounce-subtle" />
          </motion.button>
        </motion.div>
      </GridBackground>
    </div>
  );
}
