import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const MotionLink = motion.create(Link);

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.approach'), href: '/#approach' },
    { name: t('nav.areas'), href: '/areas' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contacts'), href: '/#contacts' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-secondary/40 h-12 md:h-14 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center">
            <img 
              src="/img/logo/Logo%20-%20lettring%20laterel.webp" 
              alt="Mariline Bôto" 
              className="h-8 md:h-10 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                target.insertAdjacentHTML('afterend', '<span class="text-lg md:text-xl font-serif font-normal tracking-tight text-foreground">Mariline Bôto</span>');
              }}
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-[13px] font-serif font-normal text-text-light hover:text-primary-dark transition-colors tracking-wide"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/#booking-section"
            className="px-5 py-2 bg-primary-dark text-white text-[13px] font-serif font-normal rounded-full hover:bg-primary-dark/90 transition-all"
          >
            {t('nav.booking')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            className="w-10 h-10 flex items-center justify-center bg-foreground text-white rounded-full shadow-lg shadow-foreground/20" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 md:hidden pt-14 bg-white flex flex-col shadow-2xl"
          >
            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col px-8 pt-12 pb-20 gap-8">
                {navItems.map((item, index) => (
                  <MotionLink
                    key={item.name}
                    to={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif font-normal text-foreground hover:text-primary-dark transition-colors tracking-tight"
                  >
                    {item.name}
                  </MotionLink>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 border-t border-secondary/40"
                >
                  <Link
                    to="/#booking-section"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-5 bg-primary-dark text-white text-center rounded-full font-serif font-normal text-xl shadow-xl shadow-primary-dark/20 flex items-center justify-center gap-3"
                  >
                    {t('nav.booking')}
                    <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
