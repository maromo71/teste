import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      // Opcional: redirecionar para uma página de "verifique seu e-mail"
      // router.push('/check-email');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Senha (mínimo 6 caracteres):</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Cadastrar</button>
      </form>
      <p>
        Já tem uma conta? <Link href="/login">Faça Login</Link>
      </p>
    </div>
  );
}