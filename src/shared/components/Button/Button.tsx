import React from "react";

// Extendemos las propiedades nativas de un botón HTML (onClick, disabled, type, etc.)
// junto con el soporte automático para children.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...rest
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700";
      case "primary":
      default:
        return "bg-waves text-white hover:opacity-90";
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      // 1. Aquí ya incluimos w-full, py-3 y mt-2 por defecto
      className={`mt-2 w-full py-3 px-4 font-medium rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md flex items-center justify-center gap-2 ${getVariantClass()} ${className}`}
      {...rest}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};
