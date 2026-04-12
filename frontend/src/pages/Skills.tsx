import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Eye, LayoutTemplate, Database, Cpu, Wrench,
  Terminal, FileCode2, Code, 
  Aperture,
  Box, Server, Zap, Globe,
  HardDrive, Table, Cylinder,
  Cpu as Microchip,
  PenTool, Layers, MousePointerClick, GitBranch
} from 'lucide-react';
import type { PageProps } from '../pageProps';

const skillsData = [
  {
    id: 'languages',
    title: 'Programming Languages',
    icon: Code2,
    color: '#22d3ee',
    items: [
      { name: 'Python', level: 90, icon: Terminal },
      { name: 'JavaScript', level: 85, icon: FileCode2 },
      { name: 'C++', level: 75, icon: Code },
    ]
  },
  {
    id: 'cv',
    title: 'Computer Vision',
    icon: Eye,
    color: '#34d399',
    items: [
      { name: 'OpenCV', level: 88, icon: Aperture },
    ]
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Libraries',
    icon: LayoutTemplate,
    color: '#fbbf24',
    items: [
      { name: 'PyTorch', level: 82, icon: Box },
      { name: 'Node.js', level: 80, icon: Server },
      { name: 'Express.js', level: 78, icon: Zap },
      { name: 'React.js', level: 85, icon: Globe },
    ]
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: Database,
    color: '#f472b6',
    items: [
      { name: 'MySQL', level: 80, icon: Table },
      { name: 'Postgres', level: 75, icon: HardDrive },
      { name: 'MongoDB', level: 82, icon: Cylinder },
    ]
  },
  {
    id: 'specialized',
    title: 'Specialized Tech',
    icon: Cpu,
    color: '#a78bfa',
    items: [
      { name: 'Quantum Image Processing', level: 70, icon: Microchip },
    ]
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: Wrench,
    color: '#60a5fa',
    items: [
      { name: 'Figma', level: 85, icon: PenTool },
      { name: 'Vite', level: 90, icon: Zap },
      { name: 'Cursor', level: 95, icon: MousePointerClick },
      { name: 'Git', level: 88, icon: GitBranch },
    ]
  }
];

export default function Skills({ theme }: PageProps) {
  const d = theme === 'day';
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = skillsData[activeIndex];

  // Radius for the 1000px dial
  const radius = 460; 

  return (
    // ZERO SCROLLING: Viewport is strictly locked
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center" style={{ zIndex: 1 }}>
      
      {/* 1. Tech Stack Container (Moved to the very top, taking the old heading's spot) */}
      <div className="absolute top-[8%] md:top-[12%] w-full max-w-5xl px-6 flex justify-center z-20">
        <div className="flex flex-wrap justify-center gap-6">
          <AnimatePresence mode="wait">
            {activeCategory.items.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={`${activeCategory.id}-${item.name}`}
                  initial={{ opacity: 0, x: -40, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, x: 0, scale: 1, 
                    transition: { duration: 0.6, delay: index * 1.5, ease: [0.22, 1, 0.36, 1] } 
                  }}
                  exit={{ 
                    opacity: 0, scale: 0.9, 
                    transition: { duration: 0.15, delay: 0 } 
                  }}
                  className="relative group mt-4" 
                >
                  <div
                    className="px-6 py-3 rounded-full cursor-default transition-all duration-300 flex items-center gap-3"
                    style={{
                      background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.04)',
                      border: d ? `1px solid rgba(255,255,255,0.65)` : `1px solid rgba(255,255,255,0.1)`,
                      backdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: d ? `0 8px 32px 0 rgba(70, 90, 100, 0.12)` : `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
                    }}
                  >
                    <ItemIcon size={18} style={{ color: activeCategory.color }} />
                    <span className="text-sm font-light tracking-wider" style={{ color: d ? 'rgba(32,36,48,0.88)' : 'rgba(255,255,255,0.9)' }}>
                      {item.name}
                    </span>
                  </div>

                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col items-center">
                    <div 
                      className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest"
                      style={{ 
                        background: activeCategory.color, 
                        color: '#000',
                        boxShadow: `0 0 20px ${activeCategory.color}88` 
                      }}
                    >
                      {item.level}%
                    </div>
                    <div className="w-2.5 h-2.5 rotate-45 -mt-1.5" style={{ background: activeCategory.color }} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. The Bottom Semicircle Dial */}
      <div className="absolute bottom-0 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 translate-y-[58%] pointer-events-none z-10">
        
        {/* Dial Boundaries */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            border: d ? '80px solid rgba(255,255,255,0.35)' : '80px solid rgba(255,255,255,0.02)',
            boxShadow: d ? 'inset 0 0 50px rgba(255,255,255,0.4)' : 'inset 0 0 50px rgba(0,0,0,0.5)' 
          }}
        />
        <div className={`absolute inset-0 rounded-full border-[1.5px] ${d ? 'border-slate-400/35' : 'border-white/20'}`} />
        <div className={`absolute inset-[80px] rounded-full border-[1.5px] ${d ? 'border-slate-400/30' : 'border-white/20'}`} />
        <div className={`absolute inset-[40px] rounded-full border border-dashed ${d ? 'border-slate-400/25' : 'border-white/10'}`} />

        {/* 3. Category Heading (Pinned perfectly to the visual center of the dial arc) */}
        <div className="absolute top-[160px] left-1/2 -translate-x-1/2 w-full text-center z-30 pointer-events-none flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl md:text-3xl tracking-[0.4em] font-medium uppercase drop-shadow-2xl leading-[1.8]" 
                style={{ 
                  color: activeCategory.color, 
                  textShadow: `0 0 30px ${activeCategory.color}, 0 0 60px ${activeCategory.color}88` 
                }}
              >
                {activeCategory.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Category Icons */}
        {skillsData.map((category, index) => {
          const startAngle = 165;
          const endAngle = 15;
          const angleStep = (startAngle - endAngle) / (skillsData.length - 1);
          const angle = startAngle - (index * angleStep);
          const radian = angle * (Math.PI / 180); 
          
          const x = Math.cos(radian) * radius;
          const y = -Math.sin(radian) * radius; 
          
          const isActive = activeIndex === index;
          const IconComponent = category.icon;

          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveIndex(index)}
              className="absolute flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-300 pointer-events-auto"
              style={{
                left: `calc(50% + ${x}px - 24px)`,
                top: `calc(50% + ${y}px - 24px)`,
                background: isActive ? `${category.color}33` : d ? '#f5f2ec' : '#050810',
                border: `1.5px solid ${isActive ? category.color : d ? 'rgba(55,58,72,0.22)' : 'rgba(255,255,255,0.3)'}`,
                boxShadow: isActive ? `0 0 30px ${category.color}88, inset 0 0 15px ${category.color}66` : d ? '0 4px 14px rgba(80,100,120,0.1)' : 'none',
              }}
              whileHover={{ scale: 1.15, borderColor: category.color }}
              whileTap={{ scale: 0.9 }}
            >
              <IconComponent 
                size={22} 
                color={isActive ? '#ffffff' : d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.5)'} 
                style={{ 
                  filter: isActive ? `drop-shadow(0 0 5px ${category.color})` : 'none',
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}