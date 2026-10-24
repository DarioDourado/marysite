import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { ImagePencil } from '@/src/components/cms/ImagePencil.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { useImageEdit } from '@/src/components/cms/useImageEdit.ts';
import { useCmsImage } from '@/src/hooks/cms/index.ts';
import { mediaSrcSetEntry, mediaUrl } from '@/src/lib/cms/mediaUrl.ts';

const MotionLink = m.create(Link);

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const logo = useCmsImage('brand.logo');
  const logoEdit = useImageEdit('brand.logo');
  const attr = useAttrText();
  const brandName = attr('brand.name');

  // Already on the bare home URL: the route doesn't change, so scroll up manually.
  const handleLogoClick = () => {
    if (pathname === '/' && !hash) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/#about' },
    { key: 'nav.areas', href: '/areas' },
    { key: 'nav.approach', href: '/#approach' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.contacts', href: '/#contacts' },
  ];

  return (
    <nav aria-label={t('system.mainNav')} className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border h-12 md:h-14 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" onClick={handleLogoClick} className="hover:opacity-80 transition-opacity flex items-center">
            <img 
              src={logo ? mediaUrl(logo.url) : '/img/logo/Logotipo%20Lateral.webp'} 
              alt={brandName}
              srcSet={logo?.srcset ? logo.srcset.split(', ').map(mediaSrcSetEntry).join(', ') : undefined}
              sizes={logo?.srcset ? '160px' : undefined}
              width={logo?.width ?? undefined}
              height={logo?.height ?? undefined}
              data-cms-path={logoEdit ? 'brand.logo' : undefined} 
              className="h-8 md:h-10 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.className = 'text-lg md:text-xl font-serif font-normal tracking-tight text-foreground';
                fallback.textContent = brandName;
                target.after(fallback);
              }}
            />
          </Link>
          {logoEdit && <ImagePencil path="brand.logo" node={logoEdit.node} />}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className="text-[13px] font-serif font-normal text-text-light hover:text-primary-dark transition-colors tracking-wide"
            >
              <Cms k={item.key} />
            </Link>
          ))}
          <Link
            to="/#booking-section"
            className="px-5 py-2 btn-primary text-[13px] font-serif font-normal"
          >
            <Cms k="nav.booking" />
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button 
            className="w-10 h-10 flex items-center justify-center bg-foreground text-on-primary rounded-round shadow-fab" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={attr('nav.toggleMenu')}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 md:hidden pt-14 bg-surface flex flex-col shadow-float"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col px-8 pt-12 pb-20 gap-8">
                {navItems.map((item, index) => (
                  <MotionLink
                    key={item.key}
                    to={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif font-normal text-foreground hover:text-primary-dark transition-colors tracking-tight"
                  >
                    <Cms k={item.key} />
                  </MotionLink>
                ))}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 border-t border-border"
                >
                  <Link
                    to="/#booking-section"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-5 btn-primary text-center font-serif font-normal text-xl shadow-button flex items-center justify-center gap-3"
                  >
                    <Cms k="nav.booking" />
                    <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                  </Link>
                </m.div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
