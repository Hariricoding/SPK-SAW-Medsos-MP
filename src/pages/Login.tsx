// ─── Login Page ───────────────────────────────────────────────────────────────
// UI-GUIDELINE: Form login modern, brand teal, ilustrasi kiri

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Trophy, LogIn, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const VALID: Record<string, string> = { admin: 'admin123' };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Username tidak boleh kosong.'); return; }
    if (!password.trim()) { setError('Password tidak boleh kosong.'); return; }

    setLoading(true);
    // Simulasi network delay
    await new Promise((r) => setTimeout(r, 600));

    if (!VALID[username] || VALID[username] !== password) {
      setError('Username atau password salah.');
      setLoading(false);
      return;
    }

    const ok = login(username);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Login gagal. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8FAF9' }}>

      {/* ── Left Panel — Branding ────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-10 relative overflow-hidden"
        style={{ backgroundColor: '#287C76' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: '#FFF5AE', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#55AAA1', transform: 'translate(-40%, 40%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Trophy size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">SPK Konten</p>
            <p className="text-white/60 text-xs">Media Sosial SAW</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">
            <img
              src="/marhaban-parfum.png"
              alt="Marhaban Parfum"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight">
            Sistem Pendukung<br />Keputusan Konten<br />Media Sosial
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Pilih konten media sosial terbaik secara objektif menggunakan
            metode Simple Additive Weighting (SAW).
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3">
            {[
              '📈 Analisis multi-kriteria (Views, Likes, Comments, Shares)',
              '⚖️ Pembobotan kriteria yang fleksibel',
              '🏆 Perangkingan otomatis dengan nilai SAW',
              '🖨️ Laporan hasil yang dapat dicetak',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/80 text-sm">
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs relative z-10">
          © 2026 SPK Konten — v1.0.0
        </p>
      </div>

      {/* ── Right Panel — Form ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#287C76' }}>
              <Trophy size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-brand-text">SPK Konten</p>
              <p className="text-brand-muted text-xs">Media Sosial SAW</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brand-text">Selamat datang 👋</h1>
            <p className="text-brand-muted text-sm mt-1">
              Masukkan kredensial Anda untuk mengakses sistem.
            </p>
          </div>

          {/* Demo credential hint */}
          <div className="mb-5 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
            style={{ backgroundColor: '#F0F7F6', border: '1px solid #C8D8D6' }}>
            <span className="text-lg">💡</span>
            <p className="text-brand-muted">
              Demo: <strong className="text-primary">admin</strong> /&nbsp;
              <strong className="text-primary">admin123</strong>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Username */}
            <div>
              <label htmlFor="username"
                className="block text-sm font-medium text-brand-text mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Masukkan username"
                className={[
                  'w-full px-3.5 py-2.5 rounded-lg text-sm border transition-all',
                  'text-brand-text placeholder-brand-muted bg-white',
                  error ? 'border-red-400' : 'border-brand-border',
                ].join(' ')}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password"
                className="block text-sm font-medium text-brand-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan password"
                  className={[
                    'w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm border transition-all',
                    'text-brand-text placeholder-brand-muted bg-white',
                    error ? 'border-red-400' : 'border-brand-border',
                  ].join(' ')}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted
                    hover:text-brand-text transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border
                border-red-200 rounded-lg text-sm text-red-600">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                rounded-lg text-white text-sm font-semibold
                transition-all duration-200 mt-2
                disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: loading ? '#55AAA1' : '#287C76' }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLElement).style.backgroundColor = '#1F5E5A')}
              onMouseLeave={(e) => !loading && ((e.target as HTMLElement).style.backgroundColor = '#287C76')}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-brand-muted">
            Sistem Pendukung Keputusan © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
