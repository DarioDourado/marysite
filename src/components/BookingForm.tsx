import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { useSubmitForm } from '@/src/hooks/submissions/index.ts';
import { SCHEDULE_OPTIONS } from '@/src/types/submissions/index.ts';

export const BookingForm = () => {
  const { t } = useTranslation();
  const attr = useAttrText();
  const submit = useSubmitForm();
  const emptyForm = {
    name: '',
    email: '',
    phone: '',
    reason: '',
    scheduleDetails: '',
    website: '',
    preferences: {
      morning: false,
      afternoon: false,
      noPreference: false,
    }
  };
  const [formData, setFormData] = useState(emptyForm);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submit.isPending) return;
    submit.mutate(
      {
        kind: 'booking',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.reason,
        schedule: SCHEDULE_OPTIONS.filter((option) => formData.preferences[option]),
        scheduleDetails: formData.scheduleDetails,
        website: formData.website,
      },
      {
        onSuccess: () => {
          setFormData(emptyForm);
          alert(t('bookingForm.success'));
        },
        onError: () => alert(t('system.submitError')),
      },
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-surface rounded-panel p-8 md:p-12 shadow-panel border border-border">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="booking-name" className="text-sm font-medium text-foreground"><Cms k="bookingForm.name.label" /></label>
            <input id="booking-name" 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-surface input" 
              placeholder={attr('bookingForm.name.placeholder')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="booking-email" className="text-sm font-medium text-foreground"><Cms k="bookingForm.email.label" /></label>
            <input id="booking-email" 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 bg-surface input" 
              placeholder={attr('bookingForm.email.placeholder')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="booking-phone" className="text-sm font-medium text-foreground"><Cms k="bookingForm.phone.label" /></label>
          <input id="booking-phone" 
            type="tel" 
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-5 py-4 bg-surface input" 
            placeholder={attr('bookingForm.phone.placeholder')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="booking-reason" className="text-sm font-medium text-foreground"><Cms k="bookingForm.reason.label" /></label>
          <textarea id="booking-reason" 
            required
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full px-5 py-4 bg-surface input min-h-[120px]" 
            placeholder={attr('bookingForm.reason.placeholder')}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground block"><Cms k="bookingForm.scheduleTitle" /></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="choice gap-3 p-4">
              <input 
                type="checkbox" 
                name="morning"
                checked={formData.preferences.morning}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-primary-dark rounded-checkbox border-border focus:ring-primary-dark" 
              />
              <span className="text-sm text-foreground"><Cms k="bookingForm.morning" /></span>
            </label>
            <label className="choice gap-3 p-4">
              <input 
                type="checkbox" 
                name="afternoon"
                checked={formData.preferences.afternoon}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-primary-dark rounded-checkbox border-border focus:ring-primary-dark" 
              />
              <span className="text-sm text-foreground"><Cms k="bookingForm.afternoon" /></span>
            </label>
            <label className="choice gap-3 p-4">
              <input 
                type="checkbox" 
                name="noPreference"
                checked={formData.preferences.noPreference}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-primary-dark rounded-checkbox border-border focus:ring-primary-dark" 
              />
              <span className="text-sm text-foreground"><Cms k="bookingForm.noPreference" /></span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="booking-details" className="text-sm font-medium text-foreground"><Cms k="bookingForm.details.label" /></label>
          <textarea id="booking-details" 
            value={formData.scheduleDetails}
            onChange={(e) => setFormData({...formData, scheduleDetails: e.target.value})}
            className="w-full px-5 py-4 bg-surface input min-h-[100px]" 
            placeholder={attr('bookingForm.details.placeholder')}
          />
        </div>

        {/* Armadilha anti-robôs: invisível e fora da navegação por teclado */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
        />

        <button type="submit" disabled={submit.isPending} className="w-full py-5 btn-primary rounded-control font-serif font-normal text-lg shadow-button">
          <Cms k="bookingForm.submit" />
        </button>
      </form>
    </div>
  );
};
