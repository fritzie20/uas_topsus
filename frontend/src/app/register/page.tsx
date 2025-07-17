'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // reset pesan

    if (!name || !email || !password) {
      setMessage({ text: 'Semua kolom harus diisi!', type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || 'Registrasi gagal.', type: 'error' });
      } else {
        setMessage({ text: 'Registrasi berhasil! Mengarahkan ke halaman login...', type: 'success' });
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Terjadi kesalahan saat registrasi.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Buat Akun Baru</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Daftar
          </button>
        </form>

        {/* Pesan feedback */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm border ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700 border-red-400'
                : 'bg-green-100 text-green-700 border-green-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
}
