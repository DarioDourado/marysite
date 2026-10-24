import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CmsImage } from './CmsImage.tsx';
import { node, page, renderWithCms, section } from '@/src/test/harness.tsx';

const withImage = (srcset: string | null) =>
  [page('home', [section('hero', [node('photo', 'image', {
    image: { id: 'i1', url: '/media/a.webp', alt: 'Foto', width: 2400, height: 1600, srcset },
  })])])];

const SRCSET = '/media/a-480.webp 480w, /media/a-960.webp 960w, /media/a.webp 2400w';

describe('CmsImage', () => {
  it('uses the width variants, intrinsic size and the sizes the caller declares', () => {
    renderWithCms(<CmsImage path="hero.photo" fallback="/img/x.webp" alt="Foto" sizes="256px" />, { pages: withImage(SRCSET) });
    const img = screen.getByAltText('Foto');
    expect(img).toHaveAttribute('src', '/media/a.webp');
    expect(img).toHaveAttribute('srcset', SRCSET);
    expect(img).toHaveAttribute('sizes', '256px');
    expect(img).toHaveAttribute('width', '2400');
    expect(img).toHaveAttribute('height', '1600');
  });

  it('images without variants render a plain src', () => {
    renderWithCms(<CmsImage path="hero.photo" fallback="/img/x.webp" alt="Foto" sizes="256px" />, { pages: withImage(null) });
    const img = screen.getByAltText('Foto');
    expect(img).not.toHaveAttribute('srcset');
    expect(img).not.toHaveAttribute('sizes');
  });

  it('drops the variants first when one fails to load, then the original', () => {
    renderWithCms(<CmsImage path="hero.photo" fallback="/img/x.webp" alt="Foto" />, { pages: withImage(SRCSET) });
    fireEvent.error(screen.getByAltText('Foto'));
    expect(screen.getByAltText('Foto')).not.toHaveAttribute('srcset');
    expect(screen.getByAltText('Foto')).toHaveAttribute('src', '/media/a.webp');
  });
});
