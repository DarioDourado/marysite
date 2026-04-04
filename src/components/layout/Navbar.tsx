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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif font-medium tracking-tight text-primary-dark">
            A Sua Psicóloga
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary-dark transition-colors"
            >
              {item.name}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-primary-dark transition-colors"
          >
            <Globe className="w-4 h-4" />
            {i18n.language.toUpperCase()}
          </button>
          <a
            href="#booking"
            className="px-6 py-2 bg-primary text-foreground text-sm font-medium rounded-full hover:bg-primary-dark transition-all shadow-sm"
          >
            {t('nav.booking')}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground bg-white shadow-sm border border-secondary/10 rounded-full transition-colors z-50" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden pt-24 px-6 bg-white flex flex-col gap-8"
          >
            <nav className="flex flex-col gap-6 items-center">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 text-xl font-serif text-foreground/80 hover:text-primary transition-colors py-2"
              >
                <Globe className="w-6 h-6" />
                {i18n.language === 'pt' ? 'English' : 'Português'}
              </button>
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full py-5 bg-primary text-foreground text-center rounded-full font-medium shadow-lg shadow-primary/20 text-lg"
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
