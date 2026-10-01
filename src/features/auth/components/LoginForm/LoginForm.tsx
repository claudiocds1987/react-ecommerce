import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLoginMutation } from "../../slices/authApi";
import { useAppDispatch } from "@/app/store.hooks";
import { setCredentials } from "../../slices/authSlice";
import { schema, type FormValues } from "./schema/login-schema";
import InputFormCustom from "@/shared/components/InputFormCustom/InputFormCustom";
import { Button } from "@/shared/components";

export const LoginForm = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Configuración de React Hook Form usando el esquema importado y FormValues
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const user = await login(data).unwrap();
      if (user.token) {
        dispatch(setCredentials({ user, token: user.token }));
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err: unknown) {
      console.error("Error de login:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-8 md:pt-12 pb-12 bg-gray-50">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-lg md:p-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-800">
            ¡Bienvenido!
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-card flex flex-col gap-4"
        >
          <div className="space-y-1">
            <InputFormCustom
              name="username"
              control={control}
              label="Usuario"
              type="text"
              error={errors.username}
            />
          </div>

          <div className="space-y-1 relative">
            <InputFormCustom
              name="password"
              control={control}
              label="Contraseña"
              type={hidePassword ? "password" : "text"}
              error={errors.password}
            />

            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
              className="absolute right-3 top-10.5 text-slate-400 hover:text-slate-600 cursor-pointer z-10"
            >
              {hidePassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Error al iniciar sesión. Verifica tus datos.</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid}
            isLoading={isLoading}
            variant="primary"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Ingresar
          </Button>
          {/*  <button
            type="submit"
            disabled={!isValid || isLoading}
            className="mt-2 w-full py-3 px-4 text-white font-medium bg-indigo-600 rounded-xl hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
