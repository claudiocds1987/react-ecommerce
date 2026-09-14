## 🔐 Gestión de Autenticación y Flujo de Redux

En esta aplicación utilizamos **Redux Toolkit** para manejar los datos globales y el inicio de sesión de los usuarios de forma ordenada. El funcionamiento se divide en tres partes principales:

### 1. Las herramientas del estado (`src/features/auth/slices/`)

Dentro de la carpeta del módulo de autenticación, tenemos dos archivos clave:

* **`authApi.ts`** (`src/features/auth/slices/authApi.ts`): Se encarga de la comunicación con el servidor. Define los endpoints de la API y **crea automáticamente los hooks** (como `useLoginMutation` y `useLazyGetMeQuery`) combinando los nombres de los endpoints con las herramientas de RTK Query, sin necesidad de programar esos hooks de forma manual.
* **`authSlice.ts`** (`src/features/auth/slices/authSlice.ts`): Guarda la información del usuario conectado y su token de acceso en el estado global. También incluye funciones para guardar el token en el navegador (`localStorage`) cuando el usuario entra, o borrarlo cuando sale.

### 2. El unificador de datos (`src/app/rootReducer.ts`)

* **Ubicación:** `src/app/rootReducer.ts`
* **¿Para qué está?** A medida que la aplicación crece, tendremos datos de productos, carritos y usuarios. Este archivo funciona como una mesa central que **junta todos los reducers** de la aplicación en uno solo para que el sistema global los reconozca.

### 3. La central general (`src/app/store.ts`)

* **Ubicación:** `src/app/store.ts`
* **¿Para qué está?** Es el **Store global** de la aplicación. Une el `rootReducer` y mantiene la memoria centralizada de todo lo que ocurre en el sistema. Además, incluye los complementos necesarios para que las peticiones del servidor funcionen de manera fluida.

---

### ¿Qué archivos se disparan y cómo funciona el ciclo cuando un usuario inicia sesión?

Cuando el usuario hace clic en ingresar, los archivos del proyecto se activan de forma secuencial:

1. **`LoginForm.tsx`** (`src/features/auth/components/LoginForm/LoginForm.tsx`):

* Es el punto de partida. El usuario completa sus credenciales y presiona el botón de envío. El componente intercepta la acción y ejecuta el hook **`useLoginMutation`** (este hook no está escrito a mano en el código, sino que es **generado automáticamente por RTK Query** a partir del endpoint `login` definido en `authApi.ts`).

2. **`authApi.ts`** (`src/features/auth/slices/authApi.ts`):

* Se dispara automáticamente al recibir la orden del formulario. Toma las credenciales, arma la petición HTTP POST hacia el backend y espera la respuesta del servidor con los datos del usuario y el **token**.

3. **El Componente (`LoginForm.tsx` nuevamente):**

* Una vez que la API responde exitosamente, el componente recupera esos datos y utiliza la función **`dispatch`** para activar el cambio de estado global.

4. **`authSlice.ts`** (`src/features/auth/slices/authSlice.ts`):

* Recibe la acción disparada a través del reducer (`setCredentials`), toma el usuario y el token, actualiza la memoria centralizada de Redux y guarda de forma automática el token en el **`localStorage`** del navegador.

5. **`router.tsx`** (`src/app/router.tsx`):

* Finalmente, el sistema de rutas lee el estado global actualizado y redirige de manera automática al usuario hacia su panel correspondiente (por ejemplo, al catálogo si es cliente o al panel privado si es administrador).