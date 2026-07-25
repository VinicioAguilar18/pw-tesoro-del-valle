// Login del anfitrión. Un solo usuario (creado a mano con
// supabase.auth.admin.createUser, ver scripts/create-admin-user.mjs).
// Client component porque supabase-js de auth corre en el browser.
'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError('Email o contraseña incorrectos.');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <main className="mx-auto flex max-w-sm flex-col justify-center px-4 py-24">
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Admin — Tesoro del Valle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block font-sans text-sm font-semibold text-primary">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block font-sans text-sm font-semibold text-primary">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
          />
        </div>

        {error && <p className="font-sans text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 font-sans font-semibold text-background disabled:opacity-50"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
