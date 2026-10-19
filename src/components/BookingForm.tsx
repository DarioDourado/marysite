import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const BookingForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    scheduleDetails: '',
    preferences: {
      morning: false,
      afternoon: false,
      noPreference: false,
    }
  });

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
    // Handle form submission here
    alert('Pedido de marcação enviado com sucesso!');
  };

  return (
    <div className="max-w-3xl mx-auto bg-surface rounded-panel p-8 md:p-12 shadow-panel border border-border">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-surface input" 
              placeholder="O seu nome completo"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 bg-surface input" 
              placeholder="O seu endereço de e-mail"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Telemóvel</label>
          <input 
            type="tel" 
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-5 py-4 bg-surface input" 
            placeholder="O seu número de telemóvel"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Motivo da Consulta</label>
          <textarea 
            required
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full px-5 py-4 bg-surface input min-h-[120px]" 
            placeholder="Descreva brevemente o motivo da sua consulta"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground block">Preferência de Horário</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="choice gap-3 p-4">
              <input 
                type="checkbox" 
                name="morning"
                checked={formData.preferences.morning}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-primary-dark rounded-checkbox border-border focus:ring-primary-dark" 
              />
              <span className="text-sm text-foreground">Dias úteis: 10h-13h</span>
            </label>
            <label className="choice gap-3 p-4">
              <input 
                type="checkbox" 
                name="afternoon"
                checked={formData.preferences.afternoon}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-primary-dark rounded-checkbox border-border focus:ring-primary-dark" 
              />
              <span className="text-sm text-foreground">Dias úteis: 15h-20h</span>
            </label>
            <label className="choice gap-3 p-4">
              <input 
                type="checkbox" 
                name="noPreference"
                checked={formData.preferences.noPreference}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-primary-dark rounded-checkbox border-border focus:ring-primary-dark" 
              />
              <span className="text-sm text-foreground">Não tenho preferência</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Detalhes de Horário (Opcional)</label>
          <textarea 
            value={formData.scheduleDetails}
            onChange={(e) => setFormData({...formData, scheduleDetails: e.target.value})}
            className="w-full px-5 py-4 bg-surface input min-h-[100px]" 
            placeholder="Se precisar, detalhe aqui a sua disponibilidade (ex: apenas à terça-feira)"
          />
        </div>

        <button type="submit" className="w-full py-5 btn-primary rounded-control font-serif font-normal text-lg shadow-button">
          Pedir Marcação
        </button>
      </form>
    </div>
  );
};
