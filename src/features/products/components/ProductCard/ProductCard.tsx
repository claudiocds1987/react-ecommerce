import type { Product } from "@/entities";
import React from "react";
import { Link } from "react-router-dom";
// Ajusta estas rutas según la estructura de carpetas de tu proyecto en React

//import { useCart } from "@/features/checkout/services/cart-service"; // Hook personalizado de carrito en React
//import { useToast } from "@/shared/services/toast-service"; // Hook personalizado de notificaciones

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void; // Función para disparar el modal desde el componente padre o local
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
}) => {
  //const cartService = useCart();
  //const toast = useToast();

  /*  const handleAddToCart = (prod: Product) => {
    
    // Si tu servicio de carrito maneja la validación de duplicados internamente:
    const isRepeated = cartService.checkItemsRepeated(prod.id);
    if (isRepeated) {
      toast.show("El producto ya esta en el carrito", "warning");
      return;
    }
    cartService.addToCart(prod);
    toast.show("El producto se agregó al carrito", "success");
  }; */

  // Función auxiliar para formatear moneda en React (reemplaza a CurrencyPipe)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS", // Cambia a tu moneda local si es necesario
    }).format(value);
  };

  return (
    <article className="fade-in-fwd glass-shine group relative flex h-125 w-full flex-col rounded-2xl border border-slate-200/50 bg-linear-to-b from-white/80 to-slate-50/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-400/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Badge de stock */}
      <span className="absolute top-3 right-3 z-20 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold tracking-widest text-green-600 uppercase shadow-sm backdrop-blur-sm">
        EN STOCK: {product.stock}
      </span>

      {/* Imagen con enlace de React Router */}
      <Link
        to={`/product/${product.id}`}
        className="relative z-10 aspect-square w-full overflow-hidden rounded-xl bg-slate-100 block"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="relative z-10 mt-4 flex grow flex-col">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Producto
        </span>

        <h3 className="mt-1 line-clamp-2 text-sm leading-tight font-bold text-slate-900">
          <Link
            to={`/product/${product.id}`}
            className="transition-colors hover:text-blue-600"
          >
            {product.title}
          </Link>
        </h3>

        {/* Botón para abrir el Modal de detalles */}
        <button
          onClick={() => onOpenDetail(product)}
          className="mt-2 inline-flex items-center text-[10px] font-extrabold tracking-tighter text-blue-500 uppercase transition-all hover:translate-x-1 hover:text-blue-700 text-left"
        >
          Ver detalle
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Precios (Equivalente al @if / @else de Angular) */}
        <div className="mt-auto">
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <>
              <span className="mb-0.5 block text-[10px] font-bold text-slate-400">
                Antes:{" "}
                <span className="line-through">
                  {formatCurrency(product.price)}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <data
                  value={product.finalPrice}
                  className="block text-3xl font-bold tracking-tight text-slate-800"
                >
                  {formatCurrency(
                    product.finalPrice ? product.finalPrice : product.price,
                  )}
                </data>
                <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-black text-green-600 shadow-sm">
                  {product.discountPercentage}% DESC
                </span>
              </div>
            </>
          ) : (
            <data
              value={product.price}
              className="block text-3xl font-black tracking-tight text-blue-600"
            >
              {formatCurrency(product.price)}
            </data>
          )}
        </div>
      </div>

      {/* Footer con botón de agregar al carrito */}
      <footer className="relative z-20 mt-5">
        {/* <Button
          variant="primary"

          disabled={product.stock === 0}
          onClick={() => handleAddToCart(product)}
        /> */}
      </footer>
    </article>
  );
};
