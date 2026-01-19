import { Product, Tip } from '../types';

// En producción, vercel.json redirige /api a Render backend
// En desarrollo, vite.config.ts hace proxy a localhost:5000
const API_URL = '/api';

// Master List of Categories
export const PRODUCT_CATEGORIES = [
  'Collares',
  'Anillos',
  'Brazaletes',
  'Piedras',
  'Otros Accesorios'
];

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('geodas_auth');

// Helper to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  return fetch(url, { ...options, headers });
};

export const dataService = {
  // --- Products ---

  // Get ALL products (including hidden ones, for Admin)
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/admin`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        console.error('Error fetching products:', response.statusText);
        return [];
      }

      const products = await response.json();
      // Mapear _id de MongoDB a id para el frontend
      return products.map((p: any) => ({ ...p, id: p._id }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) return undefined;
      const product = await response.json();
      // Mapear _id de MongoDB a id para el frontend
      return { ...product, id: product._id };
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  },

  // Get ONLY visible products for a category (For Shop)
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) return [];

      const products = await response.json();
      // Mapear _id de MongoDB a id para el frontend
      return products
        .map((p: any) => ({ ...p, id: p._id }))
        .filter((p: Product) =>
          p.category.toLowerCase() === category.toLowerCase() && p.visible
        );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  async saveProduct(product: Product): Promise<void> {
    try {
      // Validar si es un ObjectId válido de MongoDB (24 caracteres hexadecimales)
      const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
      const isUpdate = product.id && isValidObjectId(product.id);
      
      const url = isUpdate
        ? `${API_URL}/products/${product.id}`
        : `${API_URL}/products`;

      const method = isUpdate ? 'PUT' : 'POST';

      // Crear una copia del producto sin el campo 'id' para creación
      const productData = { ...product };
      if (!isUpdate) {
        delete productData.id; // MongoDB genera su propio _id
      }

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to save product: ${error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetchWithAuth(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async toggleProductVisibility(id: string): Promise<boolean> {
    try {
      const product = await this.getProductById(id);
      if (!product) return false;

      product.visible = !product.visible;
      await this.saveProduct(product);
      return product.visible;
    } catch (error) {
      console.error('Error toggling visibility:', error);
      return false;
    }
  },

  // --- Search ---

  async search(query: string): Promise<Product[]> {
    if (!query) return [];

    try {
      const response = await fetch(`${API_URL}/products?keyword=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      const products = await response.json();
      // Mapear _id de MongoDB a id para el frontend
      return products.map((p: any) => ({ ...p, id: p._id }));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // --- Tips ---

  async getTips(): Promise<Tip[]> {
    try {
      const response = await fetch(`${API_URL}/tips`);
      if (!response.ok) return [];
      const tips = await response.json();
      // Mapear _id de MongoDB a id para el frontend
      return tips.map((t: any) => ({ ...t, id: t._id }));
    } catch (error) {
      console.error('Error fetching tips:', error);
      return [];
    }
  },

  async getTipById(id: string): Promise<Tip | null> {
    try {
      const response = await fetch(`${API_URL}/tips/${id}`);
      if (!response.ok) return null;
      const tip = await response.json();
      // Mapear _id de MongoDB a id y asegurar slug
      return { ...tip, id: tip._id, slug: tip.slug || tip._id };
    } catch (error) {
      console.error('Error fetching tip:', error);
      return null;
    }
  },

  async saveTip(tip: Tip): Promise<void> {
    try {
      // Si tiene _id de MongoDB, usar ese; si no, verificar si tiene id que no sea vacío
      const tipId = (tip as any)._id || (tip.id && tip.id !== '' ? tip.id : null);
      const isUpdate = !!tipId;
      
      const url = isUpdate
        ? `${API_URL}/tips/${tipId}`
        : `${API_URL}/tips`;

      const method = isUpdate ? 'PUT' : 'POST';

      // Crear una copia del tip sin el id local si estamos creando uno nuevo
      const tipData = { ...tip };
      if (!isUpdate) {
        delete (tipData as any).id;
      }

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(tipData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to save tip');
      }
    } catch (error) {
      console.error('Error saving tip:', error);
      throw error;
    }
  },

  async deleteTip(id: string): Promise<void> {
    try {
      const response = await fetchWithAuth(`${API_URL}/tips/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete tip');
      }
    } catch (error) {
      console.error('Error deleting tip:', error);
      throw error;
    }
  },

  // --- Auth (Admin) ---

  isAdmin(): boolean {
    const token = getAuthToken();
    if (!token) return false;

    // Check for valid JWT structure (3 parts separated by dots)
    const isJWT = token.split('.').length === 3;

    if (!isJWT && (token === 'true' || token !== '')) {
      console.warn('Legacy or invalid token detected, clearing...');
      this.logout();
      return false;
    }

    return isJWT;
  },

  login(password: string): boolean {
    // This method is now deprecated, use LoginModal with JWT instead
    console.warn('dataService.login is deprecated, use JWT login instead');
    return false;
  },

  logout(): void {
    localStorage.removeItem('geodas_auth');
    localStorage.removeItem('isStaff'); // Limpiar banners legacy
    localStorage.removeItem('isAdmin');
  }
};