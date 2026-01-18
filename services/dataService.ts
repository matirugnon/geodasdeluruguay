import { Product, Tip } from '../types';

const PRODUCTS_KEY = 'geodas_products';
const TIPS_KEY = 'geodas_tips';
const AUTH_KEY = 'geodas_auth';

// Master List of Categories
export const PRODUCT_CATEGORIES = [
    'Collares', 
    'Anillos', 
    'Brazaletes', 
    'Piedras', 
    'Otros Accesorios'
];

// Initial Mock Data with Updated Categories
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Geoda Catedral #42',
    description: 'Extraída de las profundidades del suelo de Artigas, esta pieza cuenta una historia de millones de años.',
    price: 4500,
    category: 'Piedras',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCs51rpTI4GIA2atJxMreXDCw6ltculOmzdcaDyVqzcWN8ywCHuhkA3Pj3LRofBYe_6GJricPrssBHJdWjYbeBY-ZLLhfQeylXcVCHDfV5CBq9rS8P5X-gWviHtTvyvzC-JVCVQxl047YfdVx4ee0aTGqKl5JNB03YGz8pDVoaY5qPP9Njkrbj3cBx7lbNtS85fiSsTYOzZyvPSItUgy7kQ91CNuAgfc6NLQ4spnuaetRILU4xIgEwbnQaqzrWAOY4L2Pq56mXNRQdD'],
    specs: { weight: 4500, dimensions: '20x15x10 cm', origin: 'Artigas, Uruguay' },
    tags: ['Protección', 'Calma'],
    stock: 1,
    visible: true,
    isNew: true,
    type: 'Catedral'
  },
  {
    id: '2',
    title: 'Collar Drusa Amatista',
    description: 'Energía concentrada en pequeño formato para llevar cerca del corazón.',
    price: 1200,
    category: 'Collares',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDcm0KWIwELayMnFdk7DB7GRMQM_66UW97KdiJp3_gCOhI6g-TNxupr5Rct7JYNeMEEn0hnBjGKHfN3e2Mrov3X5cB5WOKsR3uTKtviWcgsyDKIUCe1dJXz-QHqpf3j1vY2nDHyvVP5U0M_vzhlWTAGUos7mvuine_6PDuuMUfHXctGkB08Yuly-hkRT5_DL4RlWki-IQEJeXYFc4Oi_T1qxM9MEmys1CcFR6OoLPCFBy6Z7i0KKVJKcGw88zKeEPpMNewbWFKO-H8g'],
    specs: { weight: 20, dimensions: '3cm', origin: 'Artigas, Uruguay' },
    tags: ['Claridad'],
    stock: 12,
    visible: true,
    type: 'Collar'
  },
  {
    id: '3',
    title: 'Anillo de Oro con Citrino',
    description: 'Diseño único en oro y plata con citrino en bruto.',
    price: 2900,
    category: 'Anillos',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDEftD6U86_aHd85S4nLRDM3MaX8t8TXpzInkDJpr5OvF4K0iifelTx4gcSDX7IyVSX3FPI20IkA2IZ-3xKOPh9r9x8Jm8bFcEQsQGxIAdFZ1AqghRk-iE5HydGmpBR5vs0Eg6DTcBemE_odFFPoO6DD7G1x4-AL4fIVd_M1yI57dWLUrFeazOfUhs4vKCQFsTicW7rRcbmu9x4SAA0ekv2PWg0fcTt_8I87895TlRcpAjfGBn79-0BqI_dvHYsZVMcv9ucu9BrpmaF'],
    specs: { weight: 8, dimensions: 'Talla 16', origin: 'Artigas, Uruguay' },
    tags: ['Energía', 'Enfoque'],
    stock: 4,
    visible: true,
    type: 'Anillo'
  },
  {
    id: '4',
    title: 'Cuarzo Cristal Puro',
    description: 'Sanador maestro. Amplifica la energía y el pensamiento.',
    price: 1890,
    category: 'Piedras',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAHDiEAS4vNW1Wu5JHxUc_T4upeEbcxctnpJ4Qzg7eODjj5B6LN_QznTXQHsZVMrXnxLcAAiPr7znfOytuU6HNVmp_DtSxZ2FA0bTt6wubULfAYkQX--LubKv4ZZACBDRYX0RF7nCuY6S6wRfCTL7K3Vw9Jz4yZVuP9OpPRQAnDa9pNsJRoKlem4gASukMoU2khNET2KK3kTkd6GSB65YAGu4xRLy2i5wDnJvoTX65HMx0eGfhCDOfbVAczPPd7frlFC8vrA_BqSo5f'],
    specs: { weight: 600, dimensions: '10x10 cm', origin: 'Artigas, Uruguay' },
    tags: ['Sanación'],
    stock: 2,
    visible: true,
    type: 'Drusa'
  }
];

const INITIAL_TIPS: Tip[] = [
  {
    id: '1',
    title: 'Cómo limpiar tu Amatista',
    excerpt: 'El agua y la luna son elementos clave para purificar la energía acumulada.',
    content: 'Coloca tu amatista bajo la luz de la luna llena...',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7A5MQW_pef2MMdFqyZzDoT_QHkt4NArz2jlleBW4bKlMildZNUsm9-Ng-2k35vJ04uE0bZZUaEkCYPNgCYBjV2lERZgK1ZEoRxdALKUSBtSiF3kD8a2WrWpf2X7jSLA3mg2gltle5wPNgKV2pl6xez_epG6r1xTZshTyr8tHKNlDNoYnzwQ7lpM6z0yOOll9WpA6aNIK5Pb5c7uBLCcRpgWn2nX8hAgvphBmuVNvmCXIPo5XvfZ4doT0fDceGDfhlj1nuMJ94fbgi',
    date: '10 Oct 2023',
    tags: ['Rituales', 'Limpieza']
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  // --- Products ---

  // Get ALL products (including hidden ones, for Admin)
  async getProducts(): Promise<Product[]> {
    await delay(300);
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    // Allow seeing hidden products via direct link if needed, or filter here if strict
    return products.find(p => p.id === id);
  },

  // Get ONLY visible products for a category (For Shop)
  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase() && p.visible);
  },

  async saveProduct(product: Product): Promise<void> {
    await delay(300);
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const newProducts = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
  },

  async toggleProductVisibility(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.visible = !product.visible;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      return product.visible;
    }
    return false;
  },

  // --- Search ---

  async search(query: string): Promise<Product[]> {
    if (!query) return [];
    const products = await this.getProducts();
    const lowerQuery = query.toLowerCase();
    // Filter visible products that match title, desc or tags
    return products.filter(p => 
      p.visible && (
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
    );
  },

  // --- Tips ---

  async getTips(): Promise<Tip[]> {
    await delay(200);
    const stored = localStorage.getItem(TIPS_KEY);
    if (!stored) {
      localStorage.setItem(TIPS_KEY, JSON.stringify(INITIAL_TIPS));
      return INITIAL_TIPS;
    }
    return JSON.parse(stored);
  },

  async saveTip(tip: Tip): Promise<void> {
    await delay(300);
    const tips = await this.getTips();
    const index = tips.findIndex(t => t.id === tip.id);
    if (index >= 0) {
      tips[index] = tip;
    } else {
      tips.push(tip);
    }
    localStorage.setItem(TIPS_KEY, JSON.stringify(tips));
  },

  async deleteTip(id: string): Promise<void> {
    await delay(200);
    const tips = await this.getTips();
    const newTips = tips.filter(t => t.id !== id);
    localStorage.setItem(TIPS_KEY, JSON.stringify(newTips));
  },

  // --- Auth (Admin) ---

  isAdmin(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  login(password: string): boolean {
    // Simple mock password
    if (password === 'admin123') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
};