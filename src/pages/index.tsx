import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Shield, Zap, Award, Star, Quote, ChevronLeft, ChevronRight, MapPin, Clock, Phone, Navigation, ExternalLink, X  } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const featuredServices = [
  {
    title: "Kelas Eksekutif",
    description: "Layanan kelas atas kami dengan ruang kaki maksimal, kursi rebah, dan fasilitas premium.",
    icon: Award,
    price: "Mulai dari Rp 250.000",
  },
  {
    title: "Layanan VIP",
    description: "Kenyamanan luar biasa dengan hiburan di atas bus dan layanan makan untuk perjalanan jauh.",
    icon: Zap,
    price: "Mulai dari Rp 350.000",
  },
  {
    title: "Perjalanan Aman",
    description: "Keselamatan adalah prioritas kami. Pengemudi berpengalaman dan armada yang terawat untuk ketenangan Anda.",
    icon: Shield,
    price: "Perlindungan Standar Mulai Dari Rp 150.000",
  }
];

const testimonials = [
  {
    name: "Ahmad Sulaiman",
    role: "Penumpang Setia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content: "Murni Jaya telah menjadi bus pilihan saya selama lebih dari 10 tahun. Layanannya selalu konsisten dan busnya sangat bersih.",
    rating: 5,
  },
  {
    name: "Siti Aminah",
    role: "Pelancong Bisnis",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "Kelas Eksekutif sangat cocok untuk perjalanan bisnis saya. Saya bisa beristirahat dengan nyaman dan tiba di tujuan dengan segar.",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Pelancong Wisata",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    content: "Bus yang sangat nyaman dan adem saat dalam perjalanan jauh antar pulau Jawa. AC dingin dan suspensi bus terasa sangat empuk.",
    rating: 5,
  },
  {
    name: "Asep Supriyadi",
    role: "Pelanggan VIP",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    content: "Kelas premium harga terjangkau, perjalanan malam terasa aman dan driver membawa bus dengan sangat mulus dan tepat waktu.",
    rating: 5,
  },
  {
    name: "Udin Saputra",
    role: "Pelancong Bisnis",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    content: "Kelas eksekutif nyaman dan aman. Bagi saya pribadi Murni Jaya adalah bus paling nyaman dan terpercaya untuk rute pulau Jawa.",
    rating: 5,
  }
];

const locations = [
  {
    name: "Pusat Pelanggan PO Murni Jaya",
    address: "Jl. HM. Joyo Martono No.45, RT.004/RW.013, Margahayu, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17113",
    hours: "Senin - Minggu: 06.30 - 19.00 WIB",
    phone: "+628138103063",
    phoneDisplay: "+62 813-8103-1063",
    lat: -6.2488,
    lng: 106.9986,
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=PUSAT+PELANGGAN+PO+MURNI+JAYA+BEKASI+TIMUR",
  },
  {
    name: "PO Bus Murni Jaya Cakung",
    address: "RW8H+Q65, RT.1/RW.9, Cakung Bar., Kec. Cakung, Kota Jakarta Timur, DKI Jakarta 13910",
    hours: "Senin - Minggu: 06.00 - 21.00 WIB",
    phone: "+628138103063",
    phoneDisplay: "+62 813-8103-1063",
    lat: -6.1853,
    lng: 106.9539,
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=PO+Bus+Murni+Jaya+Cakung+Jakarta+Timur",
  },
  {
    name: "P.O Murni Jaya Kp. Rambutan",
    address: "Terminal Kp. Rambutan, RT.11/RW.6, Rambutan, Kec. Ciracas, Jakarta, DKI Jakarta 13730",
    hours: "Senin - Minggu: 06.00 - 22.00 WIB",
    phone: "+628138103063",
    phoneDisplay: "+62 813-8103-1063",
    lat: -6.3138,
    lng: 106.8765,
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=PO+Murni+Jaya+Kampung+Rambutan+Terminal+Jakarta",
  },
  {
    name: "Agen Bus Murni Jaya Poris",
    address: "RT.003/RW.009, Poris Plawad, Cipondoh, Tangerang City, Banten 15141",
    hours: "Senin - Minggu: 07.00 - 20.00 WIB",
    phone: "+628138103063",
    phoneDisplay: "+62 813-8103-1063",
    lat: -6.1772,
    lng: 106.6302,
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=AGEN+BUS+MURNI+JAYA+PORIS+Tangerang",
  },
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [isAdOpen, setIsAdOpen] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Auto slide testimonial every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsAdOpen(true);
  }, []);

  // Initialize Leaflet map with all markers
  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      // Load Leaflet CSS and wait for it
      if (!document.getElementById("leaflet-css")) {
        await new Promise<void>((resolve) => {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.onload = () => resolve();
          document.head.appendChild(link);
        });
      }
      if (cancelled) return;

      // Load Leaflet JS
      if (!(window as any).L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
      if (cancelled) return;

      // Small delay to ensure CSS is applied and container has dimensions
      await new Promise((r) => setTimeout(r, 100));
      if (cancelled) return;

      const L = (window as any).L;
      if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

      // Prevent "already initialized" error
      if ((mapContainerRef.current as any)._leaflet_id) {
        return;
      }

      // Create map centered between all locations
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView([-6.2300, 106.8300], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom icon
      const busIcon = L.divIcon({
        html: `<div style="background:#1a56db;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      });

      // Add markers for each location
      const markers: any[] = [];
      locations.forEach((loc, idx) => {
        const marker = L.marker([loc.lat, loc.lng], { icon: busIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Inter,system-ui,sans-serif;min-width:200px;">
              <strong style="font-size:13px;color:#1a56db;">${loc.name}</strong>
              <p style="font-size:11px;color:#555;margin:4px 0 0;">${loc.address}</p>
              <p style="font-size:11px;color:#555;margin:2px 0;">${loc.hours}</p>
              <a href="${loc.directionsUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;padding:4px 12px;background:#1a56db;color:white;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600;">Petunjuk Arah →</a>
            </div>`,
            { maxWidth: 260 }
          );

        marker.on("click", () => {
          setSelectedLocation(idx);
        });

        markers.push(marker);
      });

      // Fit map to show all markers
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15));

      mapInstanceRef.current = { map, markers };

      // Force Leaflet to recalculate container size
      setTimeout(() => {
        if (!cancelled && mapInstanceRef.current) {
          map.invalidateSize();
          map.fitBounds(group.getBounds().pad(0.15));
        }
      }, 300);
    };

    loadLeaflet();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fly to selected location when selectedLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map, markers } = mapInstanceRef.current;
    const loc = locations[selectedLocation];
    map.flyTo([loc.lat, loc.lng], 15, { duration: 1 });
    markers[selectedLocation].openPopup();
  }, [selectedLocation]);

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />

<AnimatePresence>
  {isAdOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onClick={() => setIsAdOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl"
      >
        {/* Tombol X: mobile dan desktop */}
      
   <button
         type="button"
         onClick={() => setIsAdOpen(false)}
         aria-label="Tutup iklan"
         className="
         absolute
         top-2
         right-2
         z-50
        not-first: flex h-9 w-9
        items-center justify-center
        rounded-full
        bg-rose-500
        text-white
        shadow-md
        transition
        hover:bg-rose-600
        lg:top-1
        lg:right-2
         "
        >
       <X size={22} strokeWidth={3} />
</button>


        {/* Konten promo */}
        <div className="grid h-full grid-cols-1 gap-3 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1.4fr_1fr]">
          {/* Informasi promo */}
          <div className="flex flex-col justify-between bg-linear-to-br from-primary to-[#002d72] p-6 text-white">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/80">
                Promo Spesial
              </div>

              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                Promo Akhir Tahun
                <br />
                Bersama MURNI JAYA 🎉
              </h2>

              <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                Dapatkan promo spesial untuk pembelian tiket di outlet
                baru kami. Harga terbaik dari kami untuk perjalanan
                aman dan nyaman.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Promo Terbaru
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/90">
                E-Ticket & Gratis Bagasi
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/booking"
                onClick={() => setIsAdOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs font-bold text-primary shadow-lg transition hover:bg-white/90 sm:text-sm"
              >
                Pesan Sekarang
              </Link>

              <a
                href="https://wa.me/628979712006"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 sm:text-sm"
              >
                Hubungi CS
              </a>
            </div>
          </div>

          {/* Gambar promo */}
          <div className="flex min-h-70 items-center justify-center bg-white/95 p-4 sm:min-h-80 sm:p-6 lg:p-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlLPQwTs7wZHMmCHZA-ULR6L1GLj0eBkY-wxtG8FE_xTsdNlkqQfTwpQe1&s=10"
              alt="Outlet Baru Semarang"
              className="h-full max-h-112.5 w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Company Overview Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/a8/cf/40/a8cf409f81d1ed43a0b29c97b050f276.jpg"
                  alt="Murni Jaya Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/10 rounded-full z-0 blur-3xl" />
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-secondary/10 rounded-full z-0 blur-2xl" />
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-secondary tracking-widest uppercase">Kisah Kami</h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-dark leading-tight">
                  Lebih dari 40 Tahun <span className="text-primary italic">Keunggulan dalam Perjalanan</span>
                </h3>
              </div>
              <p className="text-dark/70 leading-relaxed text-lg">
                PT Murni Anugrah Jaya Usaha (PO Murni Jaya) merupakan bagian resmi dari Hiba Group (PT Hiba Utama), salah satu penyedia layanan transportasi terbesar dan tepercaya di Indonesia sejak tahun 1949. Di bawah naungan manajemen Hiba Group, kami berkomitmen untuk terus meningkatkan standar pelayanan, keselamatan, dan kenyamanan armada bus Antar Kota Antar Provinsi (AKAP) bagi seluruh masyarakat.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">1994</h4>
                  <p className="text-dark/50 text-sm">Didirikan</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">500+</h4>
                  <p className="text-dark/50 text-sm">Jumlah Armada</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">1,7Jt+</h4>
                  <p className="text-dark/50 text-sm">Penumpang Puas</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">50+</h4>
                  <p className="text-dark/50 text-sm">Destinasi</p>
                </div>
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group">
                Pelajari lebih lanjut tentang kami <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase">Armada Kami</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-dark">Layanan Premium untuk Setiap Penumpang</h3>
            <p className="text-dark/60">Pilih kelas yang sesuai dengan kebutuhan Anda dan rasakan perbedaan Murni Jaya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-dark/5 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={32} />
                </div>
                <h4 className="text-2xl font-display font-bold text-dark mb-4">{service.title}</h4>
                <p className="text-dark/60 mb-6 grow">{service.description}</p>
                <div className="pt-6 border-t border-dark/5 w-full">
                  <p className="text-sm font-semibold text-secondary mb-4">{service.price}</p>
                  <Link to="/services" className="text-dark font-bold hover:text-primary transition-colors text-sm">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="mx-auto text-center md:mx-0 md:text-left">
              <h2 className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Testimonial</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-dark">Apa Kata Penumpang Kami</h3>
            </div>
          </div>

          {/* Testimonial Card Display Carousel */}
          <div className="relative min-h-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative p-6 sm:p-8 rounded-2xl bg-light border border-dark/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <Quote className="absolute top-6 right-6 text-primary/10 w-12 h-12 pointer-events-none" />
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-dark/80 italic text-sm sm:text-base mb-6 leading-relaxed">"{testimonials[currentTestimonial].content}"</p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-dark/5">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonials[currentTestimonial].name)}&background=random`;
                      }}
                    />
                    <div>
                      <p className="font-bold text-dark text-sm sm:text-base leading-tight">{testimonials[currentTestimonial].name}</p>
                      <p className="text-xs font-semibold text-primary">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-1.5 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentTestimonial === idx ? "w-6 bg-primary" : "w-2 bg-dark/20 hover:bg-dark/40"
                }`}
                title={`Ke slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Location / Map Section */}
      <section className="py-20 bg-light border-t border-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold text-secondary tracking-widest uppercase">Lokasi Kami</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-dark">Temukan Kami di Berbagai Lokasi</h3>
            <p className="text-dark/60 text-sm sm:text-base">
              Kunjungi kantor dan agen kami untuk pembelian tiket langsung.
            </p>
          </div>


          {/* Unified Map with all location pins */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-dark/5 overflow-hidden">
            <div className="rounded-2xl overflow-hidden shadow-inner border border-dark/10 h-100 sm:h-112.5 relative">
              <div ref={mapContainerRef} className="w-full h-full z-0" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-primary flex items-center gap-1.5 z-1000">
                <MapPin size={14} className="text-primary" /> {locations.length} Lokasi Kami
              </div>
            </div>
          </div>

          {/* All Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {locations.map((loc, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedLocation(idx)}
                className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all duration-300 ${
                  selectedLocation === idx
                    ? "border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : "border-dark/5 shadow-sm hover:shadow-md hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    selectedLocation === idx ? "bg-primary" : "bg-dark/30"
                  }`}>
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-display font-bold text-dark leading-tight">{loc.name}</h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-primary mt-0.5 shrink-0" size={13} />
                    <p className="text-dark/60 leading-snug">{loc.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-primary shrink-0" size={13} />
                    <p className="text-dark/60">{loc.hours}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-primary shrink-0" size={13} />
                    <a href={`tel:${loc.phone}`} className="text-primary font-semibold hover:underline">
                      {loc.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dark/5 flex gap-2">
                  <a
                    href={loc.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs shadow-sm transition-all"
                  >
                    <Navigation size={12} /> Arah
                  </a>
                  <Link
                    to="/booking"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="flex-1 bg-light hover:bg-gray-100 text-dark border border-dark/10 font-semibold py-2 px-3 rounded-lg flex items-center justify-center text-xs transition-all"
                  >
                    Pesan Tiket
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Siap untuk memulai perjalanan Anda?</h2>
          <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
            Pesan tiket Anda sekarang dan rasakan perjalanan bus paling nyaman di seluruh Indonesia bersama Po. Murni Jaya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-light transition-colors">
              Pesan Tiket Sekarang
            </Link>
            <a href="https://wa.me/628979712006" target="_blank" rel="noopener noreferrer" className="bg-secondary text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all">
              Hubungi Dukungan
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
