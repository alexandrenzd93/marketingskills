export const BRANDS = [
  {
    id: 'mtj',
    name: 'My Tailor is Joh',
    desc: 'Paris · Deadstock Haute Couture',
    wall: 'N' as const,
    wallColor: '#101828',
    accentColor: '#3a5090',
    shopifyCollection: 'my-tailor-is-joh',
    link: 'https://bleublancouture.fr/collections/my-tailor-is-joh',
    startAngle: (3 * Math.PI) / 2,
    cameraPosition: [0, 1.8, 8] as [number, number, number],
  },
  {
    id: 'la8',
    name: 'La 8e Fois',
    desc: 'Île-de-France · Fabriqué à Paris 2024',
    wall: 'E' as const,
    wallColor: '#0d2018',
    accentColor: '#4a8860',
    shopifyCollection: 'la-8e-fois',
    link: 'https://bleublancouture.fr/collections/la-8e-fois',
    startAngle: 0,
    cameraPosition: [8, 1.8, 0] as [number, number, number],
  },
  {
    id: 'manoir',
    name: 'Le Manoir à Lingerie',
    desc: 'France · Lingerie Fine',
    wall: 'S' as const,
    wallColor: '#28101a',
    accentColor: '#885060',
    shopifyCollection: 'le-manoir-a-lingerie',
    link: 'https://bleublancouture.fr/collections/le-manoir-a-lingerie',
    startAngle: Math.PI / 2,
    cameraPosition: [0, 1.8, -8] as [number, number, number],
  },
  {
    id: 'teran',
    name: 'Teran Conde Paris',
    desc: 'Paris · Élégance Singulière',
    wall: 'W' as const,
    wallColor: '#1e0e08',
    accentColor: '#8a5030',
    shopifyCollection: 'teran-conde-paris',
    link: 'https://bleublancouture.fr/collections/teran-conde-paris',
    startAngle: Math.PI,
    cameraPosition: [-8, 1.8, 0] as [number, number, number],
  },
] as const;

export type Brand = (typeof BRANDS)[number];
export type BrandId = Brand['id'];
export type WallSide = Brand['wall'];

export const BBC_COLORS = {
  gold: '#C9A96E',
  cream: '#FAF8F5',
  dark: '#0a0806',
  marble: '#EDE5D0',
  wall: '#F2ECE0',
} as const;

export function getBrand(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id);
}
