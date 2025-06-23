//src/types/product.ts

export interface Product {
    id?: string; // 可選，因為新增時沒有
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive: boolean;
  }