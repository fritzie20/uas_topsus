import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ScheduleCardProps {
  schedule: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
  };
  fieldId: number;
  onBook: () => void;
}

const ScheduleCard = ({ schedule, fieldId, onBook }: ScheduleCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const date = new Date(schedule.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${!schedule.available ? 'opacity-75' : ''}`}>
      <div className="mb-2">
        <h4 className="text-lg font-semibold text-gray-800">{date}</h4>
        <p className="text-gray-600">
          {schedule.startTime} - {schedule.endTime}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded text-sm ${
            schedule.available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {schedule.available ? 'Tersedia' : 'Sudah Dipesan'}
        </span>
        {schedule.available && (
          <button
            onClick={onBook}
            disabled={isLoading || !schedule.available}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Memproses...' : 'Pesan'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
