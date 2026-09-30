/* export interface ProductFilterParams {
  id?: number;
  title?: string;
  price?: number;
  sku?: string;
  discountPercentage?: number;
  finalPrice?: number;
  categoryId?: number;
  brandId?: number;
  stock?: number;
  isActive?: boolean | number;
  page?: number;
  limit?: number;
  sortColumn?: string; // para hacer sort por columuna (ej: 'name', 'id')
  sortOrder?: 'asc' | 'desc' | ''; // ordenamiento de sort('asc', 'desc', o vacio para no sort)
}
 */
export interface ProductFilterParams {
  // 1. Filtros de búsqueda y entidad
  search?: string; // Cambiamos 'title' por 'search' (el Repo busca en título y descripción)
  id?: number | string;
  title?: string;
  categoryId?: number | string;
  brandId?: number | string;
  isActive?: boolean | number | null;

  // 2. Parámetros de Paginación (Match con el Controller)
  page?: number;
  size?: number; // Cambiamos 'limit' por 'size' para que coincida con C#

  // 3. Parámetros de Ordenamiento (Match con el Controller)
  sortBy?: string; // Cambiamos 'sortColumn' por 'sortBy'
  order?: 'asc' | 'desc' | ''; // Cambiamos 'sortOrder' por 'order'

  // 4. Filtros de rango (opcionales según tu Controller)
  minPrice?: number;
  maxPrice?: number;
}
