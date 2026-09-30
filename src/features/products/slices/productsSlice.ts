// src/features/products/productSlice.ts
import type { Product } from '@/entities/product';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Estado inicial
interface ProductState {
  items: Product[];
  totalItems: number;
  filterQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  totalItems: 0,
  filterQuery: '',
  loading: false,
  error: null,
};

// Slice de productos
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.totalItems = action.payload.length;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      state.totalItems++;
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      state.totalItems = state.items.length;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateQuery: (state, action: PayloadAction<string>) => {
      state.filterQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Exportar acciones y reducer
export const {
  setProducts,
  addProduct,
  removeProduct,
  updateProduct,
  updateQuery,
  setLoading,
  setError,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;

// Selectores (equivalente a withComputed en Angular)
export const selectFilteredProducts = (state: { products: ProductState }) =>
  state.products.items.filter(p =>
    p.title.toLowerCase().includes(state.products.filterQuery.toLowerCase())
  );

export const selectProductsCount = (state: { products: ProductState }) =>
  state.products.items.length;

export const selectLoading = (state: { products: ProductState }) =>
  state.products.loading;
