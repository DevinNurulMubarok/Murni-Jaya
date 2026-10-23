import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, X, Youtube, Headset } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomerServiceWidget from "./CustomerServiceWidget";

export default function Footer() {
  const [isWaOpen, setIsWaOpen] = useState(true);
  const [isCsWidgetOpen, setIsCsWidgetOpen] = useState(false);

  return (
    <footer className="bg-dark text-white pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXolljzqjAZveu4jBtkrhdmJp5vK1SG3eAHNUU42z9I6QAK--GgA3XrYNh"
                  alt="Murni Jaya Logo"
                  className="w-full h-full object-cover"
                />  
              </div>
              <span className="text-xl font-display font-bold tracking-tight">MURNI JAYA</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Melayani Indonesia sejak 1994. Po. Murni Jaya berkomitmen untuk menyediakan layanan transportasi premium, aman, dan nyaman untuk perjalanan Anda di seluruh Jawa.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/murnijaya" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-full text-white/60 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/murnijaya" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-full text-white/60 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com/murnijaya" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-full text-white/60 hover:text-white">
                <X size={20} />  
              </a>
              <a href="https://www.youtube.com/@PoMurniJaya" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-full text-white/60 hover:text-white">
                <Youtube size={20} />
              </a> 
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6">Tautan Langsung</h3>
            <ul className="space-y-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Tentang Kami", href: "/about" },
                { name: "Layanan", href: "/services" },
                { name: "Tim", href: "/teams" },
                { name: "Perjalanan", href: "/trips" },
                { name: "Berita", href: "/blog" },
                { name: "Pemesanan", href: "/booking" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <span className="text-white/60 text-sm">Jl. HM. Joyo Martono No.45, RT.004/RW.013, Margahayu, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17113</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <a href="tel:+628979712006" className="text-white/60 text-sm hover:text-primary transition-colors">+62 813-8103-1063</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <a href="mailto:info@murnijaya.com" className="text-white/60 text-sm hover:text-primary transition-colors">info@murnijaya.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © 2026 PT Murni Jaya  All Rights Reserved
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-white/40 hover:text-white text-xs">Kebijakan Privasi</Link>
            <Link to="#" className="text-white/40 hover:text-white text-xs">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
      
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
        <AnimatePresence>
          {isWaOpen && !isCsWidgetOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: "bottom right" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white text-dark p-4 rounded-xl shadow-2xl border border-dark/10 w-64 relative"
            >
              <button 
                onClick={() => setIsWaOpen(false)}
                className="absolute top-3 right-3 text-dark/30 hover:text-dark transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
              <h4 className="font-bold text-lg mb-1 flex items-center gap-1">
                Hi! <span role="img" aria-label="wave">👋</span>
              </h4>
              <p className="text-sm font-medium text-dark/80 leading-relaxed pr-2">
                Kamu bisa menghubungi kami via WhatsApp atau Customer Service
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCsWidgetOpen(!isCsWidgetOpen)}
            className="w-[60px] h-[60px] bg-white text-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all relative border-2 border-primary/20 group"
            aria-label="Customer Service"
          >
            <Headset size={28} className="text-primary" />
          </button>
          
          <a 
            href="https://wa.me/628979712006"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[60px] h-[60px] bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all relative group"
            aria-label="Chat WhatsApp"
          >
            {/* WhatsApp SVG Icon */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 text-white fill-current" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>
      <CustomerServiceWidget isOpen={isCsWidgetOpen} onClose={() => setIsCsWidgetOpen(false)} />
    </footer>
  );
}
