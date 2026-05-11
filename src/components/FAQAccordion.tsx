import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Qual é o valor de cada consulta e como posso efetuar o pagamento?',
    answer: 'O valor de cada consulta é de 50€. O pagamento pode ser realizado de forma simples e segura através de MB WAY ou transferência bancária.'
  },
  {
    question: 'Quanto tempo dura uma sessão e com que frequência deve ser realizada?',
    answer: 'A primeira sessão tem a duração aproximada de 1h30, para que possamos conhecer a sua história com calma. As sessões seguintes duram cerca de 50 minutos. O ritmo das consultas será definido em conjunto, podendo ser semanal, quinzenal ou mensal, conforme as suas necessidades e objetivos.'
  },
  {
    question: 'Como funcionam, na prática, as consultas de psicologia online?',
    answer: 'As consultas são muito semelhantes às presenciais, mas acontecem através de uma videochamada, via Google Meet. No dia e hora agendados, acede ao link que lhe envio e conversamos num ambiente privado. A única diferença é a barreira física: a escuta, a empatia e o trabalho terapêutico mantêm-se intactos.'
  },
  {
    question: 'As consultas online são tão eficazes quanto as presenciais?',
    answer: 'Sim. Diversos estudos científicos e organizações de saúde internacionais demonstram que a eficácia da psicoterapia online é equivalente à da presencial numa grande diversidade de problemáticas. Os resultados terapêuticos e os ganhos de bem-estar são alcançados de forma plena através deste formato, com a vantagem acrescida da conveniência e do conforto do seu espaço.'
  },
  {
    question: 'As consultas online são seguras e confidenciais?',
    answer: 'Absolutamente. A ética e o sigilo profissional da psicologia aplicam-se da mesma forma no mundo digital. Utilizo o Google Meet, uma plataforma segura que garante a encriptação das nossas chamadas. Da sua parte, é apenas importante que garanta que está num local isolado e privado durante a sessão.'
  },
  {
    question: 'Que equipamentos necessito e de onde posso fazer a consulta?',
    answer: 'Apenas necessita de um dispositivo com câmara e microfone (computador, tablet ou telemóvel) e uma ligação estável à internet. Recomendo o uso de fones de ouvido para maior privacidade. Pode realizar a sessão em qualquer lugar onde se sinta confortável, eliminando o tempo e o stress das deslocações.'
  }
];

export const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto mt-32 space-y-4">
      <h3 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-12 text-center">
        Perguntas Frequentes
      </h3>
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white border border-secondary/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="font-serif font-normal text-lg md:text-xl text-foreground pr-8">
              {faq.question}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-primary-dark flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
              strokeWidth={1.5}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-8 pb-6 text-text-light leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
