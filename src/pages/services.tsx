import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Wifi, Monitor, Coffee, Zap, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Kelas Eksekutif",
    price: "Rp 250.000",
    description: "Pengalaman perjalanan mewah terbaik di seluruh Jawa.",
    features: [
      "Ruang Kaki Ekstra (konfigurasi 2-2)",
      "Kursi Premium Reclining Penuh",
      "Hiburan AVOD Pribadi",
      "Camilan & Makan Gratis di Bus",
      "Port Pengisian USB",
      "Layanan Selimut & Bantal"
    ],
    color: "bg-primary"
  },
  {
    title: "Kelas VIP",
    price: "Rp 500.000",
    description: "Kenyamanan premium untuk perjalanan jarak jauh.",
    features: [
      "Kursi Nyaman (konfigurasi 2-2)",
      "Reclining Standar",
      "Sistem Hiburan Terpusat",
      "Camilan di Bus",
      "Ruang Kaki Standar",
      "Fasilitas Toilet Bersih",
      "Armada Bus Private"
    ],
    color: "bg-secondary"
  },
  {
    title: "Kelas Bisnis",
    price: "Rp 350.000",
    description: "Kenyamanan premium untuk perjalanan jarak jauh.",
    features: [
      "Pengemudi Terlatih Profesional",
      "Pelacakan GPS Real-time",
      "Bantuan Jalan 24/7",
      "Asuransi Komprehensif",
      "Jadwal Perawatan Ketat",
      "Kebijakan Bebas Rokok",
      "Armada Bus Premium",
      "bebas narkoba"
    ],
    color: "bg-dark"
  }
];

export default function Services() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6">Layanan Perjalanan Premium</h1>
          <p className="text-dark/60 text-lg max-w-2xl mx-auto">
            Rasakan standar emas perjalanan darat di Indonesia dengan armada kami yang terawat dengan baik.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white lowercase-config">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="flex flex-col h-full rounded-3xl overflow-hidden border border-dark/5 shadow-sm hover:shadow-2xl transition-all">
                <div className={`p-8 text-white ${service.color}`}>
                  <h3 className="text-2xl font-display font-bold mb-2">{service.title}</h3>
                  <p className="text-white/80 text-sm mb-6">{service.description}</p>
                  <p className="text-3xl font-bold">{service.price}</p>
                </div>
                <div className="p-8 bg-white grow flex flex-col">
                  <ul className="space-y-4 mb-10 grow">
                    {service.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-dark/70 text-sm">
                        <Check className="text-primary shrink-0" size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className={`w-full py-4 rounded-xl text-center font-bold text-white! transition-opacity hover:opacity-90 ${service.color}`}>
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Fasilitas Standar</h2>
            <p className="text-white/60">Fitur yang akan Anda temukan di seluruh armada kami.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Wifi, label: "WiFi Cepat" },
              { icon: Monitor, label: "Hiburan" },
              { icon: Coffee, label: "Penyegaran" },
              { icon: Zap, label: "Port Pengisian" },
              { icon: Shield, label: "Perjalanan Aman" },
              { icon: Clock, label: "Tepat Waktu" },
              { icon: Users, title: "Kru Ramah" },
              { icon: MapPin, title: "Banyak Tujuan" }
            ].map((item, idx) => (
              item.icon && (
                <div key={idx} className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <div className="text-primary flex justify-center mb-4">
                    <item.icon size={32} />
                  </div>
                  <p className="font-medium">{item.label || item.title}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 


// Helper icons mapping would go here if needed
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>

