// src/features/auth/components/LoginForm/LoginForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../slices/authApi";
import { useAppDispatch } from "@/app/store.hooks";
import { setCredentials } from "../../slices/authSlice";
// Declaramos el componente de React llamado LoginForm y lo hacemos exportable
export const LoginForm = () => {
  // Creamos un estado local "form" para guardar lo que el usuario escribe en usuario y contraseña
  const [form, setForm] = useState({ username: "", password: "" });
  // Preparamos la función "login" de Redux Toolkit Query, y sacamos variables para saber si está cargando o si hubo un error
  const [login, { isLoading, error }] = useLoginMutation();
  // Preparamos la función "dispatch" para poder mandar acciones a nuestro estado global de Redux
  const dispatch = useAppDispatch();
  // Preparamos la función "navigate" para poder redirigir al usuario a otra página de la app
  const navigate = useNavigate();
  // Función que se ejecuta cada vez que el usuario escribe una letra en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sacamos el nombre del input (username o password) y lo que el usuario escribió (value)
    const { name, value } = e.target;
    // Actualizamos el estado "form", copiando lo que ya tenía y sobrescribiendo solo el campo que cambió
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Función que se ejecuta cuando el usuario hace clic en el botón de enviar o presiona Enter
  const handleSubmit = async (e: React.FormEvent) => {
    // Evitamos que la página se recargue por defecto al enviar el formulario
    e.preventDefault();
    // Iniciamos un bloque try/catch por si ocurre algún error durante la petición al servidor
    try {
      // Llamamos a la API de login con los datos del formulario y esperamos la respuesta con .unwrap()
      const user = await login(form).unwrap();
      // Si la respuesta del servidor incluye un token de acceso...
      if (user.token) {
        // Guardamos los datos del usuario y su token en el estado global de Redux
        dispatch(setCredentials({ user, token: user.token }));
        // Verificamos si el rol del usuario es administrador
        if (user.role === "admin") {
          // Si es admin, lo mandamos a la pantalla de administración
          navigate("/admin");
        } else {
          // Si no es admin (es usuario normal), lo mandamos a la página principal
          navigate("/");
        }
      }
    } catch (err: unknown) {
      // Si la petición falla, capturamos el error y lo mostramos en la consola del navegador
      console.error("Error de login:", err);
    }
  };

  // Retornamos el código visual (JSX) que se va a pintar en la pantalla
  return (
    // Creamos la etiqueta form y le decimos que al enviar ejecute la función handleSubmit
    <form onSubmit={handleSubmit}>
      {/* Contenedor visual para agrupar la etiqueta y el input del usuario */}
      <div>
        {/* Etiqueta de texto que indica qué se debe escribir */}
        <label htmlFor="username">Usuario</label>

        {/* Input de texto donde el usuario escribe su nombre de usuario */}
        <input
          id="username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      {/* Contenedor visual para agrupar la etiqueta y el input de la contraseña */}
      <div>
        {/* Etiqueta de texto para la contraseña */}
        <label htmlFor="password">Contraseña</label>

        {/* Input de tipo password para que los caracteres salgan ocultos con puntitos */}
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Botón para enviar el formulario; se desactiva (disabled) si está cargando */}
      <button type="submit" disabled={isLoading}>
        {/* Si isLoading es true muestra "Ingresando...", si es false muestra "Login" */}
        {isLoading ? "Ingresando..." : "Login"}
      </button>

      {/* Si la variable "error" tiene algo (es true/existe), muestra un texto rojo o un mensaje de error */}
      {error && <p>Error al iniciar sesión</p>}
    </form>
  );
};

// Exportamos el componente por defecto para poder importarlo fácilmente en otros archivos
export default LoginForm;
