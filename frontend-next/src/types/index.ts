// Media Types
export interface MediaItem {
  url: string;
  publicId: string;
  type: 'image' | 'video';
}

// Product Types
export interface Product {
  _id?: string; // MongoDB ID
  id: string | number;
  name: string;
  price: number;
  image: string; // Mantido para compatibilidade (fallback)
  images?: MediaItem[]; // Array de imagens
  video?: MediaItem; // Vídeo opcional
  discountPercentage?: number;
  sizes?: string[];
  team?: string;
  category?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

// User/Auth Types
export interface User {
  token: string | null;
  isAuthenticated: boolean;
}

// Context Types
export interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: Product & { size: string }) => void;
  removeFromCart: (id: string | number, size: string) => void;
  updateQuantity: (id: string | number, size: string, quantity: number) => void;
  clearCart: () => void;
}

export interface AuthContextType {
  user: User;
  login: (token: string) => void;
  logout: () => void;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
}

export interface ProductGridProps {
  products: Product[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
