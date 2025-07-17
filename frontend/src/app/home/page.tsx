'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FieldCard from '@/components/FieldCard';

interface Field {
  id: number;
  name: string;
  location: string;
  description?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchFields = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/fields', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch fields');
        const data = await response.json();
        setFields(data);
      } catch (err) {
        setError('Failed to load fields. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Lapangan</h1>
        <p className="text-gray-600 mt-2">Pilih lapangan yang tersedia untuk melihat jadwal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Tidak ada lapangan tersedia saat ini</p>
        </div>
      )}
    </div>
  );
}
