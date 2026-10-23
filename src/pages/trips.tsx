

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Bus, MapPin, Clock, Calendar, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const routes = [
  {
    id: 1,
    from: "Jakarta",
    to: "Yogyakarta",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNTxlHLx9hT0CdICI5tg4RZo_v-Z-pCZYzuQ&s",
    duration: "8j 30m",
    price: 270000,
    class: "VIP",
    features: ["WiFi", "Snack", "Reclining Seat", "Toilet"],
    nextDeparture: "19:00"
  },
  {
    id: 2,
    from: "Jakarta",
    to: "Surabaya",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr3jtQ4uhW0vNB0R4rFRBlZvLfsUbwqU-8rw&s",
    price: 350000,
    class: "Super Executive",
    features: ["WiFi", "Meal", "USB Charger", "Toilet"],
    nextDeparture: "18:30"
  },
  {
    id: 3,
    from: "Jakarta",
    to: "Solo",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkRN8h64CWXbD-WkxnqQsisAXxiob_LbwwsA&s",
    duration: "7j 45m",
    price: 220000,
    class: "VIP",
    features: ["WiFi", "Snack", "Toilet"],
    nextDeparture: "20:00"
  },
  {
    id: 4,
    from: "Jakarta",
    to: "Purwokerto",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSidGKVnn2Af6w3Ax-s10m0AwCXQlvKiq4aIA&s",
    duration: "6j 0m",
    price: 180000,
    class: "Executive",
    features: ["WiFi", "Snack", "Toilet"],
    nextDeparture: "21:30"
  },
  {
    id: 5,
    from: "Jakarta",
    to: "Bandung",
    image: "https://ayonaikbis.com/wp-content/uploads/2019/08/wiradk9_67970984_209948726664762_3730079005839868571_n-700x380.jpg",
    duration: "6j 0m",
    price: 250000,
    class: "Executive",
    features: ["WiFi", "Snack", "Toilet"],
    nextDeparture: "21:30"
  },
  {
    id: 6,
    from: "Jakarta",
    to: "Purworejo",
    image: "https://asset.kompas.com/crops/IXFzK7vlbUYsRlV59ZR3bjpZKHY=/22x12:1048x696/750x500/data/photo/2021/05/30/60b3a2013cc79.jpg",
    duration: "7j 30m",
    price: 280000,
    class: "Super Executive",
    features: ["WiFi", "Snack", "Toilet"],
    nextDeparture: "19:35"
  },
  {
    id: 7,
    from: "Jakarta",
    to: "Cilacap",
    image: "https://tanyaberita.b-cdn.net/wp-content/uploads/2022/04/Harga-Tiket-Bus-Murni-Jaya-Terbaru.jpg",
    duration: "8j 20m",
    price: 290000,
    class: "Super Executive",
    features: ["WiFi", "Snack", "Toilet"],
    nextDeparture: "19:35"
  },
];

export default function TripsPage() {
  return (
    <main className="min-h-screen bg-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://img.okezone.com/content/2023/02/03/52/2758489/pernah-dijuluki-sebagai-white-killer-siapa-pemilik-po-bus-murni-jaya-VtuApYHkqL.jpeg" alt="Bus Murni Jaya" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-primary/20">
              Perjalanan Kami
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-[1.1]">
              <span className="text-primary italic">Rute</span> Perjalanan Anda
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-10">
              Jelajahi berbagai destinasi populer di seluruh Pulau Jawa dengan armada bus ternyaman dan layanan premium dari Murni Jaya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-display font-bold text-dark mb-4">Rute Populer</h2>
              <p className="text-dark/40 max-w-xl font-medium">Pilih rute favorit Anda dan nikmati perjalanan tanpa hambatan bersama kami.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white rounded-2xl border border-dark/5 shadow-sm text-sm font-bold text-dark flex items-center gap-2">
                <Calendar size={18} className="text-primary" /> Hari Ini
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {routes.map((route, idx) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-dark/5 shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row"
              >
                <div className="relative w-full md:w-64 h-64 md:h-auto overflow-hidden">
                  <img src={route.image} alt={route.to} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-dark uppercase tracking-widest shadow-lg">
                      {route.class}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-primary mb-4">
                      <Zap size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Keberangkatan Terdekat</span>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-8">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest mb-1">{route.from}</p>
                        <p className="text-2xl font-display font-bold text-dark">{route.nextDeparture}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full h-[2px] bg-dark/5 relative">
                          <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary" />
                          <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span className="text-[10px] font-bold text-dark/20 uppercase tracking-[0.2em]">{route.duration}</span>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest mb-1">{route.to}</p>
                        <p className="text-2xl font-display font-bold text-dark">{route.to.substring(0, 3).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {route.features.map(f => (
                        <span key={f} className="px-3 py-1 bg-light rounded-lg text-[10px] font-bold text-dark/40 uppercase tracking-wider">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-dark/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest mb-1">Mulai Dari</p>
                      <p className="text-2xl font-display font-bold text-secondary">Rp {route.price.toLocaleString()}</p>
                    </div>
                    <Link to="/booking" className="btn-primary py-4 px-8 text-sm flex items-center gap-2">
                      Pesan Sekarang <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Info */}
      <section className="py-24 bg-white border-y border-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight">
                  Kenyamanan Anda Adalah <span className="text-primary italic">Prioritas</span> Kami
                </h2>
                <p className="text-lg text-white/50 mb-12 leading-relaxed">
                  Kami mengoperasikan armada bus terbaru dengan standar keselamatan internasional. Seluruh pengemudi kami telah melalui pelatihan ketat untuk memastikan perjalanan Anda aman dan berkesan.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                      <ShieldCheck size={24} />
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Asuransi Perjalanan</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                      <Clock size={24} />
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Tepat Waktu</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img src="/images/hero_bus.png" alt="Safety First" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
