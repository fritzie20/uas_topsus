'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">Selamat Datang di SportField</h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Platform booking lapangan olahraga terpercaya. Temukan dan pesan lapangan favorit Anda dengan mudah dan cepat.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md w-full sm:w-auto"
          >
            Mulai Booking
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <h3 className="font-semibold text-blue-800">Mudah</h3>
            <p className="text-gray-600">Booking lapangan dalam hitungan menit</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-blue-800">Aman</h3>
            <p className="text-gray-600">Pembayaran dan transaksi terjamin</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-blue-800">Fleksibel</h3>
            <p className="text-gray-600">Pilih jadwal sesuai kebutuhan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
