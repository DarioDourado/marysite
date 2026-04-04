import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
  };

  const navItems = [
    { name: t('nav.home'), href: '#' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.approach'), href: '#approach' },
    { name: t('nav.areas'), href: '#areas' },
    { name: t('nav.contacts'), href: '#contacts' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-secondary/40 h-12 md:h-14 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="text-lg md:text-xl font-serif font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
            Mariline Bôto
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-[12px] font-medium text-text-light hover:text-foreground transition-colors tracking-wide"
            >
              {item.name}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-[12px] font-medium text-text-light hover:text-foreground transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {i18n.language.toUpperCase()}
          </button>
          <a
            href="#booking"
            className="px-4 py-1.5 bg-primary-dark text-white text-[12px] font-medium rounded-full hover:bg-primary-dark/90 transition-all"
          >
            {t('nav.booking')}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="w-10 h-10 flex items-center justify-center bg-secondary/20 rounded-full text-text-light hover:text-foreground transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
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
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif font-bold text-foreground hover:text-primary-dark transition-colors tracking-tight"
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 border-t border-secondary/40"
                >
                  <a
                    href="#booking"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-5 bg-primary-dark text-white text-center rounded-full font-bold text-xl shadow-xl shadow-primary-dark/20 flex items-center justify-center gap-3"
                  >
                    {t('nav.booking')}
                    <ArrowRight className="w-6 h-6" />
                  </a>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
