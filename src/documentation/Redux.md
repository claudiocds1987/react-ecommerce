## 🔐 Gestión de Autenticación y Flujo de Redux

En esta aplicación utilizamos **Redux Toolkit** para manejar los datos globales y el inicio de sesión de los usuarios de forma ordenada. El funcionamiento se divide en tres partes principales:

### 1. Las herramientas del estado (`src/features/auth/slices/`)

Dentro de la carpeta del módulo de autenticación, tenemos dos archivos clave:

* **`authApi.ts`** (`src/features/auth/slices/authApi.ts`): Se encarga de la comunicación con el servidor. Define los endpoints de la API y **crea automáticamente los hooks** (como `useLoginMutation` y `useLazyGetMeQuery`) combinando los nombres de los endpoints con las herramientas de RTK Query, sin necesidad de programar esos hooks de forma manual.

```ts
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

```

* **`authSlice.ts`** (`src/features/auth/slices/authSlice.ts`): Guarda la información del usuario conectado y su token de acceso en el estado global. También incluye funciones para guardar el token en el navegador (`localStorage`) cuando el usuario entra, o borrarlo cuando sale.

```ts
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

```

### 2. El unificador de datos (`src/app/rootReducer.ts`)

* **Ubicación:** `src/app/rootReducer.ts`
* **¿Para qué está?** A medida que la aplicación crece, tendremos datos de productos, carritos y usuarios. Este archivo funciona como una mesa central que **junta todos los reducers** de la aplicación en uno solo para que el sistema global los reconozca.

```ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import { authApi } from '@/features/auth/slices/authApi';

export const rootReducer = combineReducers({
  // Reducers will be registered here (e.g. auth, cart, products)
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

```

### 3. La central general (`src/app/store.ts`)

* **Ubicación:** `src/app/store.ts`
* **¿Para qué está?** Es el **Store global** de la aplicación. Une el `rootReducer` y mantiene la memoria centralizada de todo lo que ocurre en el sistema. Además, incluye los complementos necesarios para que las peticiones del servidor funcionen de manera fluida.

```ts
// Importamos la función para crear la tienda (store) global de Redux Toolkit de forma sencilla
import { configureStore } from '@reduxjs/toolkit';

// Importamos el reducer principal que junta y organiza todos los estados de nuestra aplicación
import { rootReducer } from './rootReducer';

// Importamos la API de autenticación (hecha con RTK Query) para manejar peticiones como login, logout, etc.
import { authApi } from '@/features/auth/slices/authApi';

// Creamos y exportamos la tienda (store) global de Redux para que toda la app tenga acceso a los datos
export const store = configureStore({
  
  // Asignamos el reducer principal que se encargará de actualizar el estado global
  reducer: rootReducer,
  
  // Configuramos los "middlewares" (funciones intermedias que se ejecutan antes de que las acciones lleguen al reducer)
  middleware: (getDefaultMiddleware) =>
    // Usamos los middlewares que ya trae Redux Toolkit por defecto y le sumamos (.concat) el de nuestra API de autenticación
    getDefaultMiddleware().concat(authApi.middleware),
});

// Extraemos y exportamos el tipo de todo el estado global (muy útil en TypeScript al usar useSelector)
export type RootState = ReturnType<typeof store.getState>;

// Extraemos y exportamos el tipo de la función dispatch (muy útil en TypeScript al usar useDispatch para enviar acciones)
export type AppDispatch = typeof store.dispatch;

```

### 4. Los ganchos personalizados de tipado (`src/app/store.hooks.ts`)

* **Ubicación:** `src/app/store.hooks.ts`
* **¿Para qué está?** Este archivo es el **puente oficial entre tus componentes de React y tu tienda de Redux**, adaptado con **TypeScript**. En lugar de usar los hooks genéricos de Redux, creamos versiones personalizadas (`useAppDispatch` y `useAppSelector`) para que TypeScript reconozca automáticamente la estructura del estado y te ofrezca autocompletado inteligente sin tener que repetir tipos en cada componente.

```ts
// Importamos los ganchos (hooks) originales que vienen por defecto en la librería 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
// Importamos un tipo especial de TypeScript que nos ayuda a tipar correctamente el useSelector
import type { TypedUseSelectorHook } from 'react-redux';
// Importamos los tipos 'RootState' (la forma de todo tu estado global) y 'AppDispatch' (el tipo de tus acciones) desde tu archivo store.ts
import type { RootState, AppDispatch } from './store';
// Creamos y exportamos una versión personalizada de useDispatch llamada 'useAppDispatch'
// Al aplicarle <AppDispatch>, le decimos a TypeScript que este dispatch solo aceptará acciones válidas de nuestra app
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Creamos y exportamos una versión personalizada de useSelector llamada 'useAppSelector'
// Le asignamos el tipo 'RootState' para que, cuando escribas código en tus componentes y leas el estado, el editor reconozca todas tus propiedades automáticamente
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

```

---

### 5. Modificar los archivos app.tsx, index.ts
* **Ubicación:** `src/app/app.tsx`, `src/app/app.index.ts`

**app.tsx:**
```ts
// Importa el componente Provider de 'react-redux' para inyectar el estado global en toda la app
import { Provider } from 'react-redux';
// Importa el RouterProvider de 'react-router-dom' para administrar la navegación y las páginas
import { RouterProvider } from 'react-router-dom';
// Importa el Store global de Redux creado en la misma carpeta (app/store.ts)
import { store } from './store';
// Importa la configuración de rutas de la aplicación creada en la misma carpeta (app/router.tsx)
import { router } from './router';
// Declara y exporta el componente funcional principal App que envolverá toda la interfaz de usuario
export const App = () => {
  return (
    // El Provider envuelve la app y le entrega el store global de Redux a todos los componentes hijos
    <Provider store={store}>
      
      {/* El RouterProvider renderiza las vistas y páginas basándose en la configuración de rutas */}
      <RouterProvider router={router} />
      
    </Provider>
  );
};
// Exporta el componente App por defecto para que pueda ser montado directamente en src/main.tsx
export default App;

```
**index.ts**:
```ts
// ==========================================
// API PÚBLICA DE LA CAPA APP (BARREL FILE)
// ==========================================
// Re-exporta todo el contenido del componente principal App (proveedores globales y rutas)
export * from './App';
// Re-exporta el store global de Redux (configureStore) para que pueda ser utilizado si es necesario
export * from './store';
// Re-exporta el rootReducer que combina los reducers de toda la aplicación (auth, products, etc.)
export * from './rootReducer';
// Re-exporta los hooks tipados globales (useAppDispatch y useAppSelector) listos para usar en componentes
export * from './store.hooks';
// Re-exporta la configuración del enrutador (createBrowserRouter) que define las vistas de la app
export * from './router';

```

---

### ¿Qué archivos se disparan y cómo funciona el ciclo cuando un usuario inicia sesión?

Cuando el usuario hace clic en ingresar, los archivos del proyecto se activan de forma secuencial:

1. **`LoginForm.tsx`** (`src/features/auth/components/LoginForm/LoginForm.tsx`):

* Es el punto de partida. El usuario completa sus credenciales y presiona el botón de envío. El componente intercepta la acción y ejecuta el hook **`useLoginMutation`** (este hook no está escrito a mano en el código, sino que es **generado automáticamente por RTK Query** a partir del endpoint `login` definido en `authApi.ts`).

```tsx
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

```

2. **`authApi.ts`** (`src/features/auth/slices/authApi.ts`):

* Se dispara automáticamente al recibir la orden del formulario. Toma las credenciales, arma la petición HTTP POST hacia el backend y espera la respuesta del servidor con los datos del usuario y el **token**.

3. **El Componente (`LoginForm.tsx` nuevamente):**

* Una vez que la API responde exitosamente, el componente recupera esos datos y utiliza la función **`dispatch`** (gracias a useAppDispatch) para activar el cambio de estado global.

4. **`authSlice.ts`** (`src/features/auth/slices/authSlice.ts`):

* Recibe la acción disparada a través del reducer (`setCredentials`), toma el usuario y el token, actualiza la memoria centralizada de Redux y guarda de forma automática el token en el **`localStorage`** del navegador.

5. **`router.tsx`** (`src/app/router.tsx`):

* Finalmente, el sistema de rutas lee el estado global actualizado y redirige de manera automática al usuario hacia su panel correspondiente (por ejemplo, al catálogo si es cliente o al panel privado si es administrador).

```tsx
import { createBrowserRouter } from 'react-router-dom';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import AdminDashboardPage from '@/pages/AdminDashboardPage/AdminDashboardPage';

export const router = createBrowserRouter([
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
  // Rutas privadas / Protegidas para Administradores
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
]);


```

---

### Resumen: Gestión de Autenticación y Flujo en Redux Toolkit

Usar Redux Toolkit para almacenar datos en un store global:

1. **Hay que crear dos archivos principales:**
* **`authApi.ts`**: Este se va a encargar de tener los endpoints para comunicarse con el servidor/backend. Acá le decís cuáles son las URL, qué método usar (`POST`, `PUT`, etc.) y el `body` (lo que le querés enviar al servidor). Además, RTK Query genera automáticamente los hooks personalizados como `useLoginMutation`.
* **`authSlice.ts`**: Este se encarga de manejar el estado local de la autenticación (guardar la información del usuario logueado, tokens, errores, etc.) y guarda/borra el token de acceso en el `localStorage`.


2. **`rootReducer.ts`**: Necesito este archivo para juntar todos los reducers que tiene la aplicación en uno solo (`combineReducers`) para que el sistema global los reconozca. Acá van los reducers de `auth`, y a futuro los de `products`, `cart`, etc.
3. **`store.ts`**: Este archivo es el **Store global** de mi aplicación. Mantiene en memoria **todo el estado global de la aplicación** (unificando el `rootReducer` y sumando los middlewares necesarios para que la API de RTK Query funcione de manera fluida).
4. **`store.hooks.ts`**: Este archivo es el puente para hacer la comunicación de mis componentes de React con el Store global (`store.ts`) adaptado con TypeScript. Se crean 2 hooks personalizados:
* **`useAppDispatch`**: Este hook se utiliza para despachar acciones (como `setCredentials` o `logout`) y así **actualizar** el estado global de la aplicación.
* **`useAppSelector`**: Es el hook que permite a tus componentes **leer o extraer datos** directamente del estado global (`store.ts`). Gracias a que está tipado con `RootState`, cuando escribes por ejemplo `useAppSelector((state) => state.auth.user)`, TypeScript te autocompleta automáticamente las propiedades (como `username`, `role`, etc.) sin que tengas que tiparlas a mano en el componente.


5. **`LoginForm.tsx`**: Este es el componente que tiene el formulario cuando el usuario hace el login. Este componente se encarga de enviar las credenciales a la API. Cuando recibe la respuesta exitosa, hace lo siguiente:
* **a.** Verifica si hay un token. Si es correcto, utiliza el hook `useAppDispatch` (del archivo `store.hooks.ts`) para disparar la acción **`setCredentials` (proveniente de `authSlice.ts`)**, la cual se encarga de guardar los datos del usuario y su token en el estado global (`store.ts`) y en el `localStorage`.
* **b.** Pregunta si el rol del usuario es "administrador". Si es así, lo redirige al dashboard de administrador (`/admin`); caso contrario, lo envía a la página principal (`/` con el listado de productos).


6. **`router.ts`**: Este archivo tiene las rutas internas de mi aplicación. Acá se define qué componente se va a mostrar al navegar a cada ruta. Por ejemplo, cuando en `LoginForm.tsx` el usuario se loguea exitosamente, el sistema de rutas lee el estado global actualizado y lo redirige automáticamente a `/admin` si es administrador, o a `/` si es un usuario común.

```tsx
import { createBrowserRouter } from 'react-router-dom';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import AdminDashboardPage from '@/pages/AdminDashboardPage/AdminDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CatalogPage />, // lista de productos para el comprador (página principal)
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
    element: <LoginPage />, // el componente LoginPage llama al componente LoginForm.tsx
  },
  // Rutas privadas / Protegidas para Administradores
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        path: '/admin',
        element: <AdminDashboardPage />,
      },
      // Acá se pueden agregar más rutas protegidas de admin en el futuro (ej: /admin/products, etc.)
    ],
  },
]);

```