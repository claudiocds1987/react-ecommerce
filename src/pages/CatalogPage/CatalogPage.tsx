import { useState } from "react";
import Modal from "@/shared/components/Modal/Modal";
import type { CustomerProductFilter, Product } from "@/entities/product";
import { ProductDetail, ProductsList } from "@/features/products/components";
import { useGetFilteredProductsQuery } from "@/features/products/slices/productsApi";

export const CatalogPage = () => {
  const [page, setPage] = useState(1);
  const [pagesize] = useState(30);

  // Mantenemos una lista acumulada de productos controlada por el evento de carga
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [prevData, setPrevData] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Consumo de datos con RTK Query
  const {
    data: productPaginated,
    isLoading,
    isFetching,
    error,
  } = useGetFilteredProductsQuery({
    page,
    size: pagesize,
    filters: {
      search: "",
      minPrice: null,
      maxPrice: null,
      categoryId: "",
      brandId: "",
      sortBy: "rating",
      order: "asc",
    } as CustomerProductFilter,
  });

  // Estado para el Modal de detalles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Patrón oficial de React para actualizar estado basado en props/datos nuevos sin useEffect:
  // Si la data de RTK Query cambió respecto a la última vez que la procesamos, actualizamos los acumulados aquí mismo.
  if (productPaginated && productPaginated !== prevData) {
    setPrevData(productPaginated);
    const newItems = Array.isArray(productPaginated)
      ? productPaginated
      : productPaginated.items || [];

    if (page === 1) {
      setAllProducts(newItems);
    } else {
      setAllProducts((prev) => [...prev, ...newItems]);
    }

    if (newItems.length < pagesize) {
      setHasMore(false);
    }
  }

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isLoading && page === 1)
    return (
      <div className="p-8 text-center text-slate-600">
        Cargando productos...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar los productos
      </div>
    );

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        Catálogo de Productos
      </h1>

      {/* Renderizamos la lista con todos los productos acumulados */}
      <ProductsList products={allProducts} onOpenDetail={handleOpenDetail} />

      {/* Botón de "Ver más resultados" */}
      {hasMore && (
        <div className="mt-10 mb-12 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isFetching}
            className="rounded-xl bg-blue-600 px-8 py-3.5 font-medium text-white shadow-md transition-colors hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isFetching ? "Cargando más..." : "Ver más resultados"}
          </button>
        </div>
      )}

      {/* Modal para el detalle del producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title=""
      >
        {selectedProduct && (
          <ProductDetail
            key={selectedProduct.id}
            productId={selectedProduct.id}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </main>
  );
};

export default CatalogPage;
