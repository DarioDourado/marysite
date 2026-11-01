import { Facebook, Globe, Instagram, Linkedin, Twitter, Youtube, type LucideIcon } from 'lucide-react';

export const SOCIAL_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  instagram: { label: 'Instagram', icon: Instagram },
  linkedin: { label: 'LinkedIn', icon: Linkedin },
  facebook: { label: 'Facebook', icon: Facebook },
  youtube: { label: 'YouTube', icon: Youtube },
  twitter: { label: 'X / Twitter', icon: Twitter },
  globe: { label: 'Site / outro', icon: Globe },
};

const ICONS: Array<[RegExp, LucideIcon]> = [
  [/instagram\./i, Instagram],
  [/linkedin\./i, Linkedin],
  [/(facebook|fb)\./i, Facebook],
  [/(youtube\.|youtu\.be)/i, Youtube],
  [/(twitter|x)\.com/i, Twitter],
];

/** Ícone escolhido no CMS; sem escolha deduz-se do endereço e, sem correspondência, usa um globo. */
export const socialIcon = (url: string, icon?: string): LucideIcon =>
  (icon ? SOCIAL_ICONS[icon]?.icon : undefined) ?? ICONS.find(([pattern]) => pattern.test(url))?.[1] ?? Globe;
