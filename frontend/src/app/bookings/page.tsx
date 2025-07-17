'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingHistoryCard from '@/components/BookingHistoryCard';

interface Booking {
  id: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  field: {
    name: string;
    location: string;
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(
          `http://localhost:3001/api/bookings/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(
        `http://localhost:3001/api/bookings/${bookingId}/cancel/${userId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to cancel booking');

      // Update the bookings list
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'CANCELED' as const }
            : booking
        )
      );

      alert('Booking cancelled successfully');
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Riwayat Pemesanan</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Belum ada riwayat pemesanan</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingHistoryCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}
