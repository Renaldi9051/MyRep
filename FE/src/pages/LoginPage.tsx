import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { authErrorMessage, signInGoogle } from '../api/auth';
import { ApiError } from '../api/client';
import { LoginArt } from '../components/LoginArt';
import { useAuth } from '../features/auth/useAuth';

type Mode = 'awal' | 'masuk' | 'daftar';

function describe(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.isNetwork) return 'Tidak ada koneksi. Masuk butuh internet.';
    return authErrorMessage(err.code, err.message);
  }
  return 'Terjadi kesalahan. Coba lagi.';
}

// DESIGN §6.1 + PRD F7.1. "Masuk dengan email" membuka form di tempat ilustrasi.
export function LoginPage() {
  const { login, register } = useAuth();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<Mode>('awal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get('error') ? 'Masuk dengan Google gagal. Coba lagi atau pakai email.' : null,
  );

  const google = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInGoogle();
    } catch (err) {
      setError(describe(err));
      setBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'daftar') await register(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
    } catch (err) {
      setError(describe(err));
      setBusy(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  return (
    <main className="login">
      <span className="pill-label login__brand">MyReps</span>
      <h1 className="login__hello">{mode === 'daftar' ? 'Buat akun' : 'Hai!'}</h1>

      {mode === 'awal' ? (
        <>
          <div className="login__art">
            <LoginArt />
          </div>
          <p className="login__tagline">Catat latihan gym tanpa mengetik.</p>
          <div className="login__actions">
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button type="button" className="btn btn--primary btn--tall" disabled={busy} onClick={() => void google()}>
              Masuk dengan Google
            </button>
            <button type="button" className="btn btn--secondary btn--tall" disabled={busy} onClick={() => switchMode('masuk')}>
              Masuk dengan email
            </button>
          </div>
        </>
      ) : (
        <form className="login__form" onSubmit={(e) => void submit(e)}>
          {mode === 'daftar' && (
            <label className="field">
              <span className="field__label">Nama</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={60}
                required
              />
            </label>
          )}
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="input"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'daftar' ? 'new-password' : 'current-password'}
              minLength={8}
              required
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn--primary btn--tall" disabled={busy}>
            {busy ? 'Memproses…' : mode === 'daftar' ? 'Buat akun' : 'Masuk'}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--tall"
            disabled={busy}
            onClick={() => switchMode(mode === 'daftar' ? 'masuk' : 'daftar')}
          >
            {mode === 'daftar' ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
          <button type="button" className="text-btn login__back" onClick={() => switchMode('awal')}>
            Kembali
          </button>
        </form>
      )}
    </main>
  );
}
