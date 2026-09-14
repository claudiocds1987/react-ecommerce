## 📌 Pasos para crear un proyecto React desde 0 con Vite y Bun

### 1. Abrir la consola (cmd)
- Abrir **cmd** desde el menú inicio.
- Usar `cd..` dos veces hasta quedar en la raíz del disco `C:\`.

---

### 2. Crear el proyecto
```bash
bun create vite ./nombre-del-proyecto
```
- Elegir la opción **React**.  
- Elegir la opción **TypeScript**.

---

### 3. Instalar dependencias con Bun (**Bun** mejora la velocidad de instalación y ejecución en comparacion con npm)
```bash
cd nombre-del-proyecto
bun install
bun dev
```

---

### 4. Abrir el proyecto en Visual Studio Code
1. Abrir **Visual Studio Code**.  
2. Ir a **File → Open Folder...**  
3. Seleccionar la carpeta del proyecto recién creado:  
   ```
   C:\React-projects\nombre-del-proyecto
   ```

---

### 5. Correr el proyecto
Para iniciar el servidor de desarrollo:
```bash
bun run dev
```

El proyecto estará disponible en:
```
http://localhost:5173/
```

---

### 🔑 ¿Qué es Bun?
- **Runtime**: similar a Node.js o Deno, permite ejecutar código JavaScript/TypeScript directamente.  
- **Administrador de paquetes**: reemplaza a npm/yarn/pnpm para instalar dependencias (`bun install`, `bun add`).  
- **Bundler y transpiler**: compila y agrupa tu código (usa internamente esbuild/Zig).  
- **Test runner**: incluye su propio sistema de pruebas (`bun test`).  

### 💡 Comandos útiles con Bun para React (equivalentes a npm)

* **Instalar todas las dependencias (reemplaza a `npm i`):** `bun install` (o `bun i`)
* **Agregar una nueva librería (reemplaza a `npm i <paquete>`):** `bun add <nombre-del-paquete>`
* **Eliminar una librería (reemplaza a `npm uninstall`):** `bun remove <nombre-del-paquete>`
* **Ejecutar un script personalizado (reemplaza a `npm run`):** `bun run <nombre-del-script>`
* **Construir para producción (Build):** `bun run build`

---




