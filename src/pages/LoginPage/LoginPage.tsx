import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';

export const LoginPage = () => {
  return (
    <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Iniciar Sesión</h1>
      <LoginForm />
    </main>
  );
};

export default LoginPage;