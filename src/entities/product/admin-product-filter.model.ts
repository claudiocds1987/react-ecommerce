// Este modelo se utiliza para el filtro de la grilla de productos del "administrador"
export interface AdminProductFilter {
  id: number;
  title: string;
  categoryId: number;
  brandId: number;
  isActive: boolean | null;
}
