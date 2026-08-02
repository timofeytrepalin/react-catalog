export interface Size {
  id: number;
  name: string;
  number: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  images: string[];
  price: string;
  description: string;
  sizes: number[];
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  brand: string;
  colors: Color[];
}

export interface CartItem {
  key: string;
  productId: number;
  productName: string;
  brand: string;
  colorName: string;
  sizeName: string;
  price: number;
  image: string;
  quantity: number;
}
