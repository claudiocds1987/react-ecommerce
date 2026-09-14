// src/features/auth/components/LoginForm/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../slices/authApi';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '../../slices/authSlice';

export const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Función genérica para manejar los cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(form).unwrap();

      if (user.token) {
        dispatch(setCredentials({ user, token: user.token }));

        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err: unknown) {
      console.error('Error de login:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Ingresando...' : 'Login'}
      </button>

      {error && <p>Error al iniciar sesión</p>}
    </form>
  );
};

export default LoginForm;