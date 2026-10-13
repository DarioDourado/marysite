/**
 * Transporter for Home Page data.
 */
export const HomeTransporter = {
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
