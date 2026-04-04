import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary/10 border-t border-secondary/20 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-serif font-medium text-primary-dark mb-6">
            A Sua Psicóloga Online
          </h2>
          <p className="text-foreground/70 leading-relaxed max-w-md">
            Apoio psicológico clínico especializado, focado na humanização e no bem-estar emocional de cada indivíduo.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href="#" className="p-2 bg-primary/10 text-primary-dark rounded-full hover:bg-primary/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-primary/10 text-primary-dark rounded-full hover:bg-primary/20 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-serif font-medium text-foreground mb-6">
            {t('nav.contacts')}
          </h3>
          <ul className="space-y-4 text-foreground/70">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" />
              <span>info@asuapsicologaonline.pt</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" />
              <span>+351 912 345 678</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Atendimento Online / Lisboa</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-serif font-medium text-foreground mb-6">
            Links
          </h3>
          <ul className="space-y-4 text-foreground/70">
            <li><a href="#" className="hover:text-primary transition-colors">{t('nav.home')}</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">{t('nav.about')}</a></li>
            <li><a href="#areas" className="hover:text-primary transition-colors">{t('nav.areas')}</a></li>
            <li><a href="#booking" className="hover:text-primary transition-colors">{t('nav.booking')}</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <p>© 2026 A Sua Psicóloga Online. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Termos e Condições</a>
        </div>
      </div>
    </footer>
  );
};
