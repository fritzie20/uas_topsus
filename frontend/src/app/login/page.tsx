'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | null }>({ text: '', type: null });

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store all necessary user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userRole', data.user.role);
      
      setMessage({ text: 'Login berhasil! Mengarahkan...', type: 'success' });
      setTimeout(() => {
        // Redirect admin to admin dashboard, regular users to home
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 1000);
    } else {
      // Deteksi error dari backend
      if (res.status === 404 && data.error === 'User not found') {
        setMessage({ text: 'Email tidak ditemukan', type: 'error' });
      } else if (res.status === 401 && data.error === 'Invalid password') {
        setMessage({ text: 'Password salah', type: 'error' });
      } else {
        setMessage({ text: data.error || 'Login gagal', type: 'error' });
      }
    }
  } catch (err) {
    setMessage({ text: 'Terjadi kesalahan saat login', type: 'error' });
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Masuk ke Akun Anda</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
              placeholder="••••••••"
            />
          </div>

          {message.text && (
            <p
              className={`text-sm mt-2 ${
                message.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Masuk
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:underline font-medium"
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
}
