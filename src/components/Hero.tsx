import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Ticket } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://asset.kompas.com/crops/LqJSCK9zYJX6rdFF5lESXFTBhPI=/0x42:1280x895/750x500/data/photo/2020/11/03/5fa112e325414.jpeg"
          alt="Murni Jaya Luxury Bus"
          className="w-full h-full object-cover object-[15%_center] sm:object-[30%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-dark/80 via-dark/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 sm:px-4 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              Berdiri Sejak 1994
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">
              Perjalanan dengan <br />
              <span className="text-primary italic">Kenyamanan & Elegan</span>
            </h1>
            <p className="text-sm sm:text-lg text-white/80 mb-6 sm:mb-10 leading-relaxed max-w-xl">
              Rasakan keunggulan Po. Murni Jaya. Layanan bus premium di seluruh Jawa dengan armada nyaman dan standar keselamatan yang tak tertandingi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
              <Link to="/booking" className="btn-primary flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg group">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                Pesan Tiket Anda
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium transition-all text-sm sm:text-lg">
                Jelajahi Layanan
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute bottom-12 right-12 hidden lg:block">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="glass p-6 rounded-2xl flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
            32+
          </div>
          <div>
            <p className="text-dark font-semibold">Tahun Melayani</p>
            <p className="text-dark/60 text-sm">Perjalanan Aman & Terpercaya</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
