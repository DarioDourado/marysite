import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle } from 'lucide-react';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';

const WHATSAPP_NUMBER = '351910979513';

export const ContactSection = () => {
  const { t } = useTranslation();
  const email = t('contacts.email');

  return (
    <section id="contacts" className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-10 tracking-tight">
              {t('contacts.title')}
            </h2>
            <div className="space-y-6 text-lg text-text-light leading-relaxed">
              <p>{t('contacts.questions')}</p>
              <p>{t('contacts.reply')}</p>

              <ul className="space-y-5 pt-8 border-t border-secondary/40">
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center text-primary-dark">
                    <Mail className="w-5 h-5" strokeWidth={1.2} />
                  </span>
                  <span>
                    <span className="font-medium text-foreground">{t('contacts.emailLabel')}: </span>
                    <a href={`mailto:${email}`} className="hover:text-primary-dark transition-colors">{email}</a>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center text-primary-dark">
                    <MessageCircle className="w-5 h-5" strokeWidth={1.2} />
                  </span>
                  <span>
                    <span className="font-medium text-foreground">{t('contacts.whatsappLabel')}: </span>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-dark transition-colors"
                    >
                      {t('contacts.whatsapp')}
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="bg-primary/20 p-8 md:p-12 rounded-[40px]">
            <h3 className="text-2xl font-serif font-normal text-foreground mb-8">{t('contacts.form.title')}</h3>
            <form className="space-y-6">
              <div className="space-y-4">
                <input type="text" aria-label={t('contacts.form.name')} placeholder={t('contacts.form.name')} className="w-full px-6 py-4 bg-white border border-secondary/40 rounded-2xl focus:outline-none focus:border-primary-dark transition-colors" />
                <input type="email" aria-label={t('contacts.form.email')} placeholder={t('contacts.form.email')} className="w-full px-6 py-4 bg-white border border-secondary/40 rounded-2xl focus:outline-none focus:border-primary-dark transition-colors" />
                <textarea aria-label={t('contacts.form.message')} placeholder={t('contacts.form.message')} className="w-full px-6 py-4 bg-white border border-secondary/40 rounded-2xl focus:outline-none focus:border-primary-dark transition-colors min-h-[150px]" />
              </div>
              <button type="submit" className="w-full py-5 bg-primary-dark text-white rounded-2xl font-bold hover:bg-primary-dark/90 transition-all shadow-xl shadow-primary-dark/20">
                {t('contacts.form.send')}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
