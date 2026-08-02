import { Category, Color, Product, Size } from '../types';

export declare function getSizes(): Promise<Size[]>;
export declare function getSize(id: string | number): Promise<Size>;
export declare function getCategories(): Promise<Category[]>;
export declare function getCategory(id: string | number): Promise<Category>;
export declare function getProducts(): Promise<Product[]>;
export declare function getProduct(id: string | number): Promise<Product>;
export declare function getProductColor(
  productID: string | number,
  colorID: string | number,
): Promise<Color>;
