import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const initialLayanan = [
  {
    id: 1,
    icon: "📦",
    nama: "Paket Hemat",
    tarif: "Mulai Rp15.000",
    features: [
      "Berat hingga 30 Kg",
      "Estimasi 1 - 4 Hari",
      "Pelacakan dasar",
      "Asuransi opsional",
    ],
    color: "bg-primary",
  },
  {
    id: 2,
    icon: "⚡",
    nama: "Paket Express",
    tarif: "Mulai Rp30.000",
    features: [
      "Berat hingga 10 Kg",
      "Estimasi 1 - 3 Hari",
      "Pelacakan real-time",
      "Asuransi gratis",
    ],
    color: "bg-secondary",
  },
  {
    id: 3,
    icon: "📦",
    nama: "Paket Kilat",
    tarif: "Mulai Rp25.000",
    features: [
      "Berat hingga 5 Kg",
      "Estimasi 1 - 3 Hari",
      "Pelacakan real-time",
      "Asuransi gratis",
    ],
    color: "bg-dark",
  },
  {
    id: 4,
    icon: "📦",
    nama: "Paket Reguler",
    tarif: "Mulai Rp 50.000",
    features: [
      "Berat hingga 100 Kg",
      "Estimasi 1 - 3 Hari",
      "Pelacakan real-time",
      "Asuransi gratis",
    ],
    color: "bg-primary",
  },
]; 

export default function Paket() {
  const [layanan, setLayanan] = useState(initialLayanan);

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const res = await fetch("http://localhost:8000/paket");
        if (!res.ok) throw new Error("Fetch paket gagal");
        const json = await res.json();
        if (json?.data) {
          // normalisasi data dari backend ke bentuk yang komponen harapkan
          const normalized = json.data.map((p: any) => ({
            id: p.id,
            nama: p.nama || p.name || "-",
            tarif: p.tarif || p.price || "-",
            // jika backend punya fields terpisah, gabungkan jadi fitur
            features: p.features || [
              p.berat ? `Berat: ${p.berat}` : null,
              p.estimasi ? `Estimasi: ${p.estimasi}` : null,
              p.tracking ? `Tracking: ${p.tracking}` : null,
              p.asuransi ? `Asuransi: ${p.asuransi}` : null,
            ].filter(Boolean),
            color: p.color || (p.warna === 'primary' ? 'bg-primary' : p.warna === 'secondary' ? 'bg-secondary' : p.warna === 'danger' ? 'bg-dark' : 'bg-primary')
          }));
          setLayanan(normalized);
        }
      } catch (e) {
        console.warn("Tidak dapat mengambil data paket, gunakan data lokal.", e);
      }
    };

    fetchPaket();
  }, []);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6">Layanan Pengiriman Paket</h1>
          <p className="text-dark/60 text-lg max-w-2xl mx-auto">Kirim paket ke berbagai kota dengan layanan aman dan terpercaya.</p>
        </div>
      </section>

      {/* Paket Grid (mirip services) */}
      <section className="py-24 bg-white lowercase-config">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {layanan.map((item: any) => (
              <div key={item.id} className="flex flex-col h-full rounded-3xl overflow-hidden border border-dark/5 shadow-sm hover:shadow-2xl transition-all">
                <div className={`p-8 text-white ${item.color}`}>
                  <h3 className="text-2xl font-display font-bold mb-2">{item.nama}</h3>
                  <p className="text-white/80 text-sm mb-6">{item.tarif}</p>
                  <p className="text-3xl font-bold">{item.tarif}</p>
                </div>
                <div className="p-8 bg-white grow flex flex-col">
                  <ul className="space-y-4 mb-10 grow">
                    {item.features.map((f: string, fidx: number) => (
                      <li key={fidx} className="flex items-center gap-3 text-dark/70 text-sm">
                        <Check className="text-primary shrink-0" size={18} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking-paket" className={`w-full py-4 rounded-xl text-center font-bold text-white! transition-opacity hover:opacity-90 ${item.color}`}>
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-center font-bold text-2xl mb-8">Kenapa Memilih Murni Jaya?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

            <div className="p-6">
              <h1 className="text-4xl">📦</h1>
              <h5 className="mt-3 font-semibold">Paket Aman</h5>
              <p className="mt-2">Barang dikirim dengan penanganan yang aman.</p>
            </div>

            <div className="p-6">
              <h1 className="text-4xl">📍</h1>
              <h5 className="mt-3 font-semibold">Tracking Paket</h5>
              <p className="mt-2">Pantau posisi paket secara real-time.</p>
            </div>

            <div className="p-6">
              <h1 className="text-4xl">⚡</h1>
              <h5 className="mt-3 font-semibold">Pengiriman Cepat</h5>
              <p className="mt-2">Estimasi pengiriman sesuai layanan yang dipilih.</p>
            </div>

           <div className="p-6">
              <h1 className="text-4xl">💰</h1>
              <h5 className="mt-3 font-semibold">Harga Terjangkau</h5>
              <p className="mt-2">Harga yang terjangkau untuk semua kalangan.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Cara Kirim */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-bold text-2xl mb-8">Cara Mengirim Paket</h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <div className="p-4">
              <h1 className="text-2xl">1️⃣</h1>
              <p className="mt-2">Datang ke Agen</p>
            </div>
            <div className="p-4">
              <h1 className="text-2xl">2️⃣</h1>
              <p className="mt-2">Serahkan Paket</p>
            </div>
            <div className="p-4">
              <h1 className="text-2xl">3️⃣</h1>
              <p className="mt-2">Isi Data</p>
            </div>
            <div className="p-4">
              <h1 className="text-2xl">4️⃣</h1>
              <p className="mt-2">Bayar Ongkir</p>
            </div>
            <div className="p-4">
              <h1 className="text-2xl">5️⃣</h1>
              <p className="mt-2">Paket Dikirim</p>
            </div>
            <div className="p-4">
              <h1 className="text-2xl">6️⃣</h1>
              <p className="mt-2">Lacak Paket</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-bold text-2xl mb-6">FAQ Paket Barang</h2>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold">Berapa berat maksimal paket?</h3>
              <p className="mt-2 text-sm">Berat maksimal mengikuti jenis layanan yang dipilih.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold">Apakah tersedia tracking?</h3>
              <p className="mt-2 text-sm">Ya, seluruh layanan menyediakan pelacakan paket.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}