import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/store.hooks';


interface ProtectedRouteProps {
  requiredRole?: string;
}
// Como el Guard en Angular, este componente se encarga de proteger las rutas que requieren autenticación y autorización. 
// Si el usuario no está autenticado (no tiene token o usuario), se redirige a la página de login. 
// Si el usuario no tiene el rol requerido, se redirige a la página principal. 
// Si todo está en orden, se renderiza el componente Outlet para mostrar las rutas hijas protegidas.
export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};