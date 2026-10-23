import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

// Firebase imports
import { auth } from "@/lib/firebase";
import {
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

type NavItem = {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/about" },
  {
    name: "Layanan",
    children: [
      { name: "Bus Penumpang", href: "/services" },
      { name: "Pengiriman Paket", href: "/paket" },
    ],
  },
  { name: "Tim", href: "/teams" },
  { name: "Perjalanan", href: "/trips" },
  { name: "Berita", href: "/blog" },
  { name: "FAQ", href: "/faq" },
];
 
export default function Header() {
  const { themeMode, isDarkMode } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to Firebase auth state
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLocalPhoto(localStorage.getItem(`local_avatar_${currentUser.uid}`));
      } else {
        setLocalPhoto(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      if (user) {
        setLocalPhoto(localStorage.getItem(`local_avatar_${user.uid}`));
      }
    };
    window.addEventListener("localAvatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("localAvatarUpdated", handleAvatarUpdate);
  }, [user]);


  // Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  const showSolidHeader = isScrolled || !isHome;

  const headerBgClass = showSolidHeader
    ? themeMode === "amoled"
      ? "bg-black/90 border-b border-white/5 shadow-lg py-2"
      : themeMode === "slate"
      ? "bg-[#0F172A]/90 border-b border-slate-800/60 shadow-lg py-2"
      : "bg-white/90 border-b border-dark/5 shadow-lg py-2"
    : "bg-transparent py-4";

  const headerTextClass = showSolidHeader
    ? isDarkMode
      ? "text-white"
      : "text-dark"
    : "text-white";

  const headerSubTextClass = showSolidHeader
    ? isDarkMode
      ? "text-slate-400"
      : "text-slate-500"
    : "text-white/80";

  const linkTextClass = showSolidHeader
    ? isDarkMode
      ? "text-white/80 hover:text-white"
      : "text-dark/70 hover:text-primary"
    : "text-white/80 hover:text-white";

  return (
    <>
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300 backdrop-blur-md",
          headerBgClass
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="shrink-0 flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="relative w-12 h-12 rounded-xl shadow-md flex items-center justify-center overflow-hidden border border-white/10">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXolljzqjAZveu4jBtkrhdmJp5vK1SG3eAHNUU42z9I6QAK--GgA3XrYNh"
                    alt="Murni Jaya Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={cn(
                      "text-xs sm:text-sm md:text-lg font-display font-bold tracking-tight leading-tight",
                      headerTextClass
                    )}
                  >
                   PT. MURNI ANUGRAH JAYA USAHA 
                  </span>
                  <span
                    className={cn(
                      "text-[8px] sm:text-[10px] font-medium tracking-[0.05em] sm:tracking-widest uppercase",
                      headerSubTextClass
                    )}
                  >
                    Bus Antar Kota Antar Provinsi
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                item.children ? (
                  <div key={item.name} className="relative group">
                    <button
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                        linkTextClass
                      )}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-dark/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-dark hover:bg-light hover:text-primary transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      linkTextClass
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}

              <div className="flex items-center pl-4 md:pl-8 border-l border-white/20">
                {user ? (
                  <div className="flex items-center gap-4 relative">
                    <Link to="/booking" className="btn-primary shadow-lg ring-2 ring-white/20 whitespace-nowrap">
                      Pesan Tiket
                    </Link>

                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary p-1 rounded-full",
                          showSolidHeader ? "text-dark/70" : "text-white/80"
                        )}
                      >
                        {localPhoto || user.photoURL ? (
                          <img
                            src={localPhoto || user.photoURL || undefined}
                            alt="avatar"
                            className="w-8 h-8 rounded-full border-2 border-primary shadow-sm"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/30">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </button>

                      <AnimatePresence>
                        {isProfileOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setIsProfileOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-dark/5 py-2 z-50 overflow-hidden"
                            >
                              <div className="px-4 py-3 border-b border-dark/5 mb-1">
                                <p className="text-xs font-bold text-dark truncate">
                                  {user.displayName}
                                </p>
                                <p className="text-[10px] text-dark/40 truncate">
                                  {user.email}
                                </p>
                              </div>

                              {!user.email?.toLowerCase().includes("admin") && (
                                <Link
                                  to="/profile"
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-dark hover:bg-light transition-colors"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  <User className="h-4 w-4 text-primary" />
                                  Profil Saya
                                </Link>
                              )}
                              {user.email?.toLowerCase().includes("admin") && (
                                <Link
                                  to="/admin-profile"
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-dark hover:bg-light transition-colors"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  <Shield className="h-4 w-4 text-primary" />
                                  Admin Panel
                                </Link>
                              )}


                              <button
                                onClick={() => {
                                  handleLogout();
                                  setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                              >
                                <LogOut className="h-4 w-4" />
                                Keluar
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  /* ── TOMBOL MASUK — selalu terlihat ── */
                  <Link
                    to="/login"
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 shadow-sm",
                      showSolidHeader
                        ? "border-primary bg-primary text-white hover:bg-primary/90"
                        : "border-white bg-white text-primary hover:bg-white/90"
                    )}
                  >
                    Masuk
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  showSolidHeader ? "text-dark" : "text-white"
                )}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-xl">
                {navigation.map((item) => (
                  item.children ? (
                    <div key={item.name} className="space-y-1">
                      <div className="block px-3 py-2 text-base font-medium text-dark justify-between items-center">
                        {item.name}
                        <ChevronDown className="w-4 h-4 text-dark/70" />
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-3 py-2 text-sm font-medium text-dark/80 hover:text-primary hover:bg-light rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href!}
                      className="block px-3 py-2 text-base font-medium text-dark hover:text-primary hover:bg-light rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}

                <div className="pt-4 border-t border-gray-100 px-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-dark">
                        {(localPhoto || user.photoURL) && (
                        <img
                          src={localPhoto || user.photoURL || undefined}
                          alt="avatar"
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`;
                          }}
                        />
                      )}
                        <span className="font-medium truncate">{user.displayName}</span>
                      </div>
                      {!user.email?.toLowerCase().includes("admin") && (
                        <Link
                          to="/profile"
                          className="block px-3 py-2 text-base font-medium text-dark hover:text-primary hover:bg-light rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          Profil Saya
                        </Link>
                      )}
                      {user.email?.toLowerCase().includes("admin") && (
                        <Link
                          to="/admin-profile"
                          className="block px-3 py-2 text-base font-medium text-dark hover:text-primary hover:bg-light rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/booking"
                        className="mt-2 block px-3 py-2 text-base font-medium bg-primary text-white rounded-md text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Pesan Tiket
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="mt-2 w-full block px-3 py-2 text-base font-medium text-red-500 border border-red-200 rounded-md text-center"
                      >
                        Keluar
                      </button>
                    </>
                  ) : (
                    <div className="pt-2">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full block px-4 py-3 text-sm font-bold bg-primary text-white rounded-xl text-center shadow-md transition-all"
                      >
                        Masuk
                      </Link>

                      {/* Removed admin mobile buttons per request; only 'Masuk' remains */}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}