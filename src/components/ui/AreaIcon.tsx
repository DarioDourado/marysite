import type { ReactNode } from 'react';

const leaf = (x: number, y: number, dx: number, dy: number) =>
  `M${x} ${y} q${dx} ${dy} ${dx * 2} 0 q${-dx} ${-dy} ${-dx * 2} 0z`;

const icons: Record<string, ReactNode> = {
  // broto a nascer de uma fissura
  trauma: (
    <>
      <path d="M6 38 l8 -3 l5 3 l6 -4 l6 3 l11 -2" />
      <path d="M24 34 V20" />
      <path d="M24 26 c-8 0 -10 -7 -10 -9 c8 0 10 6 10 9z" />
      <path d="M24 21 c0 -7 4 -10 9 -11 c0 6 -3 10 -9 11z" />
    </>
  ),
  // flor tombada
  luto: (
    <>
      <path d="M16 42 C16 28 22 16 32 14" />
      <path d="M32 14 c4 -1 8 3 7 8 c-5 1 -9 -2 -7 -8z" />
      <path d="M32 14 c-1 -4 -5 -6 -9 -3 c2 4 6 6 9 3z" />
      <path d="M16 36 c-6 0 -8 -5 -8 -7 c6 0 8 4 8 7z" />
    </>
  ),
  // ramo agitado pelo vento
  ansiedade: (
    <>
      <path d="M8 26 C16 22 24 30 32 24 S40 22 42 24" />
      <path d="M8 16 H26 a4 4 0 1 0 -4 -4" />
      <path d="M8 36 H28 a4 4 0 1 1 -4 4" />
      <path d="M30 24 c3 -6 8 -7 12 -6 c-1 6 -6 8 -12 6z" />
    </>
  ),
  // nuvem com rebento por baixo
  depressao: (
    <>
      <path d="M14 22 a6 6 0 0 1 2 -11.5 a8 8 0 0 1 15 1 a5.5 5.5 0 0 1 1 10.5z" />
      <path d="M24 42 V30" />
      <path d="M24 36 c-6 0 -8 -5 -8 -6 c6 0 8 4 8 6z" />
      <path d="M24 33 c0 -4 3 -6 7 -6 c0 4 -3 6 -7 6z" />
    </>
  ),
  // coroa de folhas repetidas
  poc: (
    <>
      <circle cx="24" cy="24" r="4" />
      <path d={leaf(24, 8, 4, 5)} transform="rotate(0 24 24)" />
      <path d={leaf(24, 8, 4, 5)} transform="rotate(90 24 24)" />
      <path d={leaf(24, 8, 4, 5)} transform="rotate(180 24 24)" />
      <path d={leaf(24, 8, 4, 5)} transform="rotate(270 24 24)" />
      <path d="M24 12 V20 M24 28 V36 M12 24 H20 M28 24 H36" />
    </>
  ),
  // flor aberta
  autoestima: (
    <>
      <circle cx="24" cy="24" r="4" />
      <circle cx="24" cy="12.5" r="5.5" />
      <circle cx="35" cy="20.5" r="5.5" />
      <circle cx="31" cy="33.5" r="5.5" />
      <circle cx="17" cy="33.5" r="5.5" />
      <circle cx="13" cy="20.5" r="5.5" />
    </>
  ),
  // dois caules entrelaçados
  relacionamentos: (
    <>
      <path d="M17 42 C17 32 31 30 31 20 C31 14 27 11 24 8" />
      <path d="M31 42 C31 32 17 30 17 20 C17 14 21 11 24 8" />
      <path d="M17 24 c-6 0 -9 -5 -9 -8 c6 0 9 4 9 8z" />
      <path d="M31 24 c6 0 9 -5 9 -8 c-6 0 -9 4 -9 8z" />
    </>
  ),
  // semente que rompe e cresce
  crises: (
    <>
      <path d="M8 40 H40" />
      <path d="M24 40 V22" />
      <path d="M24 30 c-8 0 -11 -7 -11 -10 c8 0 11 6 11 10z" />
      <path d="M24 22 c0 -8 5 -12 11 -13 c0 7 -4 12 -11 13z" />
      <path d="M10 14 a14 14 0 0 1 8 -6 M38 30 a14 14 0 0 1 -3 6" />
    </>
  ),
};

interface AreaIconProps {
  id: string;
  className?: string;
}

export const AreaIcon = ({ id, className = '' }: AreaIconProps) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {icons[id]}
  </svg>
);
