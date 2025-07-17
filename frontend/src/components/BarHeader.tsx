import { User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BarHeader() {
  const router = useRouter();
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-blue-700 text-white shadow rounded-b-xl relative">
      {/* Exit Icon kiri */}
      <img
        src="/eit.png"
        alt="Exit"
        className="w-7 h-7 cursor-pointer hover:opacity-80"
        // onClick={() => router.push('/login')}
      />
      <div className="flex items-center gap-6">
        {/* Menu Prediksi */}
        <button
          className="font-bold text-lg hover:text-blue-200"
          onClick={() => router.push('/predict')}
        >
          Prediksi
        </button>
        {/* Profile Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 font-bold text-lg hover:text-blue-200 focus:outline-none"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <User2 className="w-7 h-7" />
          </button>
          <div className="absolute right-0 mt-2 w-40 bg-white text-blue-700 rounded-lg shadow-lg border border-blue-200 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 invisible group-hover:visible group-focus-within:visible">
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-t-lg"
              onClick={() => router.push('/profile')}
            >
              Profil
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-lg border-t border-blue-100"
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
