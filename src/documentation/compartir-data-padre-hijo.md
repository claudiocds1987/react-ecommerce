# 📘 Cuando usar **props** o **composition pattern** entre padre e hijo en React

## 🔑 Props
- **Qué son:** parámetros que el padre pasa al hijo.  
- **Cuándo usarlos:**  
  - Para datos simples o estructurados (strings, números, arrays, objetos).  
  - Cuando el hijo sabe cómo renderizar esos datos de forma genérica.  
  - Ejemplo típico: `Button` que recibe `color`, `label`, `disabled`.  

```tsx
function Button({ color, label }) {
  return <button style={{ backgroundColor: color }}>{label}</button>;
}

<Button color="blue" label="Comprar" />
<Button color="red" label="Eliminar" />
```

👉 Props = comunicación estándar padre → hijo.  

---

## 🟩 Composition Pattern
- **Qué es:** el padre inyecta contenido o estructura completa en el hijo.  
- **Cuándo usarlo:**  
  - Cuando el hijo no debería decidir cómo mostrar la data.  
  - Cuando el padre necesita controlar la **estructura interna** (ej. íconos, badges, layouts).  
  - Ejemplo típico: `Card` que recibe `children` o un `Grid` con `renderRow`.  

```tsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Título dinámico</h2>
  <p>Contenido pasado desde el padre</p>
</Card>
```

👉 Composition = flexibilidad máxima en la UI.  

---

## 📊 Diferencia práctica

| Caso | Props | Composition |
|------|-------|-------------|
| Pasar datos simples (color, texto, booleanos) | ✅ | ❌ |
| Pasar arrays/objetos estructurados (ej. productos) | ✅ | ❌ |
| Personalizar cómo se renderiza cada item | ❌ | ✅ |
| Controlar estructura interna (slots, children) | ❌ | ✅ |

---

## 🚀 Conclusión
- **Usá props** cuando el hijo necesita datos claros y genéricos.  
- **Usá composition** cuando el padre quiere decidir cómo se renderiza la UI interna.  
- En proyectos reales, lo más común es **mezclar ambos**: props para atributos simples y composition para contenido complejo.  

---