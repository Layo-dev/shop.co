export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  story: string;
  category: 'luxury' | 'contemporary' | 'emerging';
  founded: number;
  origin: string;
  productCount: number;
  website: string;
  values: string[];
  isSpotlighted?: boolean;
}

export const brands: Brand[] = [
  {
    id: 'versace',
    name: 'VERSACE',
    logo: '/placeholder.svg',
    description: 'Italian luxury fashion company and trade name founded by Gianni Versace in 1978.',
    story: 'Known for flashy prints and bright colors, Versace has become synonymous with Italian glamour and luxury. The brand represents the pinnacle of Italian craftsmanship and bold design.',
    category: 'luxury',
    founded: 1978,
    origin: 'Italy',
    productCount: 342,
    website: 'https://versace.com',
    values: ['Italian Craftsmanship', 'Bold Design', 'Luxury'],
    isSpotlighted: true
  },
  {
    id: 'gucci',
    name: 'GUCCI',
    logo: '/placeholder.svg',
    description: 'Italian luxury fashion house known for leather goods, ready-to-wear, and accessories.',
    story: 'Founded in Florence in 1921, Gucci has evolved from a small leather goods company to a global luxury brand, blending tradition with contemporary innovation.',
    category: 'luxury',
    founded: 1921,
    origin: 'Italy',
    productCount: 456,
    website: 'https://gucci.com',
    values: ['Heritage', 'Innovation', 'Sustainability']
  },
  {
    id: 'prada',
    name: 'PRADA',
    logo: '/placeholder.svg',
    description: 'Italian luxury fashion house specializing in leather handbags, travel accessories, shoes, ready-to-wear, and other fashion accessories.',
    story: 'Founded in 1913 by Mario Prada, the brand has maintained its reputation for exceptional quality and innovative design while staying true to its Italian heritage.',
    category: 'luxury',
    founded: 1913,
    origin: 'Italy',
    productCount: 289,
    website: 'https://prada.com',
    values: ['Quality', 'Innovation', 'Timeless Design']
  },
  {
    id: 'calvin-klein',
    name: 'Calvin Klein',
    logo: '/placeholder.svg',
    description: 'American fashion house known for its minimalist aesthetic and clean lines.',
    story: 'Established in 1968, Calvin Klein revolutionized American fashion with its modern, sophisticated, and often provocative designs that emphasize simplicity and sensuality.',
    category: 'contemporary',
    founded: 1968,
    origin: 'United States',
    productCount: 523,
    website: 'https://calvinklein.com',
    values: ['Minimalism', 'Modernity', 'Sophistication']
  },
  {
    id: 'zara',
    name: 'ZARA',
    logo: '/placeholder.svg',
    description: 'Spanish fast fashion retailer known for trendy designs at accessible prices.',
    story: 'Founded in 1975, Zara has revolutionized fast fashion by bringing runway trends to the masses quickly and affordably, while maintaining quality and style.',
    category: 'contemporary',
    founded: 1975,
    origin: 'Spain',
    productCount: 1234,
    website: 'https://zara.com',
    values: ['Accessibility', 'Trend-Forward', 'Fast Fashion']
  }
];

export const brandCategories = [
  { id: 'all', name: 'All Brands', count: brands.length },
  { id: 'luxury', name: 'Luxury Fashion', count: brands.filter(b => b.category === 'luxury').length },
  { id: 'contemporary', name: 'Contemporary', count: brands.filter(b => b.category === 'contemporary').length },
  { id: 'emerging', name: 'Emerging Brands', count: brands.filter(b => b.category === 'emerging').length }
];

export const getBrandsByCategory = (category: string) => {
  if (category === 'all') return brands;
  return brands.filter(brand => brand.category === category);
};

export const getSpotlightBrand = () => {
  return brands.find(brand => brand.isSpotlighted) || brands[0];
};