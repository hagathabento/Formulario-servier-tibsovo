import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Formulário Tibsovo',
    short_name: 'Tibsovo',
    description: 'Formulário Educacional Interativo Tibsovo',
    start_url: '/',
    display: 'standalone',
    background_color: '#4B2C78',
    theme_color: '#4B2C78',
    orientation: 'portrait',
    icons: [
      {
        src: '/servier.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
