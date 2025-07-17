interface BookingHistoryCardProps {
  booking: {
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
  };
  onCancel?: (id: number) => void;
}

const BookingHistoryCard = ({ booking, onCancel }: BookingHistoryCardProps) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
  };

  const date = new Date(booking.schedule.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {booking.field.name}
          </h3>
          <p className="text-gray-600">{booking.field.location}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            statusColors[booking.status]
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">{date}</p>
        <p className="text-gray-700">
          {booking.schedule.startTime} - {booking.schedule.endTime}
        </p>
      </div>

      {booking.status === 'PENDING' && onCancel && (
        <div className="flex justify-end">
          <button
            onClick={() => onCancel(booking.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Batalkan Pesanan
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryCard;
