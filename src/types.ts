export interface ProductSpecs {
  weight?: number;
  dimensions?: string;
  origin?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string; // 'Amatistas', 'Agatas', 'Cuarzos', 'Accesorios'
  images: string[];
  specs: ProductSpecs;
  tags: string[]; // 'Protección', 'Calma', etc.
  stock: number;
  visible: boolean;
  isNew?: boolean;
  type?: string; // 'Catedral', 'Drusa', 'Geoda', 'Obelisco'
}

export interface Tip {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML-like string
  image: string;
  date: string;
  tags: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  image: string;
  price: number;
  type: 'product' | 'tip';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PaginatedResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}
