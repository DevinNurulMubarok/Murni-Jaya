import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-hot-toast";

export default function BookingPaket() {
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    packageWeight: "",
    packageType: "Hemat",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Pengiriman paket berhasil dipesan!");
      
      // Reset form or redirect
      setFormData({
        senderName: "",
        senderPhone: "",
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        packageWeight: "",
        packageType: "Hemat",
        note: "",
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <section className="pt-32 pb-20 grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
                  Pemesanan Pengiriman Paket
                </h1>
                <p className="text-dark/60">
                  Isi detail pengiriman paket Anda di bawah ini dengan lengkap dan benar.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Pengirim */}
                <div className="bg-light p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-4 text-dark flex items-center gap-2">
                    <span className="text-xl">🧑</span> Data Pengirim
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark/80 mb-2">Nama Pengirim</label>
                      <input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark/80 mb-2">No. HP Pengirim</label>
                      <input
                        type="tel"
                        name="senderPhone"
                        value={formData.senderPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Contoh: 08123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Penerima */}
                <div className="bg-light p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-4 text-dark flex items-center gap-2">
                    <span className="text-xl">📍</span> Data Penerima
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark/80 mb-2">Nama Penerima</label>
                      <input
                        type="text"
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark/80 mb-2">No. HP Penerima</label>
                      <input
                        type="tel"
                        name="receiverPhone"
                        value={formData.receiverPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Contoh: 08123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark/80 mb-2">Alamat Lengkap Penerima</label>
                    <textarea
                      name="receiverAddress"
                      value={formData.receiverAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors resize-none"
                      placeholder="Masukkan alamat lengkap tujuan pengiriman"
                    />
                  </div>
                </div>

                {/* Data Paket */}
                <div className="bg-light p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-4 text-dark flex items-center gap-2">
                    <span className="text-xl">📦</span> Detail Paket
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark/80 mb-2">Berat Paket (Kg)</label>
                      <input
                        type="number"
                        name="packageWeight"
                        value={formData.packageWeight}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Contoh: 5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark/80 mb-2">Layanan Paket</label>
                      <select
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors bg-white"
                      >
                        <option value="Hemat">Paket Hemat</option>
                        <option value="Reguler">Paket Reguler</option>
                        <option value="Kilat">Paket Kilat</option>
                        <option value="Express">Paket Express</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark/80 mb-2">Catatan Tambahan (Opsional)</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary focus:ring-0 transition-colors resize-none"
                      placeholder="Isi barang, instruksi khusus kurir, dll."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        Memproses...
                      </>
                    ) : (
                      "Konfirmasi Pengiriman Paket"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
