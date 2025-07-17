'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleCard from '@/components/ScheduleCard';

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Field {
  id: number;
  name: string;
  location: string;
  description?: string;
  schedules: Schedule[];
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchField = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/fields/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch field');
        const data = await response.json();
        setField(data);
      } catch (err) {
        setError('Failed to load field details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchField();
    }
  }, [params.id]);

  const handleBooking = async (scheduleId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fieldId: field?.id,
          scheduleId,
        }),
      });

      if (!response.ok) throw new Error('Failed to book schedule');

      // Refresh the field data to update availability
      const updatedField = await fetch(`http://localhost:3001/api/fields/${params.id}`).then(res => res.json());
      setField(updatedField);

      alert('Booking successful!');
    } catch (err) {
      alert('Failed to book schedule. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Field not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{field.name}</h1>
        <p className="text-gray-600 mb-2">{field.location}</p>
        {field.description && (
          <p className="text-gray-500">{field.description}</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Jadwal Tersedia</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {field.schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            fieldId={field.id}
            onBook={() => handleBooking(schedule.id)}
          />
        ))}
      </div>

      {field.schedules.length === 0 && (
        <p className="text-gray-600 text-center py-8">
          Tidak ada jadwal tersedia untuk saat ini
        </p>
      )}
    </div>
  );
}
