import { useState, useEffect } from 'react';
import { HomeTransporter } from './HomeTransporter.ts';
import { useTranslation } from 'react-i18next';

export interface CMSArea {
  id: string;
  title: string;
  description: string;
}

export const useHomeHook = () => {
  const { t, i18n } = useTranslation();
  const [areas, setAreas] = useState<CMSArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await HomeTransporter.getCMSContent();
        setAreas(content.areas);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleBooking = () => {
    // In a real app, this would scroll to the booking section or open a modal.
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    t,
    i18n,
    areas,
    loading,
    error,
    changeLanguage,
    handleBooking
  };
};
