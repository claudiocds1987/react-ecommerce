export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  sku: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  thumbnail: string;
  categoryId: number;
  brandId: number;
  images: ProductImage[];
  tags: ProductTag[];
  reviews: ProductReview[];
  finalPrice?: number;
  extraAttributes?: ExtraAttribute[];
  isActive: boolean;
}

export interface ExtraAttribute {
  name: string;
  value: string;
  label: string;
  dataType: 'text' | 'number' | 'boolean';
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  productId: number;
}

export interface ProductTag {
  id: number;
  tagName: string;
  productId: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  userName: string;
  userEmail: string;
  productId: number;
  date?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}
