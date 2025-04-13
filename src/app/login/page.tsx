'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/UseAuth';
import { useRouter } from 'next/navigation';
import Style from './page.module.css';
export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(credentials);
    if (result.success) {
      router.push('/');
    }else{
      setError(result.error ?? null);
    }
    setLoading(false);
  };

  return (
    <main className={Style.wrapper}>
    <form onSubmit={handleSubmit} className={Style.formWrapper}>
    <h1>Login</h1>
    {error && <p className={Style.error}>{error}</p>}
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        id='username'
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        id='password'
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">{loading ? '...Loading' : 'Login' }</button>
    </form>
    </main>
  );
}