

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser, updateProfile, signOut } from "firebase/auth";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  User, 
  Mail, 
  MapPin, 
  Ticket, 
  History, 
  Settings, 
  LogOut, 
  ChevronRight, 
  CreditCard,
  Gift,
  Bell,
  Trash2,
  Moon,
  Sun,
  Shield,
  Globe,
  Trash,
  ArrowLeft,
  Newspaper,
  Plus,
  Edit2,
  Send,
  Image,
  FileText,
  Type,
  Star,
  CheckCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getBlogs, saveBlog, updateBlog, deleteBlog, BlogPost } from "@/lib/blog";

// Mock data generator for 1000 vouchers
const generateVouchers = () => {
  const base = [
    { id: "v1", code: "MURNI20", discount: "20%", expiry: "10 Apr 2026", title: "Diskon Lebaran" },
    { id: "v2", code: "NEWUSER", discount: "15%", expiry: "01 Jan 2027", title: "Welcome Bonus" },
    { id: "v3", code: "PROMO101", discount: "10%", expiry: "31 Dec 2026", title: "Voucher Spesial #1" },
  ];
  const additional = Array.from({ length: 998 }, (_, i) => ({
    id: `v${i + 3}`,
    code: `PROMO${100 + i}`,
    discount: `${Math.floor(Math.random() * 15) + 5}%`,
    expiry: "31 Dec 2026",
    title: `Voucher Spesial #${i + 1}`
  }));
  return [...base, ...additional];
};

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [themeMode, setThemeMode] = useState<"light" | "slate" | "amoled">(() => {
    return (localStorage.getItem("themeMode") as "light" | "slate" | "amoled") || "light";
  });
  const isDarkMode = themeMode !== "light";
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("user_history");
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", route: "Jakarta → Yogyakarta", date: "15 Mar 2026", status: "Terjadwal", price: "Rp 250.000", seat: "12A" },
      { id: "2", route: "Surabaya → Jakarta", date: "10 Feb 2026", status: "Selesai", price: "Rp 320.000", seat: "14C" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("user_history", JSON.stringify(history));
  }, [history]);
  const [vouchers] = useState(generateVouchers());
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("id"); // "id", "en"
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [hideEmail, setHideEmail] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [tripsDone, setTripsDone] = useState(12);
  const [userReviews, setUserReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem("passenger_user_reviews");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "rev-1",
        title: "Perjalanan Jakarta → Yogyakarta (Kelas Eksekutif)",
        rating: 5,
        content: "Pelayanan sangat memuaskan, bus bersih, AC dingin, dan sopir mengendarai dengan sangat tenang dan aman.",
        date: "28 Jul 2026"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("passenger_user_reviews", JSON.stringify(userReviews));
  }, [userReviews]);

  const [passengerNotifications, setPassengerNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("passenger_notifications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "notif-1",
        title: "Tiket Terkonfirmasi",
        message: "Perjalanan Jakarta → Yogyakarta (15 Mar 2026, Kursi 12A) telah dikonfirmasi.",
        time: "10 menit yang lalu",
        read: false,
        type: "ticket"
      },
      {
        id: "notif-2",
        title: "Promo Spesial Member",
        message: "Gunakan voucher MURNI20 untuk diskon 20% pemesanan tiket Anda.",
        time: "2 jam yang lalu",
        read: false,
        type: "promo"
      },
      {
        id: "notif-3",
        title: "Keamanan Akun",
        message: "Sesi login baru terdeteksi. Pastikan kata sandi Anda tetap aman.",
        time: "1 hari yang lalu",
        read: true,
        type: "security"
      }
    ];
  });
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("passenger_notifications", JSON.stringify(passengerNotifications));
  }, [passengerNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifCount = passengerNotifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setPassengerNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setPassengerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Semua notifikasi telah ditandai dibaca.");
  };

  const handleDeleteNotification = (id: string) => {
    setPassengerNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notifikasi berhasil dihapus.");
  };

  const handleClearAllNotifications = () => {
    setPassengerNotifications([]);
    toast.success("Semua notifikasi telah dibersihkan.");
  };

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [reviewFormData, setReviewFormData] = useState({ title: "", rating: 5, content: "" });
  const navigate = useNavigate();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Pengguna";
  const [phone, setPhone] = useState(() => localStorage.getItem("userPhone") || "+62 812 3456 7890");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const savedPhoto = localStorage.getItem(`local_avatar_${user.uid}`);
      setLocalPhoto(savedPhoto);
    }
  }, [user]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 1.5MB agar pas di memori lokal.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (user) {
        const loadingToast = toast.loading("Memperbarui foto profil...");
        try {
          localStorage.setItem(`local_avatar_${user.uid}`, base64);
          setLocalPhoto(base64);
          window.dispatchEvent(new Event("localAvatarUpdated"));
          toast.success("Foto profil berhasil diperbarui!");
        } catch (err) {
          toast.error("Gagal menyimpan foto profil secara lokal.");
        } finally {
          toast.dismiss(loadingToast);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
      const loadingToast = toast.loading("Menyimpan profil...");
      try {
        await updateProfile(auth.currentUser, { displayName: editName });
        localStorage.setItem("userPhone", editPhone);
        setPhone(editPhone);
        setUser({ ...auth.currentUser });
        toast.success("Profil berhasil diperbarui!");
        setIsEditingProfile(false);
      } catch (err) {
        toast.error("Gagal memperbarui profil.");
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const startEditing = () => {
    setEditName(displayName);
    setEditPhone(phone);
    setIsEditingProfile(true);
  };

  const handleClearExpired = () => {
    setHistory((prev: any[]) => prev.filter(item => item.status !== "Kadaluarsa"));
    setLastUpdated(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    toast.success("Tiket kadaluarsa berhasil dibersihkan.");
  };

  const handleSimulateBooking = () => {
    const newTicket = {
      id: Math.random().toString(36).substr(2, 9),
      route: "Jakarta → Surabaya",
      date: "25 Mar 2026",
      status: "Terjadwal",
      price: "Rp 320.000",
      seat: "14A"
    };
     const newVoucher = {
      id: Math.random().toString(36).substr(2, 9),
      code: `PROMO${100 + vouchers.length}`,
      discount: `${Math.floor(Math.random() * 15) + 5}%`,
      expiry: "31 Dec 2026",
      title: `Voucher Spesial #${vouchers.length + 1}`
    };
    setHistory((prev: any) => [newTicket, ...prev]);
    setTripsDone(prev => prev + 1);
    setLastUpdated(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    
    // Auto add passenger notification
    const bookingNotif = {
      id: `notif-${Date.now()}`,
      title: "Tiket Baru Dipesan!",
      message: `Pemesanan tiket ${newTicket.route} (${newTicket.seat}) berhasil dibuat.`,
      time: "Baru saja",
      read: false,
      type: "ticket"
    };
    setPassengerNotifications(prev => [bookingNotif, ...prev]);

    toast.success("Booking simulasi berhasil ditambahkan ke riwayat pesanan.");
    
    // Switch to orders tab to show new ticket
    setActiveTab("orders");
  };

  const translations = {
    id: {
      backToHome: "Kembali ke Beranda",
      dashboard: "Dashboard",
      orders: "Pesanan Saya",
      vouchers: "Voucher",
      manageNews: "Komentar Saya",
      createArticle: "Tulis Komentar Baru",
      editArticle: "Edit Komentar",
      noArticles: "Belum ada komentar.",
      settings: "Pengaturan",
      accountInfo: "Informasi Akun",
      points: "Poin Murni",
      quickBooking: "Booking Cepat",
      recentActivity: "Aktivitas Terakhir",
      lastUpdated: "Terakhir diperbarui",
      darkMode: "Mode Gelap (Black & White)",
      darkModeDesc: "Ubah tampilan aplikasi menjadi tema gelap premium.",
      language: "Bahasa / Language",
      languageDesc: "Pilih bahasa yang Anda gunakan.",
      security: "Keamanan & Privasi",
      securityDesc: "Atur privasi data dan keamanan akun Anda.",
      push: "Notifikasi Push",
      pushDesc: "Terima update ketersediaan tiket.",
      changePass: "Ubah Kata Sandi",
      logout: "Keluar dari Akun",
      clearExpired: "Hapus Tiket Kadaluarsa",
      buySuccess: "Tiket Berhasil Dibeli!",
      accountSecurity: "Keamanan Akun",
      twoFactor: "Autentikasi Dua Faktor (2FA)",
      twoFactorDesc: "Tambahkan lapisan keamanan ekstra ke akun Anda.",
      activeSessions: "Sesi Aktif",
      loginActivity: "Aktivitas Login",
      logoutAll: "Keluar dari Semua Perangkat",
      privacyMode: "Sembunyikan Email",
      privacyModeDesc: "Jangan tampilkan email saya di profil publik."
    },
    en: {
      backToHome: "Back to Home",
      dashboard: "Dashboard",
      orders: "My Orders",
      vouchers: "Vouchers",
      manageNews: "My Comments",
      createArticle: "Write New Comment",
      editArticle: "Edit Comment",
      noArticles: "No comments yet.",
      settings: "Settings",
      accountInfo: "Account Info",
      points: "Murni Points",
      quickBooking: "Quick Booking",
      recentActivity: "Recent Activity",
      lastUpdated: "Last updated",
      darkMode: "Dark Mode (Black & White)",
      darkModeDesc: "Change the app appearance to premium dark theme.",
      language: "Language",
      languageDesc: "Choose your preferred language.",
      security: "Security & Privacy",
      securityDesc: "Manage your data privacy and account security.",
      push: "Push Notifications",
      pushDesc: "Get updates on ticket availability.",
      changePass: "Change Password",
      logout: "Log Out",
      clearExpired: "Clear Expired Tickets",
      buySuccess: "Ticket Purchased Successfully!",
      accountSecurity: "Account Security",
      twoFactor: "Two-Factor Authentication (2FA)",
      twoFactorDesc: "Add an extra layer of security to your account.",
      activeSessions: "Active Sessions",
      loginActivity: "Login Activity",
      logoutAll: "Logout from All Devices",
      privacyMode: "Hide Email",
      privacyModeDesc: "Do not show my email on public profile."
    }, 
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else if (currentUser.email?.toLowerCase().includes("admin")) {
        navigate("/admin-profile");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleOpenReviewModal = (review: any | null = null) => {
    if (review) {
      setEditingReview(review);
      setReviewFormData({ title: review.title, rating: review.rating || 5, content: review.content });
    } else {
      setEditingReview(null);
      setReviewFormData({ title: "", rating: 5, content: "" });
    }
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormData.title.trim() || !reviewFormData.content.trim()) {
      toast.error("Lengkapi rute/topik dan isi ulasan terlebih dahulu.");
      return;
    }

    const todayDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    if (editingReview) {
      setUserReviews(prev => prev.map(item => item.id === editingReview.id ? { ...item, ...reviewFormData } : item));
      toast.success("Ulasan & rating berhasil diperbarui.");
    } else {
      const newReview = {
        id: `rev-${Date.now()}`,
        ...reviewFormData,
        date: todayDate
      };
      setUserReviews(prev => [newReview, ...prev]);
      toast.success("Ulasan & rating berhasil dikirim.");
    }
    setIsReviewModalOpen(false);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
      setUserReviews(prev => prev.filter(item => item.id !== id));
      toast.success("Ulasan berhasil dihapus.");
    }
  };

  const handleDeleteTicket = (id: string) => {
    setHistory((prev: any[]) => {
      const nextHistory = prev.filter(item => item.id !== id);
      toast.success("Tiket berhasil dihapus dari riwayat.");
      return nextHistory;
    });
  };

  const filteredVouchers = vouchers.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.code.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 50); // Show only top 50 for performance

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeMode === "amoled" ? "bg-black" : themeMode === "slate" ? "bg-[#0F172A]" : "bg-light"}`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className={`min-h-screen transition-colors duration-500 ${themeMode === "amoled" ? "bg-black text-white" : themeMode === "slate" ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-dark"}`}>
      <Header />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/" className={`inline-flex items-center gap-2 font-bold mb-8 transition-colors ${isDarkMode ? "text-white/40 hover:text-white" : "text-dark/40 hover:text-primary"}`}>
            <ArrowLeft size={18} /> {t.backToHome}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Overlay on Mobile / Content on Desktop */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} rounded-[2.5rem] p-8 shadow-sm border text-center relative`}
              >
                <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-primary to-blue-600 rounded-t-[2.5rem] overflow-hidden" />
                
                {/* Small Notification Bell Button in Top Right Corner */}
                <div className="absolute top-4 right-4 z-30" ref={notifRef}>
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifPopover(!showNotifPopover)}
                      className="p-2.5 bg-white/20 hover:bg-white/35 backdrop-blur-md text-white rounded-full transition-all border border-white/30 shadow-lg hover:scale-110 active:scale-95 flex items-center justify-center relative cursor-pointer group"
                      title="Notifikasi Penumpang"
                      aria-label="Notifikasi Penumpang"
                    >
                      <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                      {unreadNotifCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-white shadow-md animate-pulse">
                          {unreadNotifCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown Popover */}
                    <AnimatePresence>
                      {showNotifPopover && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute right-0 mt-3 w-80 sm:w-96 ${
                            isDarkMode
                              ? "bg-[#121212] border-white/10 text-white shadow-2xl shadow-black/90"
                              : "bg-white border-dark/10 text-dark shadow-2xl shadow-dark/10"
                          } rounded-3xl p-5 border z-50 text-left`}
                        >
                          {/* Popover Header */}
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/10">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                <Bell size={14} />
                              </div>
                              <h4 className="text-sm font-bold">Notifikasi Penumpang</h4>
                              {unreadNotifCount > 0 && (
                                <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                                  {unreadNotifCount} Baru
                                </span>
                              )}
                            </div>
                            {passengerNotifications.length > 0 && unreadNotifCount > 0 && (
                              <button
                                onClick={handleMarkAllAsRead}
                                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCheck size={13} /> Tandai Dibaca
                              </button>
                            )}
                          </div>

                          {/* Notifications List */}
                          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                            {passengerNotifications.length > 0 ? (
                              passengerNotifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  onClick={() => handleMarkAsRead(notif.id)}
                                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                                    notif.read
                                      ? isDarkMode
                                        ? "bg-white/5 border-transparent opacity-70 hover:opacity-100"
                                        : "bg-gray-50 border-transparent text-dark/70"
                                      : isDarkMode
                                      ? "bg-primary/10 border-primary/20 text-white"
                                      : "bg-primary/5 border-primary/20 text-dark"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                      <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                                        notif.type === "ticket"
                                          ? "bg-blue-500/20 text-blue-400"
                                          : notif.type === "promo"
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : notif.type === "review"
                                          ? "bg-amber-500/20 text-amber-400"
                                          : "bg-primary/20 text-primary"
                                      }`}>
                                        {notif.type === "ticket" ? (
                                          <Ticket size={14} />
                                        ) : notif.type === "promo" ? (
                                          <Gift size={14} />
                                        ) : notif.type === "review" ? (
                                          <Star size={14} />
                                        ) : (
                                          <Shield size={14} />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p className="text-xs font-bold truncate">{notif.title}</p>
                                          {!notif.read && (
                                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-ping" />
                                          )}
                                        </div>
                                        <p className={`text-[11px] leading-relaxed mt-0.5 ${
                                          isDarkMode ? "text-white/70" : "text-dark/70"
                                        }`}>
                                          {notif.message}
                                        </p>
                                        <p className={`text-[9px] font-medium mt-1.5 ${
                                          isDarkMode ? "text-white/30" : "text-dark/40"
                                        }`}>
                                          {notif.time}
                                        </p>
                                      </div>
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNotification(notif.id);
                                      }}
                                      className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-all shrink-0 cursor-pointer"
                                      title="Hapus Notifikasi"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                                  <Bell size={20} />
                                </div>
                                <p className="text-xs font-bold">Tidak ada notifikasi</p>
                                <p className={`text-[10px] mt-0.5 ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>
                                  Semua pemberitahuan akan muncul di sini.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Footer Actions */}
                          {passengerNotifications.length > 0 && (
                            <div className="pt-3 mt-3 border-t border-gray-200/10 flex items-center justify-between text-[11px]">
                              <button
                                onClick={handleClearAllNotifications}
                                className="text-red-400 hover:text-red-500 font-bold hover:underline cursor-pointer"
                              >
                                Hapus Semua
                              </button>
                              <button
                                onClick={() => setShowNotifPopover(false)}
                                className="text-primary font-bold hover:underline cursor-pointer"
                              >
                                Tutup
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="relative z-10 pt-4">
                  <div className="relative w-32 h-32 mx-auto mb-6 group/avatar">
                    {localPhoto || user.photoURL ? (
                      <img 
                        src={localPhoto || user.photoURL || undefined}
                        alt="Profile" 
                        className="w-full h-full rounded-4xl object-cover ring-4 ring-white shadow-xl"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full rounded-4xl ${isDarkMode ? "bg-[#1A1A1A]" : "bg-light"} flex items-center justify-center ring-4 ring-white shadow-xl`}>
                        <User size={48} className="text-primary/40" />
                      </div>
                    )}
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute -bottom-1 -right-1 bg-primary hover:bg-primary/95 text-white w-9 h-9 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
                      title="Ubah Foto Profil"
                    >
                      <Plus size={16} />
                    </label>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange} 
                    />
                  </div>
                  
                  <h1 className={`text-2xl font-display font-bold mb-1 ${isDarkMode ? "text-white" : "text-dark"}`}>{displayName}</h1>
                  <p className={`${isDarkMode ? "text-white/40" : "text-dark/40"} text-[10px] font-medium mb-2 uppercase tracking-widest flex items-center justify-center gap-2`}>
                    <CreditCard size={12} className="text-primary" />
                    Premium Member
                  </p>
                  <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-tight mb-6`}>
                    {t.lastUpdated}: {lastUpdated}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className={`${isDarkMode ? "bg-[#1A1A1A]" : "bg-light"} p-4 rounded-2xl`}>
                      <p className="text-xl font-bold text-primary">{tripsDone}</p>
                      <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/40" : "text-dark/40"} uppercase tracking-tighter`}>Trips Done</p>
                    </div>
                    <div className={`${isDarkMode ? "bg-[#1A1A1A]" : "bg-light"} p-4 rounded-2xl`}>
                      <p className="text-xl font-bold text-secondary">1.000+</p>
                      <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/40" : "text-dark/40"} uppercase tracking-tighter`}>Vouchers</p>
                    </div>
                  </div>

                  {/* Premium Sidebar Nav */}
                  <nav className="space-y-2 mt-2">
                    {[
                      { 
                        id: "dashboard", 
                        label: t.dashboard, 
                        icon: User,
                        gradient: "from-blue-500 to-primary",
                        badge: null,
                        desc: "Ringkasan akun"
                      },
                      { 
                        id: "orders", 
                        label: t.orders, 
                        icon: History,
                        gradient: "from-orange-400 to-rose-500",
                        badge: history.length > 0 ? history.length : null,
                        desc: "Riwayat perjalanan"
                      },
                      { 
                        id: "vouchers", 
                        label: t.vouchers, 
                        icon: Gift,
                        gradient: "from-emerald-400 to-teal-500",
                        badge: "1K+",
                        desc: "Kode diskon aktif"
                      },
                      { 
                        id: "manage-news", 
                        label: "Komentar & Rating", 
                        icon: Star,
                        gradient: "from-amber-500 to-orange-600",
                        badge: userReviews.length > 0 ? userReviews.length : null,
                        desc: "Ulasan & Rating Penumpang"
                      },
                      { 
                        id: "settings", 
                        label: t.settings, 
                        icon: Settings,
                        gradient: "from-slate-400 to-slate-600",
                        badge: null,
                        desc: "Tema & preferensi"
                      },
                    ].map((item, index) => {
                      const isActive = activeTab === item.id;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden ${
                            isActive
                              ? isDarkMode
                                ? "bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10"
                                : "bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10"
                              : isDarkMode
                              ? "hover:bg-white/5 border border-transparent"
                              : "hover:bg-dark/5 border border-transparent"
                          }`}
                        >
                          {/* Active left bar indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeBar"
                              className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full"
                            />
                          )}

                          {/* Icon with gradient bg */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-linear-to-br ${item.gradient} ${
                            isActive ? "shadow-md" : "opacity-70 group-hover:opacity-100"
                          } transition-opacity`}>
                            <item.icon size={18} className="text-white" />
                          </div>

                          {/* Label & desc */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${
                              isActive
                                ? "text-primary"
                                : isDarkMode
                                ? "text-white/80 group-hover:text-white"
                                : "text-dark/70 group-hover:text-dark"
                            }`}>
                              {item.label}
                            </p>
                            <p className={`text-[10px] truncate ${isDarkMode ? "text-white/30" : "text-dark/30"}`}>
                              {item.desc}
                            </p>
                          </div>

                          {/* Badge */}
                          {item.badge && (
                            <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-primary text-white"
                                : isDarkMode
                                ? "bg-white/10 text-white/60"
                                : "bg-dark/10 text-dark/50"
                            }`}>
                              {item.badge}
                            </span>
                          )}

                          {/* Chevron */}
                          <ChevronRight size={14} className={`shrink-0 transition-transform ${
                            isActive
                              ? "text-primary rotate-90"
                              : isDarkMode
                              ? "text-white/20 group-hover:text-white/40"
                              : "text-dark/20 group-hover:text-dark/40"
                          }`} />
                        </motion.button>
                      );
                    })}

                    {/* Separator + Logout */}
                    <div className={`h-px mx-2 my-2 ${isDarkMode ? "bg-white/10" : "bg-dark/10"}`} />
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        await signOut(auth);
                        toast.success("Anda berhasil keluar dari akun.");
                        navigate("/login");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all border border-transparent group ${
                        isDarkMode ? "hover:bg-red-500/10" : "hover:bg-red-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-linear-to-br from-red-400 to-rose-600 opacity-70 group-hover:opacity-100 transition-opacity">
                        <LogOut size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-red-500 truncate">{t.logout}</p>
                        <p className={`text-[10px] truncate ${isDarkMode ? "text-white/30" : "text-dark/30"}`}>Keluar dari sesi aktif</p>
                      </div>
                      <ChevronRight size={14} className="shrink-0 text-red-400/40 group-hover:text-red-400 transition-colors" />
                    </motion.button>
                  </nav>
                </div>
              </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {activeTab === "dashboard" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-8 rounded-4xl shadow-sm border relative`}>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-dark"}`}>
                               <Mail size={20} className="text-primary" /> {t.accountInfo}
                            </h3>
                            <button 
                              onClick={startEditing}
                              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                            >
                              <Edit2 size={12} /> Edit Profil
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest mb-1`}>Nama Lengkap</p>
                              <p className={`text-sm font-medium ${isDarkMode ? "text-white/90" : "text-dark"}`}>{displayName}</p>
                            </div>
                            <div>
                              <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest mb-1`}>Email</p>
                              <p className={`text-sm font-medium ${isDarkMode ? "text-white/90" : "text-dark"}`}>{user.email || "Email tidak tersedia"}</p>
                            </div>
                            <div>
                               <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest mb-1`}>Telepon</p>
                               <p className={`text-sm font-medium ${isDarkMode ? "text-white/90" : "text-dark"}`}>{phone}</p>
                            </div>
                             <div className="flex items-center justify-between pt-2">
                               <div>
                                 <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest mb-1`}>{t.points}</p>
                                 <p className="text-lg font-bold text-secondary">5.000 Poin</p>
                               </div>
                               <div className="bg-secondary/10 px-3 py-1 rounded-full text-[10px] font-bold text-secondary uppercase">Gold Tier</div>
                             </div>
                          </div>
                        </div>

                        <div className="bg-primary p-8 rounded-4xl shadow-xl text-white relative overflow-hidden group">
                          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                             <Ticket size={160} />
                          </div>
                          <h3 className="text-lg font-bold mb-2">{t.quickBooking}</h3>
                          <p className="text-white/70 text-sm mb-8">Pesan tiket perjalananmu selanjutnya dengan harga terbaik.</p>
                          <div className="flex flex-wrap gap-3">
                            <Link to="/booking" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                              Cari Tiket <ChevronRight size={16} />
                            </Link>
                            <button 
                              onClick={handleSimulateBooking}
                              className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                            >
                              Mock Buy <Ticket size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Extra Analytics & Statistics Widgets inside Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-6 rounded-3xl border shadow-sm flex items-center gap-4`}>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Globe size={24} />
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-wider`}>Jarak Ditempuh</p>
                            <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-dark"}`}>2.450 km</p>
                          </div>
                        </div>
                        <div className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-6 rounded-3xl border shadow-sm flex items-center gap-4`}>
                          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                            <Ticket size={24} />
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-wider`}>E-Tiket Aktif</p>
                            <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-dark"}`}>{history.filter((t: { status: string; }) => t.status === "Terjadwal").length} Tiket</p>
                          </div>
                        </div>
                        <div className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-6 rounded-3xl border shadow-sm flex items-center gap-4`}>
                          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                            <Shield size={24} />
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-wider`}>Karbon Dihemat</p>
                            <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-dark"}`}>32,4 kg CO₂</p>
                          </div>
                        </div>
                      </div>

                      {/* Info & Announcement Banner */}
                      <div className="bg-linear-to-r from-orange-500 to-amber-500 p-6 rounded-4xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                        <div>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white">Promo Minggu Ini</span>
                          <h4 className="text-lg font-black mt-2">Dapatkan Cashback 10% untuk Rute Jakarta-Yogyakarta!</h4>
                          <p className="text-white/80 text-xs mt-1">Gunakan kode voucher MURNI20 saat melakukan pemesanan tiket.</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab("vouchers")}
                          className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-xs hover:scale-105 transition-transform shrink-0 shadow-md"
                        >
                          Lihat Voucher
                        </button>
                      </div>

                      <div className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-8 rounded-[2.5rem] shadow-sm border`}>
                        <div className="flex items-center justify-between mb-8">
                          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>{t.recentActivity}</h3>
                          <button onClick={() => setActiveTab("orders")} className="text-primary text-xs font-bold hover:underline">Lihat Semua</button>
                        </div>
                        <div className="space-y-4">
                          {history.slice(0, 3).map((item: { id: string; route: string; date: string; seat: string; status: string; price: string }) => (
                            <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors group ${isDarkMode ? "bg-[#1A1A1A]/50 border-white/5 hover:bg-[#1A1A1A]" : "bg-light/50 border-dark/5 hover:bg-light"}`}>
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center text-primary ${isDarkMode ? "bg-black" : "bg-white"}`}>
                                  <History size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-dark"}`}>{item.route}</p>
                                  <p className={`text-xs font-medium truncate ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{item.date} • {item.seat}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                                  item.status === "Terjadwal" ? "bg-primary/10 text-primary" : `${isDarkMode ? "bg-white/10 text-white/40" : "bg-dark/10 text-dark/40"}`
                                }`}>
                                  {item.status}
                                </span>
                                {(item.status === "Selesai" || item.status === "Kadaluarsa") && (
                                  <button 
                                    onClick={() => handleDeleteTicket(item.id)}
                                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "orders" && (
                     <div className={`${isDarkMode ? "bg-black border-white/5 text-white" : "bg-white border-dark/5 text-dark"} p-8 rounded-[2.5rem] shadow-sm border`}>
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-2xl font-display font-bold">Riwayat Pesanan</h3>
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-white/30" : "text-dark/30"}`}>{history.length} perjalanan tercatat</p>
                          </div>
                          {history.some((item: { status: string; }) => item.status === "Kadaluarsa") && (
                            <button 
                              onClick={handleClearExpired}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={14} /> {t.clearExpired}
                            </button>
                          )}
                        </div>
                        <div className="space-y-5">
                           {history.map((item: { id: string; route: string; date: string; seat: string; status: string; price: string }, index: number) => {
                             const isScheduled = item.status === "Terjadwal";
                             const isDone = item.status === "Selesai";
                             const statusColor = isScheduled
                               ? "from-emerald-500 to-teal-500"
                               : isDone
                               ? "from-blue-500 to-primary"
                               : "from-slate-400 to-slate-500";
                             const [from, to] = item.route.split("→").map(s => s.trim());
                             return (
                               <motion.div 
                                 key={item.id}
                                 initial={{ opacity: 0, y: 12 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ delay: index * 0.05 }}
                                 className={`rounded-3xl overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 group ${isDarkMode ? "border-white/5" : "border-dark/5"}`}
                               >
                                 {/* Ticket Header */}
                                 <div className={`bg-linear-to-r ${statusColor} p-5 flex items-center justify-between`}>
                                   <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                       <Ticket size={20} className="text-white" />
                                     </div>
                                     <div>
                                       <p className="text-white font-black text-base tracking-tight">{from} → {to}</p>
                                       <p className="text-white/70 text-[11px] font-medium">ID: #MJ-{item.id.slice(-4).toUpperCase()}321</p>
                                     </div>
                                   </div>
                                   <div className="text-right">
                                     <p className="text-white font-black text-xl">{item.price}</p>
                                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider`}>
                                       {item.status}
                                     </span>
                                   </div>
                                 </div>

                                 {/* Perforated divider */}
                                 <div className={`flex items-center px-5 ${isDarkMode ? "bg-[#0D0D0D]" : "bg-gray-50"}`}>
                                   <div className={`w-5 h-5 rounded-full -ml-7 shrink-0 ${isDarkMode ? "bg-black" : "bg-gray-200"}`} />
                                   <div className={`flex-1 border-t-2 border-dashed mx-2 ${isDarkMode ? "border-white/10" : "border-dark/10"}`} />
                                   <div className={`w-5 h-5 rounded-full -mr-7 shrink-0 ${isDarkMode ? "bg-black" : "bg-gray-200"}`} />
                                 </div>

                                 {/* Ticket Body */}
                                 <div className={`p-5 grid grid-cols-3 gap-4 ${isDarkMode ? "bg-[#0D0D0D]" : "bg-gray-50"}`}>
                                   <div>
                                     <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-white/30" : "text-dark/30"}`}>Tanggal</p>
                                     <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>{item.date}</p>
                                   </div>
                                   <div>
                                     <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-white/30" : "text-dark/30"}`}>Waktu</p>
                                     <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>08:00 WIB</p>
                                   </div>
                                   <div>
                                     <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-white/30" : "text-dark/30"}`}>Kursi</p>
                                     <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>{item.seat}</p>
                                   </div>
                                 </div>

                                 {/* Ticket Footer */}
                                 <div className={`px-5 py-3 flex items-center justify-between border-t ${isDarkMode ? "border-white/5 bg-[#0D0D0D]" : "border-dark/5 bg-gray-50"}`}>
                                   <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                                     <FileText size={12} /> Unduh E-Tiket
                                   </button>
                                   {(isDone || item.status === "Kadaluarsa") && (
                                     <button 
                                       onClick={() => handleDeleteTicket(item.id)}
                                       className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                                     >
                                       <Trash2 size={12} /> Hapus
                                     </button>
                                   )}
                                 </div>
                               </motion.div>
                             );
                           })}
                           {history.length === 0 && (
                             <div className="text-center py-16">
                               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                 <History size={32} />
                               </div>
                               <h4 className="text-lg font-bold mb-1">Riwayat Kosong</h4>
                               <p className={`text-sm ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>Anda belum memiliki riwayat perjalanan.</p>
                             </div>
                           )}
                        </div>
                     </div>
                  )}

                  {activeTab === "vouchers" && (
                    <div className="space-y-6">
                      <div className={`${isDarkMode ? "bg-[#0D0D0D]" : "bg-white"} p-4 rounded-2xl shadow-sm border ${isDarkMode ? "border-white/5" : "border-dark/5"} flex items-center gap-3`}>
                        <Gift className="text-secondary" />
                        <input 
                          type="text" 
                          placeholder="Cari voucher..." 
                          className={`bg-transparent border-none outline-none w-full text-sm font-medium ${isDarkMode ? "text-white" : "text-dark"}`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredVouchers.map((v) => (
                          <motion.div 
                            layout
                            key={v.id} 
                            className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-8 rounded-[2.5rem] shadow-sm border relative overflow-hidden group`}
                          >
                              <div className="absolute -right-5 -top-5 w-32 h-32 bg-secondary/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
                              <div className="relative z-10">
                                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                                    <Gift size={24} />
                                </div>
                                <h3 className={`text-xl font-display font-bold mb-1 ${isDarkMode ? "text-white" : "text-dark"}`}>{v.title}</h3>
                                <p className={`text-sm font-medium mb-6 ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>Berlaku hingga {v.expiry}</p>
                                
                                <div className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed ${isDarkMode ? "bg-black border-white/10" : "bg-light border-dark/10"}`}>
                                    <span className={`text-lg font-mono font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>{v.code}</span>
                                    <span className="text-2xl font-bold text-secondary">{v.discount}</span>
                                </div>
                              </div>
                          </motion.div>
                        ))}
                      </div>
                      {filteredVouchers.length < vouchers.length && !searchQuery && (
                        <p className="text-center text-xs text-dark/30 font-bold uppercase tracking-widest mt-8">
                          Menampilkan 50 dari {vouchers.length} voucher yang tersedia
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className={`${themeMode === "amoled" ? "bg-black border-white/10" : themeMode === "slate" ? "bg-[#1E293B] border-slate-800" : "bg-white border-dark/5 text-dark"} p-8 rounded-[2.5rem] shadow-sm border`}>
                       <h3 className="text-2xl font-display font-bold mb-8">{t.settings}</h3>
                       <div className="space-y-4">
                          {/* Theme Selector (2 Dark Options) */}
                          <div className={`p-6 rounded-4xl border transition-all ${themeMode === "amoled" ? "bg-black border-white/10" : themeMode === "slate" ? "bg-[#0F172A] border-slate-800" : "bg-light/30 border-dark/5"}`}>
                            <div className="flex items-center gap-4 mb-5">
                              <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center ${isDarkMode ? "bg-black/30" : "bg-white"} text-primary`}>
                                 <Moon size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold">Tema Tampilan</p>
                                 <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>Pilih antara Mode Terang atau 2 jenis Mode Gelap.</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { id: "light", label: "Terang", desc: "Classic Light", icon: Sun },
                                { id: "slate", label: "Slate", desc: "Softer Dark", icon: Moon },
                                { id: "amoled", label: "AMOLED", desc: "Pure Black", icon: Moon }
                              ].map((tItem) => {
                                const Icon = tItem.icon;
                                const isActive = themeMode === tItem.id;
                                return (
                                  <button
                                    key={tItem.id}
                                    onClick={() => {
                                      setThemeMode(tItem.id as any);
                                      localStorage.setItem("themeMode", tItem.id);
                                      toast.success(`Tema tampilan diubah ke ${tItem.label}.`);
                                    }}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                                      isActive
                                        ? "bg-primary text-white border-primary shadow-lg scale-105"
                                        : `${isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10 text-white/70" : "bg-white border-dark/5 text-dark/70 hover:bg-light"}`
                                    }`}
                                  >
                                    <Icon size={16} className={isActive ? "text-white" : "text-primary"} />
                                    <span className="text-xs font-bold mt-2">{tItem.label}</span>
                                    <span className={`text-[9px] font-medium block mt-0.5 opacity-60`}>{tItem.desc}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowLanguageModal(true)}
                            className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${isDarkMode ? "bg-[#0D0D0D] border-white/5 hover:bg-[#1A1A1A]" : "bg-light/30 border-dark/5 hover:bg-light"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center ${isDarkMode ? "bg-black text-white/60" : "bg-white text-dark/40"}`}>
                                   <Globe size={18} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold">{t.language}</p>
                                   <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{t.languageDesc}</p>
                                </div>
                             </div>
                             <span className="text-xs font-bold text-primary">{language === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
                          </button>

                          <button 
                            onClick={() => setShowSecurityModal(true)}
                            className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${isDarkMode ? "bg-[#0D0D0D] border-white/5 hover:bg-[#1A1A1A]" : "bg-light/30 border-dark/5 hover:bg-light"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center ${isDarkMode ? "bg-black text-white/60" : "bg-white text-dark/40"}`}>
                                   <Shield size={18} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold">{t.security}</p>
                                   <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{t.securityDesc}</p>
                                </div>
                             </div>
                             <ChevronRight size={18} className={isDarkMode ? "text-white/30" : "text-dark/20"} />
                          </button>
                          
                          <button 
                            onClick={() => {
                              setIsPushEnabled(prev => {
                                const next = !prev;
                                toast.success(next ? "Notifikasi push diaktifkan." : "Notifikasi push dinonaktifkan.");
                                return next;
                              });
                            }}
                            className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${isDarkMode ? "bg-[#0D0D0D] border-white/5 hover:bg-[#1A1A1A]" : "bg-light/30 border-dark/5 hover:bg-light"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center ${isDarkMode ? "bg-black text-white/60" : "bg-white text-dark/40"}`}>
                                   <Bell size={18} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold">{t.push}</p>
                                   <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{t.pushDesc}</p>
                                </div>
                             </div>
                             <div className={`w-12 h-6 rounded-full p-1 relative transition-colors duration-300 ${isPushEnabled ? "bg-primary" : "bg-gray-300"}`}>
                                <motion.div 
                                  animate={{ x: isPushEnabled ? 24 : 0 }}
                                  className="w-4 h-4 bg-white rounded-full shadow-sm" 
                                />
                             </div>
                          </button>
                          
                          <div className="pt-4 flex flex-col gap-3">
                              <button className="flex items-center gap-2 text-primary text-sm font-bold hover:underline transition-all w-fit">
                                <Settings size={18} /> {t.changePass}
                              </button>
                              <button 
                                onClick={() => auth.signOut()}
                                className="flex items-center gap-2 text-red-500 text-sm font-bold hover:underline transition-all w-fit"
                              >
                                <LogOut size={18} /> {t.logout}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === "manage-news" && (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h3 className={`text-2xl font-display font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>Ulasan & Rating Saya</h3>
                          <p className={`text-sm ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>Beri rating dan bagikan pengalaman perjalanan Anda bersama Po. Murni Jaya.</p>
                        </div>
                        <button 
                          onClick={() => handleOpenReviewModal()}
                          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl w-fit"
                        >
                          <Plus size={20} /> Tulis Ulasan & Rating
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {userReviews.length === 0 ? (
                          <div className={`text-center py-20 rounded-[2.5rem] border-2 border-dashed ${isDarkMode ? "border-white/10" : "border-dark/10"}`}>
                            <Star size={48} className="mx-auto mb-4 text-amber-400/40" />
                            <p className="text-dark/40 font-bold uppercase tracking-widest text-sm">Belum Ada Ulasan</p>
                            <p className="text-dark/30 text-xs mt-1">Beri rating dan komentar untuk perjalanan bus yang telah Anda lakukan.</p>
                          </div>
                        ) : (
                          userReviews.map((review) => (
                            <div key={review.id} className={`${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-dark/5"} p-6 rounded-4xl border shadow-sm group hover:border-primary/30 transition-all`}>
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h4 className={`font-bold text-base ${isDarkMode ? "text-white" : "text-dark"}`}>{review.title}</h4>
                                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                                      <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            size={13} 
                                            className={i < (review.rating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                                          />
                                        ))}
                                      </div>
                                      <span className="ml-1">{review.rating || 5}/5</span>
                                    </div>
                                  </div>
                                  <p className={`text-sm italic mb-3 ${isDarkMode ? "text-white/80" : "text-dark/80"} leading-relaxed`}>"{review.content}"</p>
                                  <p className={`text-xs ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{review.date} • Ulasan Anda</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button 
                                    onClick={() => handleOpenReviewModal(review)}
                                    className={`p-3 rounded-xl transition-all ${isDarkMode ? "bg-white/5 text-white/60 hover:bg-primary/20 hover:text-primary" : "bg-light text-dark/40 hover:bg-primary/10 hover:text-primary"}`}
                                    title="Edit Ulasan"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteReview(review.id)}
                                    className={`p-3 rounded-xl transition-all ${isDarkMode ? "bg-white/5 text-white/60 hover:bg-red-500/20 hover:text-red-500" : "bg-light text-dark/40 hover:bg-red-500/10 hover:text-red-500"}`}
                                    title="Hapus Ulasan"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className={`${isDarkMode ? "bg-black border-white/10" : "bg-white border-dark/5"} relative z-10 w-full max-w-lg p-10 rounded-[3rem] shadow-2xl border overflow-y-auto max-h-[90vh]`}
             >
               <div className="flex items-center justify-between mb-8">
                <h3 className={`text-2xl font-display font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>{t.accountSecurity}</h3>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
               </div>

               <div className="space-y-6 mb-10">
                 {/* 2FA Toggle */}
                 <div className={`p-6 rounded-4xl border transition-all ${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-light/30 border-dark/5"}`}>
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-sm font-bold flex items-center gap-2">
                       <Shield size={16} className="text-primary" /> {t.twoFactor}
                     </p>
                     <div 
                      onClick={() => {
                        setIs2FAEnabled(prev => {
                          const next = !prev;
                          toast.success(next ? "2FA berhasil diaktifkan." : "2FA berhasil dinonaktifkan.");
                          return next;
                        });
                      }}
                      className={`w-10 h-5 rounded-full p-1 relative cursor-pointer transition-colors duration-300 ${is2FAEnabled ? "bg-primary" : "bg-gray-300"}`}
                     >
                        <motion.div 
                          animate={{ x: is2FAEnabled ? 20 : 0 }}
                          className="w-3 h-3 bg-white rounded-full shadow-sm" 
                        />
                     </div>
                   </div>
                   <p className={`text-xs ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{t.twoFactorDesc}</p>
                 </div>

                 {/* Privacy Toggle */}
                 <div className={`p-6 rounded-4xl border transition-all ${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-light/30 border-dark/5"}`}>
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-sm font-bold flex items-center gap-2">
                       <Globe size={16} className="text-secondary" /> {t.privacyMode}
                     </p>
                     <div 
                      onClick={() => {
                        setHideEmail(prev => {
                          const next = !prev;
                          toast.success(next ? "Email Anda disembunyikan dari profil publik." : "Email Anda tampil kembali di profil publik.");
                          return next;
                        });
                      }}
                      className={`w-10 h-5 rounded-full p-1 relative cursor-pointer transition-colors duration-300 ${hideEmail ? "bg-secondary" : "bg-gray-300"}`}
                     >
                        <motion.div 
                          animate={{ x: hideEmail ? 20 : 0 }}
                          className="w-3 h-3 bg-white rounded-full shadow-sm" 
                        />
                     </div>
                   </div>
                   <p className={`text-xs ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>{t.privacyModeDesc}</p>
                 </div>

                 {/* Login Activity */}
                 <div className={`p-6 rounded-4xl border transition-all ${isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-light/30 border-dark/5"}`}>
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">{t.loginActivity}</p>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                           <MapPin size={14} />
                         </div>
                         <div>
                           <p className="text-xs font-bold">Jakarta, Indonesia</p>
                           <p className="text-[10px] text-dark/40">Sesi Ini • Chrome on Windows</p>
                         </div>
                       </div>
                       <span className="text-[9px] font-bold text-green-500 uppercase">Aktif</span>
                     </div>
                     <div className="flex items-center justify-between opacity-50">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-dark/5 flex items-center justify-center text-dark/40">
                           <MapPin size={14} />
                         </div>
                         <div>
                           <p className="text-xs font-bold">Yogyakarta, Indonesia</p>
                           <p className="text-[10px] text-dark/40">2 jam yang lalu • Mobile App</p>
                         </div>
                       </div>
                       <span className="text-[9px] font-bold text-dark/30 uppercase">Selesai</span>
                     </div>
                   </div>
                   <button
                     onClick={() => {
                       toast.success("Semua sesi lain telah ditutup.");
                     }}
                     className="w-full mt-6 py-3 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                   >
                     {t.logoutAll}
                   </button>
                 </div>
               </div>
               
               <button 
                 onClick={() => setShowSecurityModal(false)}
                 className="w-full py-5 bg-dark text-white font-bold rounded-3xl shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
               >
                 Tutup Panel Keamanan
               </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDarkMode ? "bg-black border-white/10" : "bg-white border-dark/5"} relative z-10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border`}
            >
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark"}`}>{t.language}</h3>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {[
                  { id: 'id', label: 'Bahasa Indonesia', native: 'Indonesia' },
                  { id: 'en', label: 'English', native: 'United Kingdom' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => { setLanguage(lang.id); setShowLanguageModal(false); }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      language === lang.id 
                      ? "bg-primary border-primary text-white" 
                      : `${isDarkMode ? "bg-[#0D0D0D] border-white/5 text-white" : "bg-light border-dark/5 text-dark"} hover:border-primary`
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{lang.label}</p>
                      <p className={`text-[10px] ${language === lang.id ? "text-white/60" : "text-dark/30"}`}>{lang.native}</p>
                    </div>
                    {language === lang.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review & Rating Editor Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDarkMode ? "bg-[#0D0D0D] border-white/10" : "bg-white border-dark/5"} relative z-10 w-full max-w-2xl p-8 sm:p-10 rounded-[3rem] shadow-2xl border overflow-y-auto max-h-[90vh]`}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={`text-2xl font-display font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>
                    {editingReview ? "Edit Ulasan & Rating" : "Tulis Ulasan & Rating Perjalanan"}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-white/40" : "text-dark/40"}`}>Bagikan kesan dan rating Anda untuk layanan Po. Murni Jaya.</p>
                </div>
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <Star size={28} className="fill-amber-400" />
                </div>
              </div>

              <form onSubmit={handleSaveReview} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest pl-2`}>Topik / Rute Perjalanan</label>
                  <div className="relative">
                    <Type className={`absolute left-4 top-4 ${isDarkMode ? "text-white/20" : "text-dark/20"}`} size={18} />
                    <input 
                      required
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl font-medium outline-none transition-all ${isDarkMode ? "bg-black text-white focus:ring-1 focus:ring-primary" : "bg-light text-dark focus:ring-2 focus:ring-primary"}`}
                      value={reviewFormData.title}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, title: e.target.value })}
                      placeholder="Contoh: Perjalanan Jakarta - Yogyakarta (Eksekutif)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest pl-2`}>Beri Rating (1 - 5 Bintang)</label>
                  <div className={`p-4 rounded-2xl flex items-center gap-2 ${isDarkMode ? "bg-black" : "bg-light"}`}>
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setReviewFormData({ ...reviewFormData, rating: starVal })}
                        className="p-2 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={starVal <= reviewFormData.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                        />
                      </button>
                    ))}
                    <span className="ml-3 font-bold text-sm text-amber-500">
                      {reviewFormData.rating} / 5 Bintang
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold ${isDarkMode ? "text-white/30" : "text-dark/30"} uppercase tracking-widest pl-2`}>Isi Ulasan & Komentar</label>
                  <textarea 
                    required
                    rows={5}
                    className={`w-full p-5 rounded-2xl font-medium outline-none transition-all ${isDarkMode ? "bg-black text-white focus:ring-1 focus:ring-primary" : "bg-light text-dark focus:ring-2 focus:ring-primary"}`}
                    value={reviewFormData.content}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, content: e.target.value })}
                    placeholder="Tuliskan pengalaman Anda mengenai kenyamanan armada, kebersihan, ketepatan waktu, dan pengemudi..."
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 group"
                  >
                    {editingReview ? "Simpan Ulasan" : "Kirim Ulasan & Rating"}
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className={`flex-1 py-4 font-bold rounded-2xl transition-all ${isDarkMode ? "bg-white/5 text-white/40 hover:bg-white/10" : "bg-light text-dark/40 hover:bg-dark/5"}`}
                  >
                    Batalkan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDarkMode ? "bg-[#0D0D0D] border-white/10" : "bg-white border-dark/5"} relative z-10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border`}
            >
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark"}`}>Ubah Informasi Profil</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${isDarkMode ? "text-white/40" : "text-dark/40"} uppercase tracking-wider pl-1`}>Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    className={`w-full px-4 py-3 rounded-xl outline-none border ${
                      isDarkMode 
                        ? "bg-black border-white/10 text-white focus:border-primary" 
                        : "bg-light border-dark/10 text-dark focus:border-primary"
                    }`}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${isDarkMode ? "text-white/40" : "text-dark/40"} uppercase tracking-wider pl-1`}>Nomor Telepon</label>
                  <input 
                    type="text" 
                    required
                    className={`w-full px-4 py-3 rounded-xl outline-none border ${
                      isDarkMode 
                        ? "bg-black border-white/10 text-white focus:border-primary" 
                        : "bg-light border-dark/10 text-dark focus:border-primary"
                    }`}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl shadow-md hover:scale-[1.02] transition-transform active:scale-95 text-sm"
                  >
                    Simpan
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className={`flex-1 py-3 font-bold rounded-2xl text-sm transition-all ${
                      isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-light text-dark/40 hover:bg-dark/5"
                    }`}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

