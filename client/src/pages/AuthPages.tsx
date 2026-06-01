import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../shared/api/client';
import { useAuth } from '../context/AuthContext';
import { XLogo } from '../components/icons/XLogo';

export function LoginPage() {
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(loginId, password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <XLogo className="h-8 w-8 lg:hidden" />

      <div>
        <h1 className="text-[31px] font-extrabold leading-9">Connexion</h1>
        <p className="mt-6 text-[17px] font-bold leading-6">Content de vous revoir</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Email ou nom d'utilisateur"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          autoComplete="username"
          required
          className="x-input-auth"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="x-input-auth"
        />
        {error && <p className="text-[13px] text-x-pink">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="x-btn-post w-full py-3 disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="text-[15px] text-x-gray">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-x-blue hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="space-y-8">
      <XLogo className="h-8 w-8 lg:hidden" />

      <div>
        <h1 className="text-[31px] font-extrabold leading-9">Créer votre compte</h1>
        <p className="mt-6 text-[17px] font-bold leading-6">C&apos;est parti</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Nom"
          value={form.displayName}
          onChange={update('displayName')}
          required
          className="x-input-auth"
        />
        <input
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={update('username')}
          pattern="[a-zA-Z0-9_]{3,30}"
          required
          className="x-input-auth"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update('email')}
          required
          className="x-input-auth"
        />
        <input
          type="password"
          placeholder="Mot de passe (8 caractères min.)"
          value={form.password}
          onChange={update('password')}
          minLength={8}
          required
          className="x-input-auth"
        />
        {error && <p className="text-[13px] text-x-pink">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="x-btn-post w-full py-3 disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer un compte'}
        </button>
      </form>

      <p className="text-[15px] text-x-gray">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="text-x-blue hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
