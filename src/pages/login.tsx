import { Bus, Lock, Mail, ArrowLeft, Eye, EyeOff, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Firebase imports
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth"; 

export default function Login() {
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
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (userCredential.user.email?.toLowerCase().includes("admin")) {
        navigate("/admin-profile");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      console.warn("Email login error:", err.code);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Email atau password tidak valid");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      if (userCredential.user.email?.toLowerCase().includes("admin")) {
        navigate("/admin-profile");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      console.warn("Google login error:", err.code);
      setError("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Forgot Password Handler 
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError("Masukkan alamat email Anda");
      return;
    }
    setResetLoading(true);
    setResetError(null);
    setResetMessage(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Link reset kata sandi telah dikirim ke email Anda. Silakan cek inbox (termasuk folder spam).");
      setResetEmail("");
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
        setResetError("Email tidak ditemukan. Pastikan email sudah terdaftar.");
      } else {
        setResetError("Gagal mengirim link reset. Silakan coba lagi.");
      }
    } finally {
      setResetLoading(false);
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

        {/* Center welcome text and company info */}
        <div className="my-auto py-12 space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-xs font-semibold tracking-wide uppercase text-accent border border-white/10">
              <Bus className="w-3.5 h-3.5" />
              <span>Mitra Perjalanan Anda</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-extrabold text-white leading-[1.15]">
              Selamat Datang di <br />
              <span className="text-accent italic font-display">Murni Jaya</span>
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-md">
              Kenyamanan Perjalanan Anda, Prioritas Utama Kami. Masuk ke akun Anda untuk melakukan pemesanan tiket, memantau rute, dan menikmati penawaran eksklusif.
            </p>
          </div>

          {/* Core Perks */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl xl:text-3xl font-display font-black text-white mb-0.5">500+</div>
              <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Armada Bus</div>
            </div>
            <div>
              <div className="text-2xl xl:text-3xl font-display font-black text-white mb-0.5">50+</div>
              <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Destinasi</div>
            </div>
            <div>
              <div className="text-2xl xl:text-3xl font-display font-black text-white mb-0.5">1.7Jt+</div>
              <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Penumpang</div>
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
            "bus yang nyaman dan adem saat dalam perjalanan ke pulua jawa. Kelas premium harga terjangkau nyaman saat perjalanan jauh."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/25 flex items-center justify-center text-accent font-bold text-xs">
              B
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none mb-0.5">Budi Santoso</p>
              <p className="text-[10px] text-white/50">Pelancong Bisnis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 relative min-h-screen lg:min-h-0">
        {/* Back Link */}
        <Link
          to="/"
          className="absolute top-6 left-6 lg:left-12 flex items-center gap-2 text-dark/50 hover:text-primary transition-colors z-20 text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Beranda</span>
        </Link>

        {/* Mobile-only brand header (matching blue hero card design) */}
        <div className="lg:hidden w-full max-w-md mx-auto bg-linear-to-br from-[#003882] via-[#004bb3] to-[#002660] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 mt-12 mb-6 relative overflow-hidden text-left">
          {/* Abstract blur circles */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 -right-16 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <Link to="/" className="flex items-center gap-3.5 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center overflow-hidden border border-white/15 shrink-0 bg-white/10">
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

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-accent border border-white/15 mb-5">
            <Bus className="w-3.5 h-3.5" />
            <span>MITRA PERJALANAN ANDA</span>
          </div>

          {/* Title & Description */}
          <h2 className="text-3xl font-display font-extrabold text-white leading-tight mb-3">
            Selamat Datang di <br />
            <span className="text-accent italic font-display">Murni Jaya</span>
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
            Kenyamanan Perjalanan Anda, Prioritas Utama Kami. Masuk ke akun Anda untuk melakukan pemesanan tiket, memantau rute, dan menikmati penawaran eksklusif.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-5 border-t border-white/15 text-left mb-6">
            <div>
              <div className="text-2xl font-display font-black text-white mb-0.5">500+</div>
              <div className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Armada Bus</div>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-white mb-0.5">50+</div>
              <div className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Destinasi</div>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-white mb-0.5">1.7Jt+</div>
              <div className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Penumpang</div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg">
            <div className="flex gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-accent text-accent" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-white/90 italic leading-relaxed mb-3">
              "bus yang nyaman dan adem saat dalam perjalanan ke pulua jawa. Kelas premium harga terjangkau nyaman saat perjalanan jauh."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/25 flex items-center justify-center text-accent font-bold text-xs shrink-0">
                B
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none mb-0.5">Budi Santoso</p>
                <p className="text-[10px] text-white/50">Pelancong Bisnis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
            <div className="w-full max-w-md mx-auto bg-white rounded-4xl shadow-2xl p-8 border border-dark/5 relative z-10 transition-all">
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-display font-black text-dark tracking-tight mb-2">
              Masuk Akun Penumpang
            </h2>
            <p className="text-dark/40 text-sm">
              Silakan masukkan email dan kata sandi Anda untuk melanjutkan perjalanan.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 text-center font-medium flex items-center gap-2.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setResetEmail("");
                  setResetMessage(null);
                  setResetError(null);
                }}
                className="text-xs text-primary hover:text-primary-hover font-bold tracking-wide uppercase hover:underline"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-primary text-white py-4.5 rounded-2xl font-bold hover:bg-primary/95 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                "Masuk Ke Akun"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-dark/5" />
            <span className="relative bg-white px-4 text-[10px] font-bold text-dark/20 uppercase tracking-widest">
              Atau Masuk Dengan
            </span>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 border border-dark/10 rounded-2xl font-bold text-sm text-dark hover:bg-light transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm cursor-pointer"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>Google</span>
          </button>

          <p className="text-center text-dark/50 text-xs font-semibold mt-6 tracking-wide">
            BELUM PUNYA AKUN?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary-hover font-extrabold hover:underline"
            >
              DAFTAR SEKARANG
            </Link>
          </p>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-dark/5" />
            <span className="relative bg-white px-4 text-[10px] font-bold text-dark/20 uppercase tracking-widest">
              Khusus Pegawai
            </span>
          </div>

          <Link
            to="/admin-login"
            className="mt-4 block w-full text-center px-6 py-4 border border-dark/10 rounded-2xl font-bold text-sm text-dark hover:bg-light transition-all active:scale-[0.98] shadow-sm"
          >
            <span>Masuk sebagai Admin</span>
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/45 backdrop-blur-md px-4">
          <div className="bg-white rounded-4xl shadow-2xl p-8 w-full max-w-md border border-dark/5 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-dark/40 hover:text-dark transition-colors text-lg leading-none cursor-pointer"
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail className="h-6 w-6" />
              </div>
            </div>

            <h2 className="text-2xl font-display font-black text-center text-dark mb-1">
              Reset Kata Sandi
            </h2>
            <p className="text-center text-dark/50 text-sm mb-6 leading-relaxed">
              Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi Anda.
            </p>

            {resetMessage && (
              <div className="mb-5 p-4 bg-green-50 text-green-700 text-sm rounded-2xl border border-green-100 text-center font-medium">
                {resetMessage}
              </div>
            )}

            {resetError && (
              <div className="mb-5 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 text-center font-medium">
                {resetError}
              </div>
            )}

            {!resetMessage && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark/30" />
                    <input
                      type="email"
                      id="reset-email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-light border border-dark/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-dark font-medium text-sm placeholder:text-dark/20"
                      placeholder="nama@email.com"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/95 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm"
                >
                  {resetLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </button>
              </form>
            )}

            {resetMessage && (
              <button
                onClick={() => setShowForgotModal(false)}
                className="mt-4 w-full border border-dark/10 text-dark py-3.5 rounded-2xl font-bold hover:bg-light transition-all cursor-pointer text-sm"
              >
                Kembali ke Login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}