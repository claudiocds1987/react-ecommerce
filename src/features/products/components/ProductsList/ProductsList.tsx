import React from "react";
import type { Product } from "@/entities/product";
import { ProductCard } from "../ProductCard";

interface ProductListProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
}

export const ProductsList: React.FC<ProductListProps> = ({
  products,
  onOpenDetail,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        No se encontraron productos disponibles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
};

export default ProductsList;
