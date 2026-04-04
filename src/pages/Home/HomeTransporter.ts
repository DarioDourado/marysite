/**
 * Transporter for Home Page data and Google Calendar integration.
 */
export const HomeTransporter = {
  /**
   * Fetch busy slots for a given time range.
   */
  async getBusySlots(timeMin: string, timeMax: string) {
    const response = await fetch(`/api/calendar/slots?timeMin=${timeMin}&timeMax=${timeMax}`);
    if (!response.ok) {
      throw new Error('Failed to fetch busy slots');
    }
    return response.json();
  },

  /**
   * Book a new consultation event.
   */
  async bookConsultation(data: {
    summary: string;
    description: string;
    start: string;
    end: string;
    attendeeEmail: string;
    attendeeName: string;
  }) {
    const response = await fetch('/api/calendar/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to book consultation');
    }
    return response.json();
  },

  /**
   * Fetch CMS content (mocked for now, but following the pattern).
   */
  async getCMSContent() {
    // In a real scenario, this would fetch from Sanity/Strapi.
    // For this MVP, we return a local JSON structure.
    return {
      areas: [
        { id: 'depression', title: 'Depressão', description: 'Apoio especializado para lidar com a tristeza profunda e falta de motivação.' },
        { id: 'anxiety', title: 'Ansiedade', description: 'Estratégias para gerir o stress, ataques de pânico e preocupação excessiva.' },
        { id: 'relationships', title: 'Relacionamentos', description: 'Terapia de casal e apoio em dificuldades interpessoais.' },
        { id: 'burnout', title: 'Burnout', description: 'Prevenção e recuperação de exaustão profissional.' }
      ]
    };
  }
};
