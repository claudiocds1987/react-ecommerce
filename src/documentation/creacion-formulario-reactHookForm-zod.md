# 🧩 Documentación del Proyecto de Formulario con React Hook Form + Zod

Este proyecto implementa un formulario en **React** con validaciones tipadas usando **Zod** y gestión de estado con **React Hook Form**.  
La arquitectura está organizada para mantener la lógica, los componentes y los estilos separados y reutilizables.

---

## 📂 Estructura del Proyecto

```
src/
 ├── components/
 │    └── customForm/
 │         ├── components/
 │         │    ├── customInput.css
 │         │    └── customInput.tsx
 │         └── customForm.tsx
 ├── models/
 │    └── form.model.ts
 └── index.ts
```

---

## 🧱 Archivo: `form.model.ts`

### 📌 Descripción
Define el **esquema de validación** del formulario usando la librería **Zod**.  
Este archivo contiene las reglas que determinan qué datos son válidos y cómo deben ser verificados.

### 📜 Código principal
```ts
import z from "zod";

export const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password is not equal"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof schema>;
```

### 🧠 Qué hace
- **`z.object()`**: crea un objeto con las reglas de validación para cada campo.
- **`.min()`**: define la cantidad mínima de caracteres y el mensaje de error.
- **`.email()`**: valida el formato del correo electrónico.
- **`.refine()`**: agrega una validación personalizada (verifica que las contraseñas coincidan).
- **`FormValues`**: genera automáticamente el tipo TypeScript para los datos del formulario.

---

## 🧩 Archivo: `customForm.tsx`

### 📌 Descripción
Componente principal del formulario.  
Se encarga de inicializar **React Hook Form**, conectar el esquema de Zod y renderizar los campos personalizados.

### 📜 Código principal
```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import InputFormCustom from "./components/customInput";
import { schema, type FormValues } from "../models/form.model";

const CustomForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputFormCustom name="name" control={control} label="Name" type="text" error={errors.name} />
      <InputFormCustom name="email" control={control} label="Email" type="email" error={errors.email} />
      <InputFormCustom name="password" control={control} label="Password" type="password" error={errors.password} />
      <InputFormCustom name="confirmPassword" control={control} label="Confirm Password" type="password" error={errors.confirmPassword} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomForm;
```

### 🧠 Qué hace
- **`useForm()`**: inicializa el formulario y gestiona su estado.
- **`zodResolver(schema)`**: conecta las reglas de Zod con React Hook Form.
- **`mode: "onBlur"`**: valida los campos cuando el usuario sale del input.
- **`errors`**: contiene los mensajes de error generados por las validaciones.
- **`handleSubmit(onSubmit)`**: ejecuta la función `onSubmit` solo si los datos son válidos.
- **`InputFormCustom`**: renderiza cada campo con su etiqueta, tipo y mensaje de error.

---

## 🧩 Archivo: `customInput.tsx`

### 📌 Descripción
Componente reutilizable para los campos del formulario.  
Encapsula la lógica de conexión con React Hook Form y la presentación visual del input.

### 📜 Código principal
```tsx
import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";
import "./customInput.css";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  error?: FieldError | undefined;
}

const InputFormCustom = <T extends FieldValues>({ name, control, label, type, error }: Props<T>) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type || "text"}
            {...field}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default InputFormCustom;
```

### 🧠 Qué hace
- **`Controller`**: conecta el input con el estado del formulario.
- **`control`**: objeto que gestiona los valores y validaciones.
- **`error`**: muestra el mensaje de error si el campo no pasa la validación.
- **`className`**: aplica estilos condicionales (`is-invalid`) para inputs con error.
- **`Props<T>`**: usa genéricos para que el componente funcione con cualquier tipo de formulario.

---

## 🎨 Archivo: `customInput.css`

### 📌 Descripción
Define los estilos visuales del componente `InputFormCustom`.

### 📜 Código principal
```css
.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
}
```

### 🧠 Qué hace
- **`.is-invalid`**: pinta el borde del input en rojo si hay error.
- **`.error-message`**: muestra el texto del error en rojo y más pequeño.
- **`.form-group`**: organiza cada campo con su etiqueta y input.
- **`.form-control`**: aplica estilos base a todos los inputs.

---

## 🧩 Archivo: `index.ts`

### 📌 Descripción
Archivo de **exportación centralizada**.  
Permite importar componentes desde un único punto, simplificando la estructura y mejorando la mantenibilidad del código.

### 📜 Código principal
```ts
export * from "./button/button";
export * from "./customForm/customForm";
export * from "./customForm/components/customInput";
```

### 🧠 Qué hace
- **`export * from`**: reexporta todo lo que se exporta desde los archivos indicados.
- Esto permite que otros módulos importen directamente desde `index.ts` sin tener que navegar por carpetas internas.
- Ejemplo:
  ```ts
  import { CustomForm, InputFormCustom } from "@/components";
  ```
  En lugar de:
  ```ts
  import CustomForm from "@/components/customForm/customForm";
  import InputFormCustom from "@/components/customForm/components/customInput";
  ```
- Mejora la **organización y escalabilidad** del proyecto, especialmente cuando crece el número de componentes.

---

## 🔗 Flujo General del Proyecto

1. **`form.model.ts`** → Define las reglas de validación con Zod.  
2. **`customForm.tsx`** → Inicializa React Hook Form y renderiza los campos.  
3. **`customInput.tsx`** → Renderiza cada input y muestra errores.  
4. **`customInput.css`** → Aplica los estilos visuales.  
5. **`index.ts`** → Centraliza las exportaciones para facilitar los imports.

---

## 🚀 Resultado Final
El formulario:
- Valida automáticamente los datos según el esquema de Zod.  
- Muestra errores visuales y mensajes claros.  
- Envía los datos válidos al `onSubmit`.  
- Mantiene una arquitectura modular, limpia y escalable.

---

## 🔄 Cómo actualizar el formulario con valores dinámicos desde una API

Podés cargar datos externos (ejemplo: perfil de usuario desde una API) y aplicarlos al formulario usando el método **`reset`** de React Hook Form.

### 📜 Ejemplo
```tsx
const [initialData, setInitialData] = useState<FormValues | null>(null);

useEffect(() => {
  async function fetchData() {
    const response = await fetch("/api/user"); // tu endpoint
    const data: FormValues = await response.json();
    setInitialData(data);
  }
  fetchData();
}, []);

const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
  resolver: zodResolver(schema),
  mode: "onBlur",
  defaultValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
});

// Cuando llegan los datos, actualizamos el formulario
useEffect(() => {
  if (initialData) {
    reset(initialData);
  }
}, [initialData, reset]);

const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
  console.log("Datos enviados:", data);
};
```

### 🧠 Explicación
- **`defaultValues`**: inicializa el formulario vacío.  
- **`fetchData()`**: obtiene los datos desde una API.  
- **`reset(initialData)`**: actualiza el formulario con los valores dinámicos una vez que llegan.  
- Esto permite que el formulario se inicialice vacío y luego se complete automáticamente con los datos del usuario.

---

## ⚡ Casos de uso
- **Editar perfil**: precargar datos del usuario en el formulario.  
- **Formularios de administración**: cargar registros desde base de datos.  
- **Prefill inteligente**: sugerir valores iniciales basados en contexto.

---
