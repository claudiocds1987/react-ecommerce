import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/app/MainLayout';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import AdminDashboardPage from '@/pages/AdminDashboardPage/AdminDashboardPage';

export const router = createBrowserRouter([
  {
    // El MainLayout envuelve a todas las rutas de la app, por lo que el Header estará en todas partes
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <CatalogPage />,
      },
      {
        path: '/product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      // Rutas privadas / Protegidas para Administradores anidadas dentro del Layout
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboardPage />,
          },
          // Aca agregar más rutas protegidas de admin en el futuro (ej: /admin/products, etc.)
        ],
      },
    ],
  },
]);