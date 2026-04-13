import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, ExternalLink, Github } from 'lucide-react';
import type { PageProps } from '../pageProps';

// --- PLACEHOLDERS: Import your actual videos here later ---
import vid1 from '../assets/projects/proj1.mp4';
import vid2 from '../assets/projects/proj2.mp4';
import vid3 from '../assets/projects/proj3.mp4';

type ProjectCategory = 'All' | 'Web-D' | 'CV';

const myProjects = [
  {
    id: 'p1',
    title: 'Gesture Media Controller',
    category: 'CV',
    date: 'January 2026',
    description: 'A computer vision system that controls video playback and system volume natively using real-time head pose tracking and hand gestures.',
    techStack: ['Python', 'OpenCV', 'MediaPipe'],
    videoUrl: vid1,
    githubUrl: 'https://github.com/TANNU-GITHUB/Minor_Project_1',
  },
  {
    id: 'p2',
    title: 'AI Face Restoration SPA',
    category: 'Web-D',
    date: 'February 2026',
    description: 'A frontend Single Page Application featuring a "Studio Mode" powered by ReF-LDM and a "Fast Mode" using CodeFormer for high-fidelity facial restoration.',
    techStack: ['React', 'Vite', 'Tailwind', 'Vercel'],
    videoUrl: vid2,
    githubUrl: 'https://github.com/TANNU-GITHUB/Minor_Project_2',
  },
  {
    id: 'p3',
    title: 'Action Recognition Pipeline',
    category: 'CV',
    date: 'March 2026',
    description: 'A robust video action recognition pipeline utilizing a Bag-of-Visual-Words (BoVW) approach, trained and evaluated on the UCF101 dataset.',
    techStack: ['Python', 'OpenCV', 'Scikit-Learn'],
    videoUrl: vid3,
    githubUrl: 'https://github.com/TANNU-GITHUB/Minor_Project_3',
  }
];

export default function Projects({ theme }: PageProps) {
  const d = theme === 'day';
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter logic
  const filteredProjects = myProjects.filter(
    (proj) => activeFilter === 'All' || proj.category === activeFilter
  );

  const handleFilterChange = (category: ProjectCategory) => {
    setActiveFilter(category);
    setCurrentIndex(0); // Reset carousel to first item when filtering
    setIsFilterOpen(false);
  };

  // Carousel Navigation Logic
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1 === filteredProjects.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? filteredProjects.length - 1 : prev - 1));
  };

  // Framer Motion variants for sliding left/right
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const currentProject = filteredProjects[currentIndex];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-24 pb-12 overflow-hidden" style={{ zIndex: 1 }}>
      
      {/* Header & Filter Area */}
      <div className="w-full max-w-5xl px-6 flex flex-col md:flex-row justify-between items-center mb-12 z-20">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-thin tracking-[0.3em] mb-6 md:mb-0"
          style={{ color: d ? 'rgba(38,40,52,0.88)' : 'rgba(255,255,255,0.9)' }}
        >
          PROJECTS
        </motion.h2>

        {/* Custom Glass Dropdown Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full transition-all duration-300"
            style={{
              background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.05)',
              border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px) saturate(150%)',
            }}
          >
            <Filter size={16} style={{ color: d ? 'rgba(55,58,72,0.5)' : 'rgba(255,255,255,0.6)' }} />
            <span className="text-sm font-light tracking-widest uppercase" style={{ color: d ? 'rgba(55,58,72,0.75)' : 'rgba(255,255,255,0.8)' }}>
              Sort By: {activeFilter}
            </span>
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                className="absolute top-full right-0 mt-3 w-48 rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: d ? 'rgba(255,255,255,0.88)' : 'rgba(10, 15, 25, 0.8)',
                  border: d ? '1px solid rgba(255,255,255,0.75)' : '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  boxShadow: d ? '0 20px 40px rgba(70,90,100,0.12)' : '0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                {(['All', 'Web-D', 'CV'] as ProjectCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(cat)}
                    className={`px-6 py-4 text-left text-sm font-light tracking-widest uppercase transition-colors ${d ? 'hover:bg-black/[0.04]' : 'hover:bg-white/10'}`}
                    style={{ color: activeFilter === cat ? (d ? 'rgba(32,36,48,0.95)' : '#fff') : d ? 'rgba(55,58,72,0.5)' : 'rgba(255,255,255,0.5)' }}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Carousel Area */}
      {filteredProjects.length > 0 ? (
        <div className="relative w-full max-w-5xl px-6 flex-1 flex items-center justify-center">
          
          {/* Navigation Arrows (Absolute positioned to the sides) */}
          <button
            onClick={handlePrev}
            className={`absolute left-2 md:-left-6 z-30 p-4 rounded-full border transition-all backdrop-blur-md ${d ? 'bg-white/60 border-white/70 text-slate-600/70 hover:bg-white/90 hover:text-slate-800' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
          >
            <ChevronLeft size={32} strokeWidth={1} />
          </button>

          <button
            onClick={handleNext}
            className={`absolute right-2 md:-right-6 z-30 p-4 rounded-full border transition-all backdrop-blur-md ${d ? 'bg-white/60 border-white/70 text-slate-600/70 hover:bg-white/90 hover:text-slate-800' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
          >
            <ChevronRight size={32} strokeWidth={1} />
          </button>

          {/* The Interactive Card */}
          <div className="w-full max-w-4xl relative h-[65vh] md:h-[70vh]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 200, damping: 25 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden flex flex-col md:flex-row isolate"
                style={{
                  background: d ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.02)',
                  border: d ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: d
                    ? '0 30px 60px rgba(70,100,110,0.12), inset 0 1px 0 rgba(255,255,255,0.9)'
                    : '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(30px) saturate(150%)',
                }}
              >
                {/* Left Side: Video Player */}
                <div className={`relative w-full md:w-[55%] h-[45%] md:h-full bg-black flex-shrink-0 border-b md:border-b-0 md:border-r ${d ? 'border-white/40' : 'border-white/10'}`}>
                  {currentProject.videoUrl ? (
                    <video
                      src={currentProject.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center font-mono text-sm uppercase tracking-widest ${d ? 'bg-white/40 text-slate-500/60' : 'bg-white/5 text-white/20'}`}>
                      Video Placeholder
                    </div>
                  )}
                  {/* Gradient overlay for blending */}
                  <div
                    className={`absolute inset-0 pointer-events-none bg-gradient-to-t md:bg-gradient-to-r to-transparent ${
                      d ? 'from-[#f3f0eb]/90 md:from-[#f3f0eb]/85' : 'from-[#050810]/80 md:from-[#050810]/80'
                    }`}
                  />
                </div>

                {/* Right Side: Project Details */}
                <div className="p-8 md:p-12 flex flex-col justify-center flex-1 h-full relative z-10">
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-[10px] tracking-widest uppercase ${d ? 'border-slate-400/40 text-slate-600/80 bg-white/50' : 'border-white/20 text-white/60 bg-white/5'}`}
                    >
                      {currentProject.category}
                    </span>
                    <span className="text-xs font-mono" style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}>
                      {currentProject.date}
                    </span>
                  </div>

                  <h3
                    className="text-3xl md:text-4xl font-light tracking-wide mb-6 leading-tight"
                    style={{ color: d ? 'rgba(32,36,48,0.94)' : 'rgba(255,255,255,0.95)' }}
                  >
                    {currentProject.title}
                  </h3>

                  <p className="text-sm md:text-base leading-relaxed mb-8 font-light" style={{ color: d ? 'rgba(55,58,72,0.68)' : 'rgba(255,255,255,0.6)' }}>
                    {currentProject.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {currentProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-1.5 rounded-md text-xs tracking-wider"
                        style={{
                          background: d ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.06)',
                          color: d ? 'rgba(55,58,72,0.75)' : 'rgba(255,255,255,0.7)',
                          border: d ? '1px solid rgba(255,255,255,0.75)' : undefined,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mt-auto">
                    {currentProject.githubUrl && (
                      <a
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full transition-colors border inline-flex items-center justify-center ${d ? 'bg-white/60 border-slate-300/50 text-slate-800 hover:bg-white/90' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                      >
                        <Github size={20} strokeWidth={1.5} />
                      </a>
                    )}
                    <button
                      type="button"
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors text-sm font-medium tracking-wide ${d ? 'bg-teal-600/90 text-white hover:bg-teal-600' : 'bg-white text-black hover:bg-white/90'}`}
                    >
                      View Live <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center tracking-widest font-light" style={{ color: d ? 'rgba(55,58,72,0.45)' : 'rgba(255,255,255,0.4)' }}>
          NO PROJECTS FOUND IN THIS CATEGORY
        </div>
      )}
    </div>
  );
}