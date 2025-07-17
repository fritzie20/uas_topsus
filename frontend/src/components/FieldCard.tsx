import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FieldCardProps {
  field: {
    id: number;
    name: string;
    location: string;
    description?: string;
  };
}

const FieldCard = ({ field }: FieldCardProps) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{field.name}</h3>
      <p className="text-gray-600 mb-4">{field.location}</p>
      {field.description && (
        <p className="text-gray-500 mb-4 text-sm">{field.description}</p>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              router.push('/login');
            } else {
              router.push(`/booking/${field.id}`);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Lihat Jadwal
        </button>
      </div>
    </div>
  );
};

export default FieldCard;
