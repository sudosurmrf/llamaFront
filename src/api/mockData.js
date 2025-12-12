// Mock data for development - will be replaced by API calls when backend is ready

export const mockCategories = [
  { id: 1, name: 'Cookies', slug: 'cookies', description: 'Freshly baked cookies in various flavors', image: null, order: 1, active: true },
  { id: 2, name: 'Cakes', slug: 'cakes', description: 'Custom cakes for every occasion', image: null, order: 2, active: true },
  { id: 3, name: 'Cupcakes', slug: 'cupcakes', description: 'Delightful mini treats with amazing frosting', image: null, order: 3, active: true },
  { id: 4, name: 'Pastries', slug: 'pastries', description: 'Flaky, buttery pastries made fresh daily', image: null, order: 4, active: true },
  { id: 5, name: 'Breads', slug: 'breads', description: 'Artisan breads baked with love', image: null, order: 5, active: true },
  { id: 6, name: 'Seasonal', slug: 'seasonal', description: 'Limited time seasonal specials', image: null, order: 6, active: true },
];

export const mockProducts = [
  {
    id: 1,
    name: 'Chocolate Chip Cookie',
    slug: 'chocolate-chip-cookie',
    description: 'Classic chocolate chip cookies with premium dark chocolate chunks. Crispy on the outside, chewy on the inside.',
    price: 2.99,
    categoryId: 1,
    images: [],
    featured: true,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Flour, butter, sugar, brown sugar, eggs, vanilla extract, chocolate chips, baking soda, salt',
    nutritionInfo: { calories: 180, fat: 9, carbs: 24, protein: 2 },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Double Fudge Brownie',
    slug: 'double-fudge-brownie',
    description: 'Rich, dense chocolate brownie with a fudgy center and crackly top.',
    price: 3.49,
    categoryId: 1,
    images: [],
    featured: true,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Dark chocolate, butter, sugar, eggs, flour, cocoa powder, vanilla extract',
    nutritionInfo: { calories: 280, fat: 14, carbs: 36, protein: 4 },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'Red Velvet Cupcake',
    slug: 'red-velvet-cupcake',
    description: 'Moist red velvet cupcake topped with smooth cream cheese frosting.',
    price: 4.49,
    categoryId: 3,
    images: [],
    featured: true,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Flour, cocoa, buttermilk, eggs, butter, sugar, red food coloring, cream cheese, powdered sugar',
    nutritionInfo: { calories: 320, fat: 16, carbs: 42, protein: 4 },
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 4,
    name: 'Birthday Celebration Cake',
    slug: 'birthday-celebration-cake',
    description: 'Colorful vanilla cake with buttercream frosting and rainbow sprinkles. Perfect for celebrations!',
    price: 45.00,
    categoryId: 2,
    images: [],
    featured: true,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Flour, sugar, butter, eggs, vanilla, milk, buttercream frosting, sprinkles',
    nutritionInfo: { calories: 450, fat: 22, carbs: 58, protein: 5 },
    servings: '8-12',
    createdAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 5,
    name: 'Cinnamon Roll',
    slug: 'cinnamon-roll',
    description: 'Soft, fluffy cinnamon roll with sweet cream cheese glaze.',
    price: 4.99,
    categoryId: 4,
    images: [],
    featured: false,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Flour, yeast, milk, butter, sugar, cinnamon, cream cheese, powdered sugar',
    nutritionInfo: { calories: 420, fat: 18, carbs: 58, protein: 6 },
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 6,
    name: 'Sourdough Loaf',
    slug: 'sourdough-loaf',
    description: 'Artisan sourdough bread with a crispy crust and tangy, chewy interior.',
    price: 7.99,
    categoryId: 5,
    images: [],
    featured: false,
    active: true,
    allergens: ['wheat'],
    ingredients: 'Flour, water, salt, sourdough starter',
    nutritionInfo: { calories: 120, fat: 0.5, carbs: 24, protein: 4 },
    createdAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 7,
    name: 'Pumpkin Spice Cookie',
    slug: 'pumpkin-spice-cookie',
    description: 'Seasonal favorite! Soft pumpkin cookies with warm fall spices and cream cheese frosting.',
    price: 3.49,
    categoryId: 6,
    images: [],
    featured: true,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Flour, pumpkin puree, butter, sugar, eggs, cinnamon, nutmeg, ginger, cloves, cream cheese frosting',
    nutritionInfo: { calories: 220, fat: 10, carbs: 30, protein: 3 },
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 8,
    name: 'Croissant',
    slug: 'croissant',
    description: 'Buttery, flaky French croissant with golden layers.',
    price: 3.99,
    categoryId: 4,
    images: [],
    featured: false,
    active: true,
    allergens: ['wheat', 'eggs', 'dairy'],
    ingredients: 'Flour, butter, milk, yeast, sugar, salt, eggs',
    nutritionInfo: { calories: 270, fat: 14, carbs: 31, protein: 5 },
    createdAt: '2024-01-21T10:00:00Z',
  },
];

export const mockSpecials = [
  {
    id: 1,
    name: 'Cookie of the Month',
    description: 'Get our featured cookie flavor at 20% off all month long!',
    type: 'discount_percentage',
    value: 20,
    productIds: [1],
    categoryIds: [],
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    active: true,
    minPurchase: null,
    maxUses: null,
    usedCount: 45,
    code: null,
    image: null,
  },
  {
    id: 2,
    name: 'Baker\'s Dozen',
    description: 'Buy 12 cookies, get 1 free! Perfect for sharing.',
    type: 'buy_x_get_y',
    value: { buyQuantity: 12, getQuantity: 1 },
    productIds: [],
    categoryIds: [1],
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    active: true,
    minPurchase: null,
    maxUses: null,
    usedCount: 120,
    code: null,
    image: null,
  },
  {
    id: 3,
    name: 'Weekend Brunch Bundle',
    description: '$5 off when you buy any pastry and bread together.',
    type: 'bundle_discount',
    value: 5,
    productIds: [],
    categoryIds: [4, 5],
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    active: true,
    minPurchase: 15,
    maxUses: null,
    usedCount: 78,
    code: 'BRUNCH5',
    image: null,
  },
];

export const mockPromotions = [
  {
    id: 1,
    name: 'Grand Opening Sale',
    title: 'Welcome to Llama Treats!',
    subtitle: '15% off your first order',
    description: 'Use code WELCOME15 at checkout to receive 15% off your entire first order.',
    buttonText: 'Shop Now',
    buttonLink: '/menu',
    image: null,
    backgroundColor: '#FDF2F8',
    textColor: '#831843',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    active: true,
    displayLocation: 'homepage_hero',
    order: 1,
  },
  {
    id: 2,
    name: 'Valentine\'s Day Special',
    title: 'Share the Love',
    subtitle: 'Heart-shaped treats for your sweetheart',
    description: 'Order our limited edition Valentine\'s Day collection. Pre-orders open now!',
    buttonText: 'Pre-Order',
    buttonLink: '/menu?category=seasonal',
    image: null,
    backgroundColor: '#FEE2E2',
    textColor: '#991B1B',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-14T23:59:59Z',
    active: true,
    displayLocation: 'homepage_hero',
    order: 2,
  },
  {
    id: 3,
    name: 'Free Delivery',
    title: 'Free Local Delivery',
    subtitle: 'On orders over $35',
    description: 'Enjoy free delivery on all orders over $35 within 10 miles of our bakery.',
    buttonText: 'Learn More',
    buttonLink: '/delivery',
    image: null,
    backgroundColor: '#ECFDF5',
    textColor: '#065F46',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    active: true,
    displayLocation: 'homepage_banner',
    order: 1,
  },
];

export const mockBanners = [
  {
    id: 1,
    title: 'New Hours!',
    message: 'We\'re now open Sundays from 8am to 2pm. Come visit us!',
    type: 'info',
    dismissible: true,
    active: true,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-02-28T23:59:59Z',
    displayLocation: 'site_wide',
    link: null,
    linkText: null,
  },
  {
    id: 2,
    title: 'Holiday Pre-Orders',
    message: 'Pre-order your holiday treats by December 20th to guarantee availability!',
    type: 'warning',
    dismissible: false,
    active: false,
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-20T23:59:59Z',
    displayLocation: 'site_wide',
    link: '/contact',
    linkText: 'Contact Us',
  },
];

// Helper functions to simulate API behavior
export const getMockProductsByCategory = (categoryId) => {
  return mockProducts.filter((p) => p.categoryId === categoryId && p.active);
};

export const getMockFeaturedProducts = () => {
  return mockProducts.filter((p) => p.featured && p.active);
};

export const getMockActiveSpecials = () => {
  const now = new Date();
  return mockSpecials.filter((s) => {
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);
    return s.active && now >= start && now <= end;
  });
};

export const getMockActivePromotions = () => {
  const now = new Date();
  return mockPromotions.filter((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return p.active && now >= start && now <= end;
  });
};

export const getMockActiveBanners = () => {
  const now = new Date();
  return mockBanners.filter((b) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    return b.active && now >= start && now <= end;
  });
};
