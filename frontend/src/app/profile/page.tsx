'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import BarHeader from '@/components/BarHeader';

const BACKEND_URL = 'http://localhost:3001';

interface PredictionHistory {
  id: number;
  input: any;
  label_prediksi: string;
  probabilitas: number;
  waktu_prediksi: string;
}
interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState<'profile' | 'history'>('profile');
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState<any>(null);

  useEffect(() => {
    setLoadingProfile(true);
    fetch(`${BACKEND_URL}/api/user-profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoadingProfile(false);
      })
      .catch(() => setLoadingProfile(false));
  }, []);

  useEffect(() => {
    setLoadingHistory(true);
    fetch(`${BACKEND_URL}/api/prediction-history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoadingHistory(false);
      })
      .catch(() => {
        setHistory([]);
        setLoadingHistory(false);
      });
  }, []);

  // Mapping value ke label frontend
  const inputValueLabels: Record<string, Record<string, string>> = {
    Lembur: { Yes: 'Ya', No: 'Tidak' },
    Kepuasan: {
      '1': 'Sangat Tidak Puas',
      '2': 'Kurang Puas',
      '3': 'Puas',
      '4': 'Sangat Puas',
    },
    KepuasanLingkungan: {
      '1': 'Sangat Tidak Nyaman',
      '2': 'Kurang Nyaman',
      '3': 'Nyaman',
      '4': 'Sangat Nyaman',
    },
    WorkLifeBalance: {
      '1': 'Sangat Buruk',
      '2': 'Buruk',
      '3': 'Baik',
      '4': 'Sangat Baik',
    },
  };

  // Custom label untuk setiap field
  const customLabels: Record<string, string> = {
    Karyawan: 'ID/Nama Karyawan',
    Lembur: 'Apakah karyawan sering melakukan lembur?',
    Kepuasan: 'Tingkat kepuasan karyawan terhadap pekerjaannya',
    KepuasanLingkungan: 'Tingkat kenyamanan karyawan terhadap lingkungan kerja',
    WorkLifeBalance: 'Tingkat keseimbangan kerja dan kehidupan pribadi',
    Pendapatan: 'Pendapatan bulanan ($)',
    MasaKerja: 'Jumlah tahun bekerja',
    TerakhirkaliPromosi: 'Tahun terakhir mendapat promosi',
    Jabatan: 'Jabatan saat ini',
    JumlahPelatihan: 'Jumlah pelatihan dalam setahun',
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <BarHeader />

      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Profil Pengguna</h1>

        {/* Data Diri */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Data Diri</h2>
          {loadingProfile ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : profile ? (
            <div className="space-y-2 text-gray-700">
              <div><span className="font-semibold text-blue-700">Username:</span> {profile.username}</div>
              <div><span className="font-semibold text-blue-700">Email:</span> {profile.email}</div>
              <div><span className="font-semibold text-blue-700">Tanggal Daftar:</span> {new Date(profile.createdAt).toLocaleDateString()}</div>
            </div>
          ) : (
            <p className="text-red-500">Gagal memuat data user.</p>
          )}
        </div>

        {/* Riwayat Prediksi */}
        <div className="bg-white rounded-lg shadow p-6 border border-blue-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Riwayat Prediksi</h2>
          </div>
          {loadingHistory ? (
            <p className="text-gray-500">Memuat riwayat...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">Tidak ada riwayat prediksi.</p>
          ) : (
            <div className="overflow-x-auto text-gray-700">
              <table className="w-full border border-blue-300 rounded-lg">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border px-2 py-1 text-blue-700">Waktu</th>
                    <th className="border px-2 py-1 text-blue-700">Detail</th>
                    <th className="border px-2 py-1 text-blue-700">Hasil</th>
                    <th className="border px-2 py-1 text-blue-700">Probabilitas</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="border px-2 py-1">{new Date(item.waktu_prediksi).toLocaleString()}</td>
                      <td className="border px-2 py-1 text-xs">
                        <button
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          onClick={() => { setModalInput(item.input); setModalOpen(true); }}
                          title="Lihat detail input"
                        >
                          <Info size={18} /> Detail
                        </button>
                      </td>
                      <td className="border px-2 py-1">{
                        item.label_prediksi === 'Yes' ? 'Resign' :
                        item.label_prediksi === 'No' ? 'Tidak Resign' : item.label_prediksi
                      }</td>
                      <td className="border px-2 py-1">{item.probabilitas}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal detail input */}
          {modalOpen && (
            <div className="fixed inset-0 bg-blue-100/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200">
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
                  onClick={() => setModalOpen(false)}
                  aria-label="Tutup"
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-6 text-blue-700 text-center">Detail Input Prediksi</h3>
                <div className="space-y-3">
                  {modalInput && Object.keys(customLabels).filter(label => label in modalInput).map((label) => (
                    <div key={label} className="grid grid-cols-2 gap-2 items-center border-b pb-2">
                      <span className="font-semibold text-blue-600 text-left">{customLabels[label] || label}</span>
                      <span className="text-gray-700 text-left">{
                        inputValueLabels[label] && inputValueLabels[label][String(modalInput[label])]
                          ? inputValueLabels[label][String(modalInput[label])]
                          : String(modalInput[label])
                      }</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
