import { useNavigate } from "react-router-dom"; // <--- ASEGÚRATE DE IMPORTAR ESTO

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-waves sticky top-0 z-50 flex items-center justify-between px-3 py-3 shadow-xl backdrop-blur-md sm:px-8 sm:py-4">
      {/* Botón de inicio / Logo */}
      <button
        onClick={() => navigate("/")}
        className="group cursor-pointer border-none bg-transparent"
        aria-label="Ir a la página de inicio de Ecommerce"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="./icons/logo.svg"
            alt="Logo de Ecommerce - V20"
            className="h-14 w-14 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
          />
          <span className="pr-2 text-[9px] font-black tracking-wider text-white uppercase italic [word-spacing:0.3em] min-[380px]:text-[10px] sm:text-lg">
            Ecommerce Productos
          </span>
        </div>
      </button>

      {/* Acciones de navegación */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/login")}
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-white transition-all hover:bg-white/5 sm:px-3 cursor-pointer"
        >
          <span className="text-sm font-medium tracking-wide text-white">Login</span>
        </button>

        {/* Botón de Asistente IA */}
        <button
          onClick={() => {
            /* Lógica para abrir asistente de IA */
          }}
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-white transition-all duration-300 hover:bg-white/5 sm:px-3 cursor-pointer"
          aria-label="Open AI assistant"
        >
          <span className="hidden text-sm font-medium tracking-wide md:inline">Chat</span>
          <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;