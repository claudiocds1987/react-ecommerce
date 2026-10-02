// Componentes
export { ProductCard } from "./components/ProductCard";
export { ProductsList } from "./components/ProductsList";
export { ProductDetail } from "./components/ProductDetail/ProductDetail";

// RTK Query API & Hooks
export {
  productApi,
  useGetProductsQuery,
  useGetFilteredProductsQuery,
  useGetProductByIdQuery,
} from "./slices/productsApi"; // O la ruta donde tengas tu createApi de productos
