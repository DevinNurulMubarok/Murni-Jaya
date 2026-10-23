import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "Bagaimana cara memesan tiket bus Murni Jaya?",
    answer: "Anda dapat memesan tiket melalui website kami di halaman 'Pesan Tiket', menggunakan aplikasi mobile, atau datang langsung ke agen resmi dan terminal terdekat kami.",
  },
  {
    question: "Apakah tiket yang sudah dibeli bisa dibatalkan atau di-reschedule?",
    answer: "Bisa. Pembatalan atau reschedule dapat dilakukan maksimal 24 jam sebelum jadwal keberangkatan dengan syarat dan ketentuan yang berlaku. Silakan hubungi customer service kami atau kunjungi agen tempat pembelian.",
  },
  {
    question: "Apa saja fasilitas yang tersedia di dalam bus?",
    answer: "Bus kami dilengkapi dengan AC, kursi recliner yang nyaman (konfigurasi 2-2 atau 2-1 untuk kelas eksekutif/super eksekutif), port pengisi daya (USB), toilet, selimut, bantal, dan layanan makan gratis untuk kelas tertentu.",
  },
  {
    question: "Berapa batas bagasi yang diperbolehkan untuk setiap penumpang?",
    answer: "Setiap penumpang diperbolehkan membawa bagasi maksimal 20kg secara gratis. Kelebihan berat bagasi akan dikenakan biaya tambahan sesuai dengan tarif yang berlaku.",
  },
  {
    question: "Apakah anak-anak harus membeli tiket penuh?",
    answer: "Anak-anak di atas usia 3 tahun atau yang membutuhkan kursi sendiri wajib membeli tiket dengan harga penuh. Anak di bawah 3 tahun yang dipangku tidak dikenakan biaya.",
  },
  {
    question: "Bagaimana jika barang bawaan saya tertinggal di dalam bus?",
    answer: "Harap segera laporkan ke customer service kami dengan memberikan detail tiket (nomor bus, rute, tanggal keberangkatan). Kami akan berusaha membantu melacak barang Anda, namun kami tidak bertanggung jawab atas kehilangan barang berharga.",
  },
  {
    question: "apakah di Dalam bus boleh cas Powerbank?",
    answer: "Untuk menjaga keamanan dan kenyamanan penumpang, kami tidak memperbolehkan mengisi daya powerbank di dalam bus.",
  }
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-primary/30">
              <MessageCircleQuestion className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Pertanyaan yang Sering Diajukan</h1>
            <p className="text-white/70 text-lg md:text-xl">
              Temukan jawaban untuk pertanyaan umum seputar layanan, tiket, dan perjalanan Anda bersama Murni Jaya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <span className="font-semibold text-lg text-dark pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {/* Contact Support */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-lg text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-dark mb-4">Masih punya pertanyaan?</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Jika Anda tidak menemukan jawaban yang dicari, tim customer support kami siap membantu Anda kapan saja.
              </p>
              <a 
                href="/about" 
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircleQuestion size={20} />
                Hubungi Kami
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
