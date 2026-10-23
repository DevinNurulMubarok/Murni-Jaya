import { Bus, Lock, Mail, User, ArrowLeft, Eye, EyeOff, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Firebase imports
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

export default function AdminRegister() {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email?.toLowerCase().includes("admin")) {
          navigate("/admin-profile");
        } else {
          navigate("/profile");
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Validasi kekuatan password (sesuai aturan backend)
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Kata sandi minimal 8 karakter.";
    if (!/[a-zA-Z]/.test(pwd)) return "Kata sandi harus mengandung minimal 1 huruf.";
    if (!/[0-9]/.test(pwd)) return "Kata sandi harus mengandung minimal 1 angka.";
    return null;
  };

  // Email / Password Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailExists(false);
    setError(null);

    // Validasi form di frontend sebelum request ke Firebase
    if (!name.trim() || !email.trim() || !password) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Nama terlalu pendek, minimal 2 karakter.");
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
      await updateProfile(user, { displayName: name.trim() });
      await signOut(auth); // Sign out so they can log in via admin-login
      navigate("/admin-login");
    } catch (err: any) {
      // Jangan log ke console detail error Firebase di production
      if (err.code === "auth/email-already-in-use") {
        // Tampilkan pesan yang jelas — JANGAN auto-login
        setEmailExists(true);
        setError("Email ini sudah terdaftar. Silakan masuk menggunakan halaman Login.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (err.code === "auth/weak-password") {
        setError("Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan huruf dan angka.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Koneksi internet bermasalah. Silakan periksa jaringan Anda.");
      } else {
        setError("Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col lg:grid lg:grid-cols-12 overflow-y-auto lg:overflow-hidden font-body">
      {/* Left Column: Branding and Greetings (Visible on Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 bg-linear-to-br from-primary to-[#003882] relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Abstract blur circles for modern look */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3.5 relative z-10 self-start group">
          <div className="relative w-12 h-12 rounded-xl shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 overflow-hidden border border-white/10">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXolljzqjAZveu4jBtkrhdmJp5vK1SG3eAHNUU42z9I6QAK--GgA3XrYNh"
              alt="Murni Jaya Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-extrabold tracking-tight text-white leading-none mb-0.5">
              MURNI JAYA
            </span>
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-accent">
              ARMADA LINTAS JAWA
            </span>
          </div>
        </Link>

        {/* Center welcome text and perks */}
        <div className="my-auto py-12 space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-xs font-semibold tracking-wide uppercase text-accent border border-white/10">
              <Bus className="w-3.5 h-3.5" />
              <span>Portal Administrator</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-extrabold text-white leading-[1.15]">
              Pendaftaran <br />
              <span className="text-accent italic font-display">Akun Admin</span>
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-md">
              Daftar sekarang untuk mendapatkan akses ke sistem manajemen Murni Jaya.
            </p>
          </div>

          {/* Perks list */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/25 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-white/90 font-medium">Pesan tiket perjalanan hanya dalam beberapa klik.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/25 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-white/90 font-medium">Kelola riwayat pesanan & jadwalkan perjalanan dengan mudah.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/25 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-white/90 font-medium">Dapatkan akses promo spesial & penawaran eksklusif khusus member.</p>
            </div>
          </div>
        </div>

        {/* Testimonial slider / static display */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="fill-accent text-accent" />
            ))}
          </div>
          <p className="text-sm text-white/90 italic leading-relaxed mb-4">
            "Murni Jaya telah menjadi bus pilihan saya selama lebih dari 10 tahun. Layanannya selalu konsisten dan busnya sangat bersih."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/25 flex items-center justify-center text-accent font-bold text-xs">
              AS
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none mb-0.5">Ahmad Sulaiman</p>
              <p className="text-[10px] text-white/50">Penumpang Setia (10+ Tahun)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 relative min-h-screen lg:min-h-0">
        {/* Back Link */}
        <Link
          to="/"
          className="absolute top-6 left-6 lg:left-12 flex items-center gap-2 text-dark/50 hover:text-primary transition-colors z-20 text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Beranda</span>
        </Link>

        {/* Mobile-only brand header */}
        <div className="lg:hidden w-full max-w-md mx-auto bg-linear-to-br from-[#003882] via-[#004bb3] to-[#002660] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 mt-12 mb-6 relative overflow-hidden text-left">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 -right-16 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <Link to="/" className="flex items-center gap-3.5 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center overflow-hidden border border-white/15 shrink-0 bg-white/10">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXolljzqjAZveu4jBtkrhdmJp5vK1SG3eAHNUU42z9I6QAK--GgA3XrYNh"
                alt="Murni Jaya Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-display font-extrabold tracking-tight text-white leading-none">
                MURNI JAYA
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-accent font-bold">
                ARMADA LINTAS JAWA
              </p>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-accent border border-white/15 mb-5">
            <Bus className="w-3.5 h-3.5" />
            <span>PORTAL ADMINISTRATOR</span>
          </div>

          <h2 className="text-3xl font-display font-extrabold text-white leading-tight mb-3">
            Daftar Akun <br />
            <span className="text-accent italic font-display">Administrator</span>
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Buat akun admin baru untuk mengelola tiket, armada, dan konten Murni Jaya.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-5 border-t border-white/15 text-left mb-6">
            <div>
              <p className="text-2xl font-display font-black text-white mb-0.5">500+</p>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Armada</p>
            </div>
            <div>
              <p className="text-2xl font-display font-black text-white mb-0.5">50+</p>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Destinasi</p>
            </div>
            <div>
              <p className="text-2xl font-display font-black text-white mb-0.5">1.7Jt+</p>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Penumpang</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-dark/5 relative z-10 transition-all mx-auto">
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-display font-black text-dark tracking-tight mb-2">
              Daftar Akun Admin
            </h2>
            <p className="text-dark/40 text-sm">
              Buat akun administrator baru.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 text-center font-medium">
              <div className="flex items-center gap-2.5 justify-center mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                <span>{error}</span>
              </div>
              {emailExists && (
                <Link
                  to="/login"
                  className="inline-block mt-1 px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all"
                >
                  Masuk Sekarang →
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark/30 focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-light border border-dark/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-dark font-medium text-sm placeholder:text-dark/20"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1"
              >
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark/30 focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-light border border-dark/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-dark font-medium text-sm placeholder:text-dark/20"
                  placeholder="masukan email anda"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark/30 focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-light border border-dark/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-dark font-medium text-sm placeholder:text-dark/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60 transition-colors"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4.5 rounded-2xl font-bold hover:bg-primary/95 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                "Daftar Akun Baru"
              )}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-dark/5" />
            <span className="relative bg-white px-4 text-[10px] font-bold text-dark/20 uppercase tracking-widest">
              Khusus Penumpang
            </span>
          </div>

          <Link
            to="/login"
            className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 border border-dark/10 rounded-2xl font-bold text-sm text-dark hover:bg-light transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Masuk sebagai Penumpang</span>
          </Link>

          <p className="text-center text-dark/50 text-xs font-semibold mt-8 tracking-wide">
            SUDAH PUNYA AKUN ADMIN?{" "}
            <Link
              to="/admin-login"
              className="text-primary hover:text-primary-hover font-extrabold hover:underline"
            >
              MASUK KE ADMIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
