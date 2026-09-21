# 🚀 Guía Definitiva de Hooks de React para Juniors

¡Bienvenido! Si estás empezando con React, los **Hooks** pueden parecer un poco confusos al principio. Esta guía te ayudará a entender los ganchos más usados, cuándo debes utilizarlos y, lo más importante, cuándo **no** debes usarlos.

---

## 1. `useState` (La Memoria del Componente)

### ¿Qué es?

Es el hook que le permite a tu componente **recordar información** (como un texto en un input, si un botón está presionado o el número de una página). Cada vez que el estado cambia, React vuelve a dibujar (**re-renderiza**) el componente para mostrar el nuevo valor en la pantalla.

### ✅ ¿Cuándo debe usarse?

* Cuando necesitas que un valor **afecte la interfaz visual** y cambie en respuesta a acciones del usuario (clics, escritura, modales abiertos/cerrados).

### ❌ ¿Cuándo NO debe usarse?

* Para valores fijos o constantes que nunca cambian.
* Para datos que se pueden calcular directamente a partir de otros estados o props (evita el "estado derivado").

### 💻 Ejemplo de código:

```tsx
import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
};

```

---

## 2. `useEffect` (Efectos Secundarios y Conexiones Externas)

### ¿Qué es?

Le permite a tu componente hacer cosas "fuera" del flujo normal de React, como conectarse a una API (traer datos), escuchar eventos del navegador, o configurar temporizadores (`setInterval`).

### ✅ ¿Cuándo debe usarse?

* Para **traer datos de un servidor** cuando el componente se monta (ej. cargar una lista de usuarios).
* Para suscribirse a eventos globales del navegador (como `window.resize` o `scroll`).

### ❌ ¿Cuándo NO debe usarse?

* Para transformar datos o hacer cálculos simples (hazlo directamente durante el renderizado, sin `useEffect`).
* Como una solución mágica para todo; si no hay un sistema externo involucrado, probablemente no lo necesites.

### 💻 Ejemplo de código:

```tsx
import { useState, useEffect } from "react";

export const PageTitleUpdater = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Esto se ejecuta cada vez que 'count' cambia
    document.title = `Clics: ${count}`;
  }, [count]); // El array de dependencias le indica cuándo dispararse

  return (
    <button onClick={() => setCount(count + 1)}>
      Suma y mira el título de la pestaña: {count}
    </button>
  );
};

```

---

## 3. `useRef` (La Caja Fuerte / Referencia Oculta)

### ¿Qué es?

Crea una caja mutable que persiste durante todo el ciclo de vida del componente, pero con una gran diferencia respecto a `useState`: **cambiar su valor NO provoca un re-renderizado** en la pantalla. Es una herramienta de escape para tocar el DOM o guardar datos invisibles.

### ✅ ¿Cuándo debe usarse?

* Para **acceder directamente a elementos del DOM** (ej. hacer foco en un input con `.focus()` o hacer scroll automático en un chat).
* Para guardar identificadores de temporizadores (`setInterval` o `setTimeout`) y poder cancelarlos después.

### ❌ ¿Cuándo NO debe usarse?

* Para guardar valores que **el usuario necesite ver reflejados visualmente** en la pantalla (para eso siempre usa `useState`).

### 💻 Ejemplo de código:

```tsx
import { useRef } from "react";

export const TextInputWithFocusButton = () => {
  // 1. Creamos la referencia al input
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // 2. Usamos la referencia para hacer foco en el elemento del DOM directamente
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Escribe algo..." />
      <button onClick={handleButtonClick}>Hacer foco en el input</button>
    </div>
  );
};

```

---

¡Excelente pregunta! `useMemo` y `useCallback` son hooks enfocados en **optimización de rendimiento**. Para un junior, la regla de oro con estos dos es: **no los uses por usarlos**. Úsalos únicamente cuando tengas un problema real de lentitud, ya que usarlos sin necesidad puede hacer que tu código sea más lento en lugar de más rápido.

Aquí tienes la continuación para agregarlos a tu guía:

---

## 4. `useMemo` (El Guardián de Resultados Pesados)

### ¿Qué es?

Recuerda (cachea) el **resultado** de un cálculo pesado entre un render y otro. Si los datos de entrada no han cambiado, React no vuelve a hacer el cálculo, simplemente te devuelve el resultado guardado.

### ✅ ¿Cuándo debe usarse?

* Cuando tienes un cálculo matemático muy pesado, o estás filtrando/ordenando una lista gigante de miles de elementos y notas que la aplicación se congela o se pone lenta al escribir en un input.

### ❌ ¿Cuándo NO debe usarse?

* Para cálculos sencillos (sumas simples, transformar un string, filtrar arreglos pequeños). El costo de crear la estructura de `useMemo` es a veces mayor que hacer el cálculo directo.

### 💻 Ejemplo de código:

```tsx
import { useState, useMemo } from "react";

export const ExpensiveList = ({ items }: { items: number[] }) => {
  const [filter, setFilter] = useState("");

  // Usamos useMemo para que el filtrado pesado solo se recalcule 
  // si la lista 'items' o el texto 'filter' cambian.
  const filteredItems = useMemo(() => {
    console.log("Calculando elementos filtrados...");
    return items.filter(item => item.toString().includes(filter));
  }, [items, filter]);

  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filtrar..." 
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

```

---

## 5. `useCallback` (El Guardián de Funciones)

### ¿Qué es?

Recuerda (cachea) la **definición de una función** entre renders. En JavaScript, cada vez que un componente se renderiza, las funciones que están adentro se crean de nuevo (tienen una dirección de memoria distinta). `useCallback` evita que esa función cambie de identidad si sus dependencias no han cambiado.

### ✅ ¿Cuándo debe usarse?

* Cuando le pasas una función como **prop a un componente hijo** que está optimizado con `React.memo` (para evitar que se re-renderice inútilmente).
* Cuando esa función es una **dependencia dentro de un `useEffect**` y quieres evitar que el efecto se dispare en un bucle infinito.

### ❌ ¿Cuándo NO debe usarse?

* Para funciones normales que le pasas a elementos HTML comunes (como un `<button onClick={handleClick}>`). No aporta nada y genera trabajo extra para React.

### 💻 Ejemplo de código:

```tsx
import { useState, useCallback } from "react";

export const ParentComponent = () => {
  const [count, setCount] = useState(0);

  // Memorizamos esta función para que su referencia no cambie en cada render
  const handleClick = useCallback(() => {
    console.log("Botón hijo presionado");
  }, []); // Sin dependencias, la función nunca se recrea

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Sumar al padre</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};

// Componente hijo (simulado)
import React from "react";
const ChildComponent = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("¡El componente hijo se renderizó!");
  return <button onClick={onClick}>Click en Hijo</button>;
});

```

---

## 💡 Resumen rápido de optimización (`useMemo` vs `useCallback`):

* ¿Quieres recordar el **resultado** de un cálculo? $\rightarrow$ **`useMemo`**
* ¿Quieres recordar la **función** en sí misma para que no cambie de dirección de memoria? $\rightarrow$ **`useCallback`**