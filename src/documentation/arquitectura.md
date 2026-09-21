```markdown
# 🛒 E-Commerce — Arquitectura Enterprise (React + Redux Toolkit + Feature-Sliced Design)

Arquitectura escalable basada en **Feature-Sliced Design (FSD)** para aplicaciones de comercio electrónico en React + Vite.

---

## 📁 Estructura de Directorios

```text
proyecto/
├── index.html                            # Punto de entrada HTML — referencia a src/main.tsx
├── vite.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx                          # Punto de entrada real — monta la app en el DOM
    │
    ├── app/                              # Configuración global, store, router y providers
    │   ├── router.tsx                    # Aca se definen las rutas de las vistas
    │   ├── store.ts                      # configureStore global (une apis y slices)
    │   ├── rootReducer.ts                # Combinador de reducers de RTK Query y UI
    │   ├── store.hooks.ts                # useAppDispatch / useAppSelector tipados
    │   └── App.tsx                       # Proveedores globales (Theme, Redux, Router)
    │
    ├── pages/                            # Vistas de la aplicación (ensamblan widgets y features)
    │   ├── CatalogPage/
    │   │   ├── CatalogPage.tsx           # Combina ProductFilters, ProductGrid
    │   │   ├── CatalogPage.module.scss
    │   │   └── index.ts
    │   ├── ProductDetailPage/
    │   │   ├── ProductDetailPage.tsx
    │   │   └── index.ts
    │   ├── CartPage/
    │   │   ├── CartPage.tsx
    │   │   └── index.ts
    │   ├── CheckoutPage/
    │   │   ├── CheckoutPage.tsx
    │   │   └── index.ts
    │   └── LoginPage/
    │       ├── LoginPage.tsx
    │       └── index.ts
    │
    ├── widgets/                          # Bloques compuestos que combinan varias features (no son páginas)
    │   ├── Header/
    │   │   ├── Header.tsx                # Usa features/cart (contador) y features/auth (sesión)
    │   │   ├── Header.module.scss
    │   │   └── index.ts
    │   └── Footer/
    │       ├── Footer.tsx
    │       └── index.ts
    │
    ├── features/                         # Módulos de negocio interactivos (acciones del usuario)
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── LoginForm/
    │   │   │   │   ├── LoginForm.tsx
    │   │   │   │   ├── LoginForm.module.scss
    │   │   │   │   └── LoginForm.test.tsx
    │   │   │   └── RegisterForm/
    │   │   ├── slices/
    │   │   │   ├── authApi.ts            # RTK Query: login, register, logout, refreshToken
    │   │   │   └── authSlice.ts          # Estado de sesión (token, usuario, isAuth)
    │   │   ├── hooks/
    │   │   │   └── useAuthForm.ts        # React Hook Form + Zod
    │   │   ├── models/
    │   │   │   └── auth.schema.ts        # Esquemas Zod para login/registro
    │   │   └── index.ts                  # API pública de la feature
    │   │
    │   ├── products/
    │   │   ├── components/
    │   │   │   ├── ProductCard/
    │   │   │   ├── ProductGrid/
    │   │   │   ├── ProductForm/          # Alta/edición de producto (panel admin)
    │   │   │   ├── ProductFilters/       # Lee/escribe filtros desde productsSlice
    │   │   │   └── ProductDetail/
    │   │   ├── slices/
    │   │   │   ├── productsApi.ts        # RTK Query + createEntityAdapter (normalización)
    │   │   │   └── productsSlice.ts      # Estado UI: filtros, vista, paginación
    │   │   ├── hooks/
    │   │   │   └── useProductFilters.ts  # Sincronización de filtros con estado y URL
    │   │   ├── models/
    │   │   │   └── product.schema.ts     # Schema Zod del formulario de producto
    │   │   └── index.ts
    │   │
    │   ├── brands/
    │   │   ├── components/
    │   │   │   ├── BrandForm/
    │   │   │   └── BrandList/
    │   │   ├── slices/
    │   │   │   └── brandsApi.ts          # RTK Query: listado/CRUD de marcas
    │   │   └── index.ts
    │   │
    │   ├── categories/
    │   │   ├── components/
    │   │   │   ├── CategoryForm/
    │   │   │   └── CategoryList/
    │   │   ├── slices/
    │   │   │   └── categoriesApi.ts      # RTK Query: árbol de categorías
    │   │   └── index.ts
    │   │
    │   ├── cart/
    │   │   ├── components/
    │   │   │   ├── CartDrawer/
    │   │   │   ├── CartItem/
    │   │   │   └── CartSummary/
    │   │   ├── slices/
    │   │   │   └── cartSlice.ts          # Estado 100% cliente (items, cantidades, cupón)
    │   │   ├── selectors/
    │   │   │   └── cartSelectors.ts      # createSelector: subtotal, impuestos, total, totalItems
    │   │   ├── hooks/
    │   │   │   └── useCart.ts
    │   │   └── index.ts
    │   │
    │   └── checkout/
    │       ├── components/
    │       │   ├── CheckoutStepper/
    │       │   ├── ShippingForm/
    │       │   └── PaymentForm/          # Integración con pasarela de pago (Stripe/MercadoPago)
    │       ├── slices/
    │       │   └── checkoutApi.ts        # RTK Query: crear orden, procesar pago
    │       ├── models/
    │       │   └── checkout.types.ts     # Tipos de órdenes y direcciones de envío
    │       └── index.ts
    │
    ├── entities/                         # Tipos de dominio puros compartidos entre features
    │   ├── product/
    │   │   ├── product.types.ts          # interface Product (usada por products, cart, checkout)
    │   │   └── index.ts
    │   ├── brand/
    │   │   ├── brand.types.ts
    │   │   └── index.ts
    │   ├── category/
    │   │   ├── category.types.ts
    │   │   └── index.ts
    │   └── user/
    │       ├── user.types.ts
    │       └── index.ts
    │
    └── shared/                           # Código agnóstico de negocio (sin lógica de features)
        ├── components/
        │   └── ui/                       # Componentes atómicos puros
        │       ├── Button/
        │       ├── Input/
        │       ├── Select/
        │       └── Modal/
        ├── api/
        │   └── baseQuery.ts              # fetchBaseQuery global con interceptores Bearer
        ├── utils/
        │   ├── formatters.ts             # Formato de moneda, fechas, textos
        │   └── constants.ts              # Endpoints base y configuraciones
        └── styles/
            ├── _variables.scss           # Design tokens (colores, espaciados, tipografía)
            ├── _mixins.scss
            └── global.scss
```

---

## 📐 Reglas de Dependencias y Flujo de Capas

El código fluye en una sola dirección. Una capa superior puede importar de las inferiores, **nunca al revés**:

```text
app → pages → widgets → features → entities → shared
```

### Principios clave

1. **Aislamiento de features:** ninguna feature importa archivos internos de otra (`features/cart` nunca importa desde `features/products/slices/...`). Toda comunicación pasa por el `index.ts` público de cada módulo.
2. **`widgets/` para bloques compuestos:** piezas de UI que combinan varias features pero no son una página completa (ej. `Header` necesita `cart` + `auth`). Sin esta capa, `shared` terminaría dependiendo de `features`, rompiendo el flujo.
3. **`entities/` para tipos de dominio compartidos:** `Product`, `Brand`, `Category`, `User` viven acá, evitando que una feature dependa de la lógica interna de otra solo para tipar datos.
4. **Estado servidor vs. estado cliente:**
   - `*Api.ts` (RTK Query): cache, sincronización e invalidación de datos del servidor.
   - `*Slice.ts` de UI: estados efímeros de interfaz (filtros, modales, paginación).
   - `cartSlice.ts`: excepción — carrito 100% cliente, sin RTK Query.
5. **Code-splitting por página:** cada entrada de `pages/` se carga con `React.lazy()` en `app/router.tsx`.
6. **Punto de entrada:** `index.html` referencia a `src/main.tsx`, que monta `<App />` (o el `RouterProvider`) envuelto en el `Provider` de Redux.
```

Listo para pegar tal cual. ¿Seguimos con el código de `main.tsx` + `App.tsx` + `router.tsx`, o con `productsApi.ts`/`store.ts`?