import { useTranslation } from 'react-i18next';

export const useHomeHook = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleBooking = () => {
    // In a real app, this would scroll to the booking section or open a modal.
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    t,
    i18n,
    changeLanguage,
    handleBooking
  };
};
