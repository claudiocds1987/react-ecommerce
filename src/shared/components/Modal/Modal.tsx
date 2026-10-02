import React, { useEffect, type ReactNode } from "react";

// 1. Definimos la interfaz para las propiedades del componente
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// 2. Tipamos los parámetros que recibe el componente
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  // 3. Tipamos el evento 'e' como KeyboardEvent
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal optimizado para pantallas grandes y scroll global */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all">
        {/* Cabecera (Solo se renderiza si se provee un título) */}
        {title && (
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Contenido dinámico */}
        <div className="text-gray-600">{children}</div>
      </div>
    </div>
  );
}
