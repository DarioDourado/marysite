import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { EditableLink } from '@/src/components/cms/EditableLink.tsx';
import { ListAddButton, ListItemControls } from '@/src/components/cms/ListControls.tsx';
import { socialIcon } from '@/src/lib/socialIcon.ts';
import { LockLink } from '@/src/components/admin/LockLink.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
import { cn } from '@/src/lib/utils.ts';

export const Footer = () => {
  const { t } = useTranslation();
  const social = t('footer.social', { returnObjects: true }) as unknown[];
  const rawLinks = t('footer.links', { returnObjects: true });
  const links = Array.isArray(rawLinks) ? rawLinks : [];
  const attr = useAttrText();
  const { enabled: editing } = useEditMode();

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
          <div className={cn('flex gap-4 mt-8', editing ? 'flex-col items-start' : 'items-center')}>
            {social.map((_, i) => {
              const Icon = socialIcon(attr(`footer.social.${i}.url`), t(`footer.social.${i}.icon`, { defaultValue: '' }));
              return (
                <span key={i} className="inline-flex items-center">
                  <EditableLink k={`footer.social.${i}`}>
                    <a href={attr(`footer.social.${i}.url`)} aria-label={attr(`footer.social.${i}.label`)} className="p-2 bg-primary/10 text-primary-dark rounded-round hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                  </EditableLink>
                  <ListItemControls listPath="footer.social" index={i} />
                </span>
              );
            })}
            <ListAddButton listPath="footer.social" />
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
            {links.map((_, i) => {
              const url = attr(`footer.links.${i}.url`) || '#';
              const label = <Cms k={`footer.links.${i}.label`} />;
              const className = 'hover:text-primary-dark transition-colors';
              return (
                <li key={i}>
                  {url.startsWith('/') ? <Link to={url} className={className}>{label}</Link> : <a href={url} className={className}>{label}</a>}
                  <ListItemControls listPath="footer.links" index={i} />
                </li>
              );
            })}
            <ListAddButton listPath="footer.links" as="li" />
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
