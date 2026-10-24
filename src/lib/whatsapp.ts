export const getWhatsAppUrl = (number: string, message?: string) =>
  `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
