import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { LockLink } from '@/src/components/admin/LockLink.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';

export const Footer = () => {
  const { t } = useTranslation();
  const attr = useAttrText();

  return (
    <footer className="bg-secondary/10 border-t border-secondary/20 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-serif font-medium text-primary-dark mb-6">
            <Cms k="footer.title" />
          </h2>
          <p className="text-foreground/70 leading-relaxed max-w-md">
            <Cms k="footer.description" />
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href={attr('footer.social.0.url')} aria-label={attr('footer.social.0.label')} className="p-2 bg-primary/10 text-primary-dark rounded-round hover:bg-primary/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={attr('footer.social.1.url')} aria-label={attr('footer.social.1.label')} className="p-2 bg-primary/10 text-primary-dark rounded-round hover:bg-primary/20 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-serif font-medium text-foreground mb-6">
            <Cms k="nav.contacts" />
          </h3>
          <ul className="space-y-4 text-foreground/70">
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 shrink-0 bg-primary-dark text-on-primary rounded-round flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </span>
              <span><Cms k="contacts.email" /></span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 shrink-0 bg-primary-dark text-on-primary rounded-round flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </span>
              <span><Cms k="contacts.whatsapp" /></span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 shrink-0 bg-primary-dark text-on-primary rounded-round flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </span>
              <span><Cms k="footer.location" /></span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-serif font-medium text-foreground mb-6">
            <Cms k="footer.linksTitle" />
          </h3>
          <ul className="space-y-4 text-foreground/70">
            <li><Link to="/" className="hover:text-primary-dark transition-colors"><Cms k="nav.home" /></Link></li>
            <li><Link to="/#about" className="hover:text-primary-dark transition-colors"><Cms k="nav.about" /></Link></li>
            <li><Link to="/#areas" className="hover:text-primary-dark transition-colors"><Cms k="nav.areas" /></Link></li>
            <li><Link to="/#booking-section" className="hover:text-primary-dark transition-colors"><Cms k="nav.booking" /></Link></li>
            <li><Link to="/blog" className="hover:text-primary-dark transition-colors"><Cms k="nav.blog" /></Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <p><Cms k="footer.copyright" /></p>
        <div className="flex items-center gap-6">
          <a href={attr('footer.privacy.url')} className="hover:text-primary transition-colors"><Cms k="footer.privacy.label" /></a>
          <a href={attr('footer.terms.url')} className="hover:text-primary transition-colors"><Cms k="footer.terms.label" /></a>
          <LockLink />
        </div>
      </div>
    </footer>
  );
};
