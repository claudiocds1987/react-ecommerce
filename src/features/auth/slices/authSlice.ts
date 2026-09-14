// Importa la función createSlice de Redux Toolkit para simplificar la creación de estados y reducers
import { createSlice } from '@reduxjs/toolkit';
// Importa exclusivamente como tipo la interfaz PayloadAction para tipar los datos que reciben las acciones
import type { PayloadAction } from '@reduxjs/toolkit'; 
// Importa el tipo de datos User para tipar la información del usuario
import type { User } from '@/entities/user/user.types';

// Define la estructura (TypeScript interface) que tendrá el estado de autenticación
interface AuthState {
  user: User | null;       // Datos del usuario actual o nulo si no ha iniciado sesión
  token: string | null;    // Token de acceso JWT o nulo
  loading: boolean;        // Indicador de carga para operaciones locales
  error: string | null;    // Mensaje de error en caso de que ocurra uno
}

// Establece el estado inicial de la autenticación al cargar la aplicación
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'), // Intenta recuperar el token guardado previamente en el navegador
  loading: false,
  error: null,
};

// Crea el slice de autenticación utilizando createSlice de Redux Toolkit
export const authSlice = createSlice({
  name: 'auth',       // Nombre identificador de este slice en el estado global
  initialState,       // Estado inicial definido arriba
  reducers: {         // Funciones (reducers) que modifican el estado local
    // Acción para guardar las credenciales cuando el usuario inicia sesión con éxito
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;       // Actualiza el usuario en el estado global
      state.token = action.payload.token;     // Actualiza el token en el estado global
      state.error = null;                     // Limpia cualquier error previo
      localStorage.setItem('token', action.payload.token); // Guarda el token en el navegador para persistencia
    },
    // Acción para cerrar la sesión del usuario
    logout: (state) => {
      state.user = null;                      // Borra el usuario del estado global
      state.token = null;                     // Borra el token del estado global
      localStorage.removeItem('token');       // Elimina el token del almacenamiento del navegador
      localStorage.removeItem('shopping_cart'); // Limpia también el carrito de compras guardado
    },
    // Acción para establecer un mensaje de error personalizado
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    // Acción para limpiar los errores del estado
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Exporta las acciones individuales para poder usarlas mediante el dispatch en los componentes
export const { setCredentials, logout, setError, clearError } = authSlice.actions;
// Exporta el reducer por defecto para integrarlo en el rootReducer.ts global
export default authSlice.reducer;