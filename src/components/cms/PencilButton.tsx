import { Pencil } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';

interface PencilButtonProps {
  label: string;
  onActivate: () => void;
  className?: string;
}

// span[role=button]: pode estar dentro de <button> ou <a> sem aninhar elementos interativos
export const PencilButton = ({ label, onActivate, className }: PencilButtonProps) => (
  <span
    role="button"
    tabIndex={0}
    aria-label={label}
    title={label}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onActivate();
    }}
    onKeyDown={(event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      onActivate();
    }}
    className={cn(
      'inline-flex items-center justify-center align-middle ml-1.5 w-6 h-6 shrink-0 rounded-round bg-primary-dark text-on-primary',
      'shadow-fab cursor-pointer hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark',
      className,
    )}
  >
    <Pencil className="w-3 h-3" strokeWidth={2} />
  </span>
);
