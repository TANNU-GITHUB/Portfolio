import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import FloatingShards from './components/FloatingShards';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Education from './pages/Education';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import type { PageProps } from './pageProps';
import { SITE_THEME_STORAGE_KEY, ambientLayerStyle, readStoredTheme, type SiteTheme } from './siteTheme';

type Page = 'home' | 'about' | 'skills' | 'projects' | 'education' | 'certifications' | 'contact';

function renderPage(page: Page, onNavigate: (p: string) => void, theme: SiteTheme) {
  const props: PageProps = { onNavigate, theme };
  switch (page) {
    case 'home': return <Home {...props} />;
    case 'about': return <About {...props} />;
    case 'skills': return <Skills {...props} />;
    case 'projects': return <Projects {...props} />;
    case 'education': return <Education {...props} />;
    case 'certifications': return <Certifications {...props} />;
    case 'contact': return <Contact {...props} />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [theme, setTheme] = useState<SiteTheme>(() => readStoredTheme());

  useEffect(() => {
    try {
      localStorage.setItem(SITE_THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const navigate = (page: string) => {
    setActivePage(page as Page);
  };

  const isHome = activePage === 'home';

  return (
    <div
      // FIX 1: Removed global 'overflow-x-hidden'. If you need to prevent horizontal scroll, use 'overflow-x-clip' instead as it doesn't break sticky positioning.
      className={`relative flex w-full flex-col overflow-x-clip ${isHome ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Liquid-glass style ambient layer (non-home) */}
      {!isHome && (
        <div className="pointer-events-none fixed inset-0 z-0" style={ambientLayerStyle(theme)} />
      )}

      {!isHome && <FloatingShards theme={theme} />}

      {!isHome && (
        <Navbar activePage={activePage} onNavigate={navigate} theme={theme} onThemeChange={setTheme} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          // FIX 2: Removed 'overflow-hidden' from this wrapper. 
          className={`relative flex min-h-0 w-full flex-1 flex-col ${isHome ? 'min-h-0 flex-1' : 'pt-[5.5rem] sm:pt-[5.75rem]'}`}
          style={{ zIndex: 1 }}
        >
          {renderPage(activePage, navigate, theme)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}