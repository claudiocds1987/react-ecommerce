import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';

export const MainLayout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header fijo arriba */}
      <Header />

      {/* Contenido principal que toma el espacio restante y hace scroll si es necesario */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>

      {/* Footer fijo abajo */}
      <Footer />
    </div>
  );
};