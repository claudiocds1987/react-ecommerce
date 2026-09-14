// Importa la función createApi de RTK Query para crear y configurar una API de forma automática
import { createApi } from '@reduxjs/toolkit/query/react';
// Importa la configuración base para las peticiones HTTP (como la URL base y los headers)
import { baseQuery } from '@/shared/api/baseQuery';
// Importa el tipo de datos User para asegurar un tipado estricto con TypeScript
import type { User } from '@/entities/user/user.types';

// Crea y exporta la API de autenticación utilizando RTK Query
export const authApi = createApi({
  // Define un nombre único para identificar este reducer dentro de app/store.ts global
  reducerPath: 'authApi',
  // Asigna la configuración base de las peticiones HTTP definidas previamente
  baseQuery,
  // Define los endpoints o llamadas al servidor que va a manejar esta API
  endpoints: (builder) => ({
    // Define una mutación (petición POST, PUT o DELETE) para el inicio de sesión
    login: builder.mutation<User, { username: string; password: string }>({
      // Configura los detalles de la petición HTTP usando las credenciales recibidas
      query: (credentials) => ({
        url: '/auth/login',      // La ruta del endpoint en el backend
        method: 'POST',          // El método HTTP utilizado para enviar datos
        body: credentials,       // lo que se envía al endpoint (el usuario y contraseña)
      }),
    }),
    // Define una consulta (petición GET) para obtener los datos del usuario actual
    getMe: builder.query<User, void>({
      // La función query retorna directamente la URL del endpoint ya que es un GET simple
      query: () => '/auth/me',
    }),
  }),
});

// ⚡ RTK Query genera automáticamente los hooks useLoginMutation, useLazyGetMeQuery a partir de los endpoints definidos arriba.
// no aparecen en el código de arriba como funciones normales, sino que se exportan como hooks personalizados para ser usados directamente en los componentes de React.
// Por ejemplo: useLoginMutation (para iniciar sesión) y useLazyGetMeQuery (para obtener datos del usuario actual).
// Exporta automáticamente los hooks personalizados generados por RTK Query para usarlos en los componentes
// En este caso, useLoginMutation para iniciar sesión y useLazyGetMeQuery para obtener los datos del usuario actual de manera perezosa (lazy).

export const { useLoginMutation, useLazyGetMeQuery } = authApi;