import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { ListAddButton, ListItemControls } from '@/src/components/cms/ListControls.tsx';
import { RichHtml } from '@/src/components/cms/RichHtml.tsx';

interface Faq {
  question: string;
  answer: string;
}

export const FAQAccordion = () => {
  const { t } = useTranslation();
  const faqs = t('faq.items', { returnObjects: true }) as Faq[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto mt-32 space-y-4">
      <h3 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-12 text-center">
        <Cms k="faq.title" />
      </h3>
      {faqs.map((_, index) => (
        <div 
          key={index} 
          className="card card-hover overflow-hidden"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="font-serif font-normal text-lg md:text-xl text-foreground pr-8">
              <Cms k={`faq.items.${index}.question`} />
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
                <RichHtml k={`faq.items.${index}.answer`} className="px-8 pb-6 text-text-light leading-relaxed" />
              </motion.div>
            )}
          </AnimatePresence>
          <ListItemControls listPath="faq.items" index={index} />
        </div>
      ))}
      <ListAddButton listPath="faq.items" />
    </div>
  );
};
