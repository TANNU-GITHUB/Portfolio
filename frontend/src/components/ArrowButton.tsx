import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ArrowButtonProps {
  onClick: () => void;
}

export default function ArrowButton({ onClick }: ArrowButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 cursor-pointer group"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span
        className="text-xs tracking-[0.3em] font-light"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        EXPLORE
      </span>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 0 20px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <ChevronDown
          size={22}
          style={{ color: 'rgba(255,255,255,0.8)' }}
          className="group-hover:translate-y-0.5 transition-transform duration-300"
        />
      </div>
    </motion.button>
  );
}
