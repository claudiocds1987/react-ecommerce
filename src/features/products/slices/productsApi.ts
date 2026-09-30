import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/api/baseQuery';
import type { CustomerProductFilter, Product, ProductAdminGrid, ProductFilterParams, ProductPaginated } from '@/entities/product';


// 1. Función de ayuda equivalente a _mapToProduct de Angular
const mapToProduct = (p: Product): Product => ({
  ...p,
  thumbnail: p.thumbnail,
  finalPrice:
    p.price && p.discountPercentage
      ? Number((p.price * (1 - p.discountPercentage / 100)).toFixed(2))
      : p.price,
});

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery,
  // Opcional: Define etiquetas para invalidar caché automáticamente tras mutaciones (Caché y Revalidación)
  tagTypes: ['Product', 'ProductAdmin'],
  endpoints: (builder) => ({

    // Obtener todos los productos (sin paginación explícita)
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      transformResponse: (res: ProductPaginated) => (res.items || []).map(mapToProduct),
      providesTags: ['Product'],
    }),

    // Obtener productos paginados
    getProductsPaginated: builder.query<ProductPaginated, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => `/products?page=${pageNumber}&size=${pageSize}`,
      transformResponse: (res: ProductPaginated): ProductPaginated => ({
        ...res,
        items: (res.items || []).map(mapToProduct),
      }),
      providesTags: ['Product'],
    }),

    // Obtener productos filtrados (Cliente)
    getFilteredProducts: builder.query<ProductPaginated, { page: number; size: number; filters?: CustomerProductFilter }>({
      query: ({ page, size, filters = {} }) => {
        const params: Record<string, any> = { page, size };
        
        if (filters.search) params.search = filters.search;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.brandId) params.brandId = filters.brandId;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.order) params.order = filters.order;

        return { url: '/products', params };
      },
      transformResponse: (res: ProductPaginated): ProductPaginated => ({
        ...res,
        items: (res.items || []).map(mapToProduct),
      }),
      providesTags: ['Product'],
    }),

    // Obtener productos filtrados y paginados (lado Admin)
    getFilteredProductsAdmin: builder.query<ProductPaginated<ProductAdminGrid>, { page: number; size: number; filters: ProductFilterParams }>({
      query: ({ page, size, filters }) => {
        const params: Record<string, any> = { page, size };

        if (filters.search) params.search = filters.search;
        if (filters.id) params.id = filters.id;
        if (filters.title) params.title = filters.title;
        if (filters.categoryId && filters.categoryId !== 'all') params.categoryId = filters.categoryId;
        if (filters.brandId && filters.brandId !== 'all') params.brandId = filters.brandId;
        if (
          filters.isActive !== undefined &&
          filters.isActive !== null &&
          (filters.isActive as any) !== 'all'
        ) {
          params.isActive = filters.isActive;
        }
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.order) params.order = filters.order;

        return { url: '/products/admin', params };
      },
      transformResponse: (res: ProductPaginated<ProductAdminGrid>): ProductPaginated<ProductAdminGrid> => ({
        ...res,
        items: res.items.map((item) => ({
          ...item,
          finalPrice: Number((item.price * (1 - (item.discountPercentage || 0) / 100)).toFixed(2)),
        })),
      }),
      providesTags: ['ProductAdmin'],
    }),

    // Obtener producto por ID
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (p: Product) => mapToProduct(p),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    // Crear producto (Mutación)
    createProduct: builder.mutation<Product, Product>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product', 'ProductAdmin'],
    }),

    // Actualizar producto (Mutación)
    updateProduct: builder.mutation<Product, { id: number; product: Partial<Product> }>({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      // Extraemos solo 'data' de la respuesta del backend como hacías en Angular
      transformResponse: (response: { message: string; data: Product }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }, 'Product', 'ProductAdmin'],
    }),

    // Actualizar estado del producto (Mutación)
    updateProductStatus: builder.mutation<Product, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/products/${id}/status`,
        method: 'PATCH',
        params: { isActive },
      }),
      transformResponse: (response: { message: string; data: Product }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }, 'Product', 'ProductAdmin'],
    }),

  }),
});

// Exportación automática de los hooks generados por RTK Query
export const {
  useGetProductsQuery,
  useGetProductsPaginatedQuery,
  useGetFilteredProductsQuery,
  useGetFilteredProductsAdminQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
} = productApi;