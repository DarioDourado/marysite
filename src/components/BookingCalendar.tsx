import { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay, isBefore, startOfHour, addHours } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeTransporter } from '@/src/pages/Home/HomeTransporter.ts';
import { cn } from '@/src/lib/utils.ts';

export const BookingCalendar = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'pt' ? pt : enUS;

  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [busySlots, setBusySlots] = useState<any[]>([]);
  const [step, setStep] = useState<'date' | 'form' | 'success'>('date');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Generate available slots (e.g., 9:00 to 18:00)
  const availableHours = Array.from({ length: 10 }, (_, i) => i + 9);

  useEffect(() => {
    const fetchBusy = async () => {
      try {
        const timeMin = new Date(selectedDate).toISOString();
        const timeMax = addDays(new Date(selectedDate), 1).toISOString();
        const data = await HomeTransporter.getBusySlots(timeMin, timeMax);
        setBusySlots(data.busy || []);
      } catch (err) {
        console.error("Error fetching busy slots:", err);
      }
    };
    fetchBusy();
  }, [selectedDate]);

  const isSlotBusy = (hour: number) => {
    const slotStart = startOfHour(addHours(selectedDate, hour));
    return busySlots.some((busy: any) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return slotStart >= busyStart && slotStart < busyEnd;
    });
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    try {
      const start = startOfHour(addHours(selectedDate, parseInt(selectedSlot)));
      const end = addHours(start, 1);

      await HomeTransporter.bookConsultation({
        summary: 'Consulta de Psicologia',
        description: formData.message,
        start: start.toISOString(),
        end: end.toISOString(),
        attendeeEmail: formData.email,
        attendeeName: formData.name
      });

      setStep('success');
    } catch (err) {
      alert("Erro ao agendar. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="booking" className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-secondary/20 overflow-hidden border border-secondary/10">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Left Info Panel */}
        <div className="md:col-span-2 bg-primary p-8 md:p-10 text-foreground flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4 md:mb-6">
              {t('nav.booking')}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Escolha o melhor horário para a sua consulta online. O agendamento é imediato e receberá uma confirmação por email.
            </p>
            
            <ul className="space-y-4 md:space-y-6">
              <li className="flex items-center gap-4">
                <div className="p-2 bg-white/40 rounded-lg">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm font-medium">Sessões de 50 minutos</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-white/40 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm font-medium">Atendimento Online</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 md:pt-10 border-t border-foreground/10 text-[10px] md:text-xs text-foreground/60 mt-8 md:mt-0">
            * Horário de Lisboa (GMT+0)
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3 p-6 md:p-10 bg-white">
          <AnimatePresence mode="wait">
            {step === 'date' && (
              <motion.div
                key="date-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-serif font-medium text-foreground">
                    {format(selectedDate, 'MMMM yyyy', { locale })}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                      className="p-2 hover:bg-secondary/10 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                      className="p-2 hover:bg-secondary/10 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-8">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = addDays(selectedDate, i);
                    const isSelected = isSameDay(date, selectedDate);
                    const isPast = isBefore(date, startOfToday());

                    return (
                      <button
                        key={i}
                        disabled={isPast}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex flex-col items-center py-2 md:py-3 rounded-xl md:rounded-2xl transition-all",
                          isSelected ? "bg-primary text-foreground shadow-lg shadow-primary/30" : "hover:bg-secondary/10 text-foreground/70",
                          isPast && "opacity-20 cursor-not-allowed"
                        )}
                      >
                        <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest mb-1">
                          {format(date, 'EEE', { locale })}
                        </span>
                        <span className="text-base md:text-lg font-serif font-medium">
                          {format(date, 'd')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableHours.map((hour) => {
                    const busy = isSlotBusy(hour);
                    const isSelected = selectedSlot === hour.toString();

                    return (
                      <button
                        key={hour}
                        disabled={busy}
                        onClick={() => setSelectedSlot(hour.toString())}
                        className={cn(
                          "py-3 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2",
                          busy ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : 
                          isSelected ? "bg-primary-dark text-foreground border-primary-dark shadow-md" : "bg-white text-foreground/70 border-secondary/20 hover:border-primary hover:text-primary"
                        )}
                      >
                        <Clock className="w-4 h-4" />
                        {hour}:00
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep('form')}
                  className="w-full mt-10 py-4 bg-primary text-foreground rounded-2xl font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => setStep('date')}
                  className="text-sm font-medium text-primary-dark hover:underline mb-6 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar ao calendário
                </button>

                <h3 className="text-2xl font-serif font-medium text-foreground mb-8">
                  Os seus dados
                </h3>

                <form onSubmit={handleBook} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Nome Completo</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-secondary/5 border border-secondary/20 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="Como gostaria de ser chamado?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-secondary/5 border border-secondary/20 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Mensagem (Opcional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-4 bg-secondary/5 border border-secondary/20 rounded-2xl focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                      placeholder="Alguma observação ou motivo da consulta?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-foreground rounded-2xl font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {loading ? "A processar..." : "Confirmar Agendamento"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif font-medium text-foreground mb-4">
                  Agendamento Concluído!
                </h3>
                <p className="text-foreground/70 leading-relaxed max-w-xs mb-10">
                  A sua consulta foi agendada com sucesso. Receberá um email com todos os detalhes e o link para a sessão.
                </p>
                <button
                  onClick={() => {
                    setStep('date');
                    setSelectedSlot(null);
                  }}
                  className="px-10 py-4 border border-primary text-primary rounded-2xl font-medium hover:bg-primary hover:text-foreground transition-all"
                >
                  Novo Agendamento
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
