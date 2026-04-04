import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import { Menu, X, Globe } from 'lucide-react';
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
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleLanguage}
            className="text-text-light hover:text-foreground transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button 
            className="p-1 text-foreground" 
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden pt-12 bg-white flex flex-col"
          >
            <nav className="flex flex-col px-10 pt-10 gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-serif font-semibold text-foreground hover:text-primary-dark transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full py-5 bg-primary-dark text-white text-center rounded-2xl font-semibold text-lg shadow-lg shadow-primary-dark/20"
              >
                {t('nav.booking')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
