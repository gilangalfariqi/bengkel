// Mock data for UI testing and review

export const categories = [
  { id: 1, name: 'Oli & Pelumas', slug: 'oli-pelumas' },
  { id: 2, name: 'Suku Cadang', slug: 'suku-cadang' },
  { id: 3, name: 'Aksesoris', slug: 'aksesoris' },
];

export const products = [
  {
    id: 101,
    name: 'Oli Mesin Sintetis 5W-30 1L',
    slug: 'oli-mesin-sintetis-5w30-1l',
    price: 120000,
    old_price: 150000,
    stock: 24,
    images: ['/images/mock/oli-1.jpg'],
    category_id: 1,
    rating: 4.7,
    description: 'Oli mesin kualitas tinggi untuk performa optimal.',
    is_featured: true,
  },
  {
    id: 102,
    name: 'Filter Oli Mobil Standard',
    slug: 'filter-oli-mobil-standard',
    price: 45000,
    old_price: null,
    stock: 120,
    images: ['/images/mock/filter-1.jpg'],
    category_id: 2,
    rating: 4.3,
    description: 'Filter oli asli, tahan lama dan mudah dipasang.',
    is_featured: false,
  },
  {
    id: 103,
    name: 'Busi Iridium (Set 4)',
    slug: 'busi-iridium-set-4',
    price: 230000,
    old_price: 250000,
    stock: 40,
    images: ['/images/mock/busi-1.jpg'],
    category_id: 2,
    rating: 4.8,
    description: 'Busi iridium untuk pembakaran lebih sempurna.',
    is_featured: true,
  },
  {
    id: 104,
    name: 'Sarung Tangan Mekanik (S)',
    slug: 'sarung-tangan-mekanik-s',
    price: 35000,
    old_price: null,
    stock: 60,
    images: ['/images/mock/glove-1.jpg'],
    category_id: 3,
    rating: 4.1,
    description: 'Sarung tangan anti minyak, nyaman dipakai.',
    is_featured: false,
  },
  {
    id: 105,
    name: 'Lampu LED Headlight H4',
    slug: 'lampu-led-headlight-h4',
    price: 175000,
    old_price: 200000,
    stock: 15,
    images: ['/images/mock/led-1.jpg'],
    category_id: 3,
    rating: 4.5,
    description: 'Lampu LED terang dengan konsumsi daya rendah.',
    is_featured: true,
  },
  {
    id: 106,
    name: 'Kampas Rem Depan',
    slug: 'kampas-rem-depan',
    price: 95000,
    old_price: null,
    stock: 80,
    images: ['/images/mock/brakepad-1.jpg'],
    category_id: 2,
    rating: 4.4,
    description: 'Kampas rem berkualitas, pas untuk banyak tipe mobil.',
    is_featured: false,
  },
];

export const banners = [
  { id: 1, image: '/images/mock/banner-1.jpg', title: 'Servis Musim Promo', link: '/promo' },
  { id: 2, image: '/images/mock/banner-2.jpg', title: 'Diskon Oli 20%', link: '/products?category=1' },
];

export const promotions = [
  {
    id: 'PROMO20',
    code: 'PROMO20',
    discount_percent: 20,
    description: 'Diskon 20% untuk pembelian oli dan aksesori',
    valid_from: '2026-05-01',
    valid_to: '2026-06-30',
  },
  {
    id: 'FREESHIP',
    code: 'FREESHIP',
    discount_percent: 0,
    description: 'Gratis ongkos kirim untuk pembelian di atas Rp200.000',
    valid_from: '2026-05-15',
    valid_to: '2026-07-15',
  },
];

export const orders = [
  {
    id: 9001,
    order_number: 'ORD-20260521-9001',
    customer_name: 'Andi Saputra',
    status: 'delivered',
    total: 295000,
    items: [
      { product_id: 101, name: 'Oli Mesin Sintetis 5W-30 1L', qty: 1, price: 120000 },
      { product_id: 102, name: 'Filter Oli Mobil Standard', qty: 1, price: 45000 },
      { product_id: 106, name: 'Kampas Rem Depan', qty: 1, price: 95000 },
    ],
    ordered_at: '2026-05-21T10:32:00Z',
  },
  {
    id: 9002,
    order_number: 'ORD-20260522-9002',
    customer_name: 'Siti Rahma',
    status: 'processing',
    total: 350000,
    items: [
      { product_id: 103, name: 'Busi Iridium (Set 4)', qty: 1, price: 230000 },
      { product_id: 104, name: 'Sarung Tangan Mekanik (S)', qty: 2, price: 35000 },
    ],
    ordered_at: '2026-05-22T09:05:00Z',
  },
];

const mockData = { categories, products, banners, promotions, orders };
export default mockData;
