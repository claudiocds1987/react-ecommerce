import React, { useState } from "react";
import type { Product } from "@/entities/product";
import { useGetProductByIdQuery } from "../../slices/productsApi";

interface ProductDetailProps {
  productId: number;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  onClose,
}) => {
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);

  // Solución al error de useEffect: En lugar de un useEffect para actualizar el estado,
  // podemos usar un estado local para la imagen seleccionada y sincronizarlo cuando cambie el producto
  // usando el ID del producto como clave, o simplemente inicializarlo de forma segura.
  // Una manera limpia en React es almacenar la imagen seleccionada o usar el thumbnail del producto por defecto
  // si no se ha seleccionado otra, o guardar el ID del producto anterior en el estado.
  const [selectedImageState, setSelectedImageState] = useState<string | null>(
    null,
  );
  const [isTechExpanded, setIsTechExpanded] = useState<boolean>(true);

  // La imagen actual a mostrar: la que el usuario seleccionó o el thumbnail del producto cargado
  const selectedImage = selectedImageState ?? product?.thumbnail ?? "";

  const handleAddToCart = (prod: Product) => {
    if (prod.id === undefined) return;
    console.log("Agregando al carrito:", prod);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-125 flex-col items-center justify-center space-y-4 bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full bg-white/80 p-2 text-gray-400 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500 cursor-pointer"
          aria-label="Cerrar detalle"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-b-blue-600"></div>
        <p className="animate-pulse font-medium text-gray-400">
          Cargando detalles del producto...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative flex min-h-125 flex-col items-center justify-center space-y-4 bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full bg-white/80 p-2 text-gray-400 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500 cursor-pointer"
          aria-label="Cerrar detalle"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="font-medium text-red-500">
          Hubo un error al cargar el producto o el producto no existe.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-white/80 p-2 text-gray-400 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500 cursor-pointer"
        aria-label="Cerrar detalle"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <article className="relative bg-white p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-10 p-4 lg:grid-cols-2">
          {/* Sección de Imágenes */}
          <section className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-inner flex items-center justify-center">
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 z-10 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              <img
                src={selectedImage}
                alt={product.title}
                className="h-full w-full object-contain p-8"
              />
            </div>

            {/* Galería de miniaturas (Tipado explícito de imgObj como string o { imageUrl: string }) */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map(
                  (imgObj: string | { imageUrl: string }, index: number) => {
                    const imgUrl =
                      typeof imgObj === "string" ? imgObj : imgObj.imageUrl;
                    const isSelected = selectedImage === imgUrl;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImageState(imgUrl)}
                        className={`aspect-square overflow-hidden rounded-xl border bg-gray-50 shadow-sm transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer ${
                          isSelected ? "border-blue-500" : "border-gray-100"
                        }`}
                        aria-label="Ver imagen del producto"
                      >
                        <img
                          src={imgUrl}
                          className="pointer-events-none h-full w-full object-cover"
                          alt={`${product.title || "Producto"} - Vista ${index + 1}`}
                        />
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </section>

          {/* Sección de Información */}
          <section className="flex flex-col">
            <header className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                  {product.brandId || "Sin Marca"}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-3xl leading-tight font-black text-gray-900 lg:text-4xl">
                {product.title}
              </h1>

              <p className="text-xs font-bold tracking-tighter text-gray-400 uppercase">
                Categoría: {product.categoryId || "Sin Categoría"}
              </p>

              <div className="mt-2 flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 stroke-current ${
                        star <= (product.rating || 0)
                          ? "fill-current"
                          : "fill-none"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-500">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </header>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <div className="relative z-10">
                {product.discountPercentage &&
                product.discountPercentage > 0 ? (
                  <>
                    <p className="mb-1 text-sm font-medium text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <p className="text-3xl font-black tracking-tighter text-blue-600 sm:text-4xl md:text-5xl">
                        {formatCurrency(product.finalPrice || product.price)}
                      </p>
                      <span className="text-sm font-bold whitespace-nowrap text-green-600">
                        Envío Gratis
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 flex flex-wrap items-baseline gap-3">
                    <p className="text-3xl font-black tracking-tighter text-blue-600 sm:text-4xl md:text-5xl">
                      {formatCurrency(product.price)}
                    </p>
                    <span className="text-sm font-bold whitespace-nowrap text-green-600">
                      Envío Gratis
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Disponibilidad
                </p>
                <p
                  className={`text-sm font-bold ${(product.stock || 0) > 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {product.stock} unidades ({product.availabilityStatus})
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Garantía
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {product.warrantyInformation}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-sm font-black tracking-widest text-gray-900 uppercase">
                Descripción
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="mt-auto flex space-x-4 pt-8">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-medium text-white hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                Agregar al carrito
              </button>
            </div>

            <p className="mt-4 text-center text-xs font-medium text-gray-400 italic">
              * {product.returnPolicy} - {product.shippingInformation}
            </p>
          </section>
        </div>

        {/* Características Técnicas (Tipado explícito de attr) */}
        {product.extraAttributes && product.extraAttributes.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
            <button
              type="button"
              onClick={() => setIsTechExpanded(!isTechExpanded)}
              className="flex h-14 w-full items-center justify-between px-6 text-base font-bold tracking-tight text-slate-800 transition-colors hover:bg-gray-50/50 cursor-pointer"
            >
              <span className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-800">
                <svg
                  className="h-5 w-5 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Características Técnicas
              </span>
              <span className="text-gray-400 text-sm">
                {isTechExpanded ? "▲" : "▼"}
              </span>
            </button>

            {isTechExpanded && (
              <div className="mt-2 divide-y divide-gray-100 border-t border-gray-50 px-6 pb-4">
                {product.extraAttributes.map(
                  (attr: { name: string; value: string }, idx: number) => {
                    const lowerVal = attr.value ? attr.value.toLowerCase() : "";
                    const formattedValue =
                      lowerVal === "true"
                        ? "Si"
                        : lowerVal === "false"
                          ? "No"
                          : attr.value;

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3.5 text-sm transition-colors hover:bg-slate-50/50"
                      >
                        <span className="font-medium tracking-wide text-slate-500">
                          {attr.name}
                        </span>
                        <span className="rounded-lg bg-slate-100/80 px-3 py-1 text-xs font-semibold tracking-wide text-slate-800">
                          {formattedValue}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        )}

        {/* Opiniones de clientes (Tipado explícito de review) */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-10">
            <h3 className="mb-6 text-xl font-black text-gray-900">
              Opiniones de clientes
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {product.reviews.map(
                (
                  review: { userName: string; rating: number; comment: string },
                  idx: number,
                ) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">
                        {review.userName}
                      </span>
                      <span className="text-xs text-yellow-400">
                        ★ {review.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "{review.comment}"
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ProductDetail;
