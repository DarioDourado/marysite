import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/src/components/ui/WhatsAppIcon.tsx';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { getWhatsAppUrl } from '@/src/lib/whatsapp.ts';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { useSubmitForm } from '@/src/hooks/submissions/index.ts';

export const ContactSection = () => {
  const { t } = useTranslation();
  const attr = useAttrText();
  const email = attr('contacts.email');
  const submit = useSubmitForm();
  const emptyForm = { name: '', email: '', message: '', website: '' };
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (submit.isPending) return;
    submit.mutate(
      { kind: 'contact', subject: '', ...form },
      {
        onSuccess: () => {
          setForm(emptyForm);
          alert(t('system.contactSent'));
        },
        onError: () => alert(t('system.submitError')),
      },
    );
  };

  return (
    <section id="contacts" className="section-spacing bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-10 tracking-tight">
              <Cms k="contacts.title" />
            </h2>
            <div className="space-y-6 text-lg text-text-light leading-relaxed">
              <p><Cms k="contacts.questions" /></p>
              <p><Cms k="contacts.reply" /></p>

              <ul className="space-y-5 pt-8 border-t border-border">
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-primary-dark rounded-round flex items-center justify-center text-on-primary">
                    <Mail className="w-5 h-5" strokeWidth={1.2} />
                  </span>
                  <span>
                    <span className="font-medium text-foreground"><Cms k="contacts.emailLabel" />: </span>
                    <a href={`mailto:${email}`} className="hover:text-primary-dark transition-colors"><Cms k="contacts.email" /></a>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-primary-dark rounded-round flex items-center justify-center text-on-primary">
                    <WhatsAppIcon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="font-medium text-foreground"><Cms k="contacts.whatsappLabel" />: </span>
                    <a
                      href={getWhatsAppUrl(attr('whatsapp.number'))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-dark transition-colors"
                    >
                      <Cms k="contacts.whatsapp" />
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="bg-primary/20 p-8 md:p-12 rounded-panel">
            <h3 className="text-2xl font-serif font-normal text-foreground mb-8"><Cms k="contacts.form.title" /></h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input type="text" required name="name" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label={t('contacts.form.name')} placeholder={t('contacts.form.name')} className="w-full px-6 py-4 bg-surface input" />
                <input type="email" required name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-label={t('contacts.form.email')} placeholder={t('contacts.form.email')} className="w-full px-6 py-4 bg-surface input" />
                <textarea required name="message" maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-label={t('contacts.form.message')} placeholder={t('contacts.form.message')} className="w-full px-6 py-4 bg-surface input min-h-[150px]" />
              </div>
              {/* Armadilha anti-robôs: invisível e fora da navegação por teclado */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <button type="submit" disabled={submit.isPending} className="w-full py-5 btn-primary rounded-control font-bold shadow-button">
                <Cms k="contacts.form.send" />
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
