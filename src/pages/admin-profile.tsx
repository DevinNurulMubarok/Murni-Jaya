import React, { useState, useEffect, useMemo } from "react";
import {
  Bus, Users, Ticket, TrendingUp, DollarSign, Calendar,
  LogOut, Search, Filter, CheckCircle2, Clock, XCircle,
  MapPin, Eye, Edit2, Trash2, AlertCircle, ArrowUpRight,
  BarChart2, RefreshCw, User, Phone, Mail, Hash, Star,
  ChevronDown, Shield, Zap, Award, Plus, Download, Home
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {
  collection, onSnapshot, query, orderBy, doc,
  updateDoc, deleteDoc, getCountFromServer
} from "firebase/firestore";

type TabType = "dashboard" | "analytics" | "tiket" | "penumpang" | "armada" | "kelola";

const FLEET = [
  { id: "MJ-001", plat: "B 1234 MJ", kelas: "Executive", kapasitas: 44, supir: "Budi Santoso", rute: "Jakarta - Yogyakarta", status: "Beroperasi" },
  { id: "MJ-002", plat: "B 5678 MJ", kelas: "VIP", kapasitas: 32, supir: "Ahmad Ridwan", rute: "Jakarta - Bandung", status: "Beroperasi" },
  { id: "MJ-003", plat: "B 9012 MJ", kelas: "Executive", kapasitas: 44, supir: "Dedi Kurniawan", rute: "Jakarta - Surabaya", status: "Beroperasi" },
  { id: "MJ-004", plat: "B 3456 MJ", kelas: "Executive", kapasitas: 44, supir: "Hendra Wijaya", rute: "Sedang Diservis", status: "Servis" },
  { id: "MJ-005", plat: "B 7890 MJ", kelas: "VIP", kapasitas: 32, supir: "Rudi Hermawan", rute: "Jakarta - Semarang", status: "Beroperasi" },
  { id: "MJ-006", plat: "B 2345 MJ", kelas: "Executive", kapasitas: 44, supir: "Eko Prasetyo", rute: "Jakarta - Solo", status: "Standby" },
  { id: "MJ-007", plat: "B 6789 MJ", kelas: "VIP", kapasitas: 32, supir: "Fajar Nugroho", rute: "Jakarta - Malang", status: "Beroperasi" },
];

export default function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [editingTicket, setEditingTicket] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/admin-login");
      } else if (!currentUser.email?.toLowerCase().includes("admin")) {
        navigate("/profile");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const parsePrice = (priceVal: any): number => {
    if (typeof priceVal === "number") return priceVal;
    if (typeof priceVal === "string") {
      const cleaned = priceVal.replace(/[^0-9]/g, "");
      return parseInt(cleaned, 10) || 0;
    }
    return 0;
  };

  useEffect(() => {
    if (!user) return;

    const getMergedTickets = (firestoreDocs: any[]) => {
      try {
        const localSaved = localStorage.getItem("user_history");
        const localTickets = localSaved ? JSON.parse(localSaved) : [];
        const map = new Map<string, any>();
        firestoreDocs.forEach((d) => map.set(d.id, { ...d, price: parsePrice(d.price) }));
        localTickets.forEach((lt: any) => {
          if (!map.has(lt.id)) {
            map.set(lt.id, {
              ...lt,
              status: lt.status === "Terjadwal" ? "Lunas" : (lt.status || "Lunas"),
              price: parsePrice(lt.price)
            });
          }
        });
        return Array.from(map.values());
      } catch {
        return firestoreDocs;
      }
    };

    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const merged = getMergedTickets(docs);
      if (lastCount > 0 && merged.length > lastCount) {
        showNotification("success", `🎉 Tiket baru masuk dari ${(merged[0] as any)?.name || "penumpang"}!`);
      }
      setLastCount(merged.length);
      setTransactions(merged);
    }, (err) => {
      console.warn("Firestore snapshot error, falling back to local history:", err);
      const localOnly = getMergedTickets([]);
      setTransactions(localOnly);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const showNotification = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  const formatRupiah = (n: any) => {
    const num = parsePrice(n);
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  };

  const formatDate = (ts: any) => {
    if (!ts) return "-";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const totalRevenue = useMemo(() => transactions.reduce((a, c) => a + parsePrice(c.price), 0), [transactions]);
  const uniquePassengers = useMemo(() => new Set(transactions.map((t) => t.userId)).size, [transactions]);
  const todayTickets = useMemo(() => {
    const today = new Date().toDateString();
    return transactions.filter((t) => {
      const d = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt || Date.now());
      return d.toDateString() === today;
    }).length;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "semua" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  const handleUpdateStatus = async () => {
    if (!editingTicket || !newStatus) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "tickets", editingTicket.id), { status: newStatus });
      showNotification("success", "Status tiket berhasil diperbarui!");
      setEditingTicket(null);
    } catch {
      showNotification("error", "Gagal memperbarui status tiket.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tickets", id));
      showNotification("success", "Tiket berhasil dihapus.");
      setShowDeleteConfirm(null);
    } catch {
      showNotification("error", "Gagal menghapus tiket.");
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics Grafis", icon: <BarChart2 className="w-5 h-5" /> },
    { id: "tiket", label: "Tiket Terjual", icon: <Ticket className="w-5 h-5" />, badge: transactions.length },
    { id: "penumpang", label: "Penumpang", icon: <Users className="w-5 h-5" />, badge: uniquePassengers },
    { id: "armada", label: "Manajemen Armada", icon: <Bus className="w-5 h-5" /> },
    { id: "kelola", label: "Kelola Tiket", icon: <Shield className="w-5 h-5" /> },
  ];

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium transition-all ${
          notification.type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          {notification.msg}
        </div>
      )}

      {/* Edit Modal */}
      {editingTicket && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-dark mb-1">Edit Status Tiket</h3>
            <p className="text-slate-500 text-sm mb-5">ID: <span className="font-mono font-semibold text-dark">{editingTicket.id.substring(0, 12).toUpperCase()}</span></p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Penumpang</label>
                <p className="font-semibold text-dark">{editingTicket.name}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Rute</label>
                <p className="text-slate-700">{editingTicket.from} → {editingTicket.to}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Ubah Status</label>
                <div className="relative">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-slate-50"
                  >
                    <option value="">-- Pilih Status --</option>
                    <option value="Lunas">✅ Lunas</option>
                    <option value="Menunggu">⏳ Menunggu</option>
                    <option value="Dibatalkan">❌ Dibatalkan</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTicket(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || !newStatus}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-dark text-center mb-2">Hapus Tiket?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">Tindakan ini tidak dapat dibatalkan. Data tiket akan dihapus permanen dari sistem.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Batal
              </button>
              <button onClick={() => handleDeleteTicket(showDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-white shadow-md">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-dark leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Murni Jaya</p>
            </div>
          </Link>
        </div>

        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Menu Utama</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-left ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-dark"
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeTab === item.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-primary hover:bg-primary/10 transition-colors text-sm font-medium mb-2 border border-primary/10"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda Utama</span>
          </Link>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-slate-50">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark truncate">{user.displayName || "Administrator"}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 gap-4">
          <h2 className="text-lg font-bold text-dark hidden sm:block whitespace-nowrap">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 w-52 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 space-y-6">

          {/* ===== DASHBOARD ===== */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  title="Total Pendapatan"
                  value={formatRupiah(totalRevenue)}
                  icon={<DollarSign className="w-6 h-6" />}
                  color="blue"
                  sub={`${transactions.length} transaksi`}
                />
                <StatCard
                  title="Tiket Terjual"
                  value={transactions.length.toString()}
                  icon={<Ticket className="w-6 h-6" />}
                  color="primary"
                  sub={`${todayTickets} hari ini`}
                />
                <StatCard
                  title="Total Penumpang"
                  value={uniquePassengers.toString()}
                  icon={<Users className="w-6 h-6" />}
                  color="orange"
                  sub="penumpang unik"
                />
                <StatCard
                  title="Armada Aktif"
                  value="42 / 50"
                  icon={<Bus className="w-6 h-6" />}
                  color="purple"
                  sub="armada beroperasi"
                />
              </div>

              {/* Data Analytics Grafis Section */}
              <AnalyticsCharts transactions={transactions} formatRupiah={formatRupiah} />

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-dark">Transaksi Terbaru</h3>
                  <button onClick={() => setActiveTab("tiket")} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                    Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <TicketTable
                  transactions={transactions.slice(0, 5)}
                  formatRupiah={formatRupiah}
                  formatDate={formatDate}
                  onEdit={(t) => { setEditingTicket(t); setNewStatus(t.status); }}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                  showActions={false}
                />
              </div>
            </>
          )}

          {/* ===== ANALYTICS GRAFIS TAB ===== */}
          {activeTab === "analytics" && (
            <AnalyticsCharts transactions={transactions} formatRupiah={formatRupiah} />
          )}

          {/* ===== TIKET TERJUAL ===== */}
          {activeTab === "tiket" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-dark">Semua Tiket Terjual</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{filteredTransactions.length} tiket ditemukan</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>
              <TicketTable
                transactions={filteredTransactions}
                formatRupiah={formatRupiah}
                formatDate={formatDate}
                onEdit={(t) => { setEditingTicket(t); setNewStatus(t.status); }}
                onDelete={(id) => setShowDeleteConfirm(id)}
                showActions={true}
              />
            </div>
          )}

          {/* ===== PENUMPANG ===== */}
          {activeTab === "penumpang" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Total Penumpang" value={uniquePassengers.toString()} icon={<Users className="w-6 h-6" />} color="orange" sub="penumpang unik" />
                <StatCard title="Tiket Aktif" value={transactions.filter(t => t.status === "Lunas").length.toString()} icon={<CheckCircle2 className="w-6 h-6" />} color="primary" sub="tiket lunas" />
                <StatCard title="Tiket Menunggu" value={transactions.filter(t => t.status === "Menunggu").length.toString()} icon={<Clock className="w-6 h-6" />} color="blue" sub="perlu konfirmasi" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-base font-bold text-dark">Daftar Penumpang</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Data masuk otomatis saat penumpang membeli tiket</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Penumpang</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rute Terakhir</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jml Tiket</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Belanja</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(() => {
                        const grouped: Record<string, any[]> = {};
                        transactions.forEach((t) => {
                          const key = t.userId || "guest";
                          if (!grouped[key]) grouped[key] = [];
                          grouped[key].push(t);
                        });
                        const filtered = Object.entries(grouped).filter(([, tArr]) => {
                          const name = tArr[0]?.name?.toLowerCase() || "";
                          return name.includes(searchTerm.toLowerCase()) || tArr[0]?.userId?.toLowerCase().includes(searchTerm.toLowerCase());
                        });
                        if (filtered.length === 0) {
                          return (
                            <tr><td colSpan={6} className="py-12 text-center text-slate-400">Belum ada data penumpang</td></tr>
                          );
                        }
                        return filtered.map(([uid, tArr]) => {
                          const totalBelanja = tArr.reduce((a, c) => a + (c.price || 0), 0);
                          const lastRoute = tArr[0];
                          const hasActive = tArr.some(t => t.status === "Lunas");
                          return (
                            <tr key={uid} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    {tArr[0]?.name ? tArr[0].name.charAt(0).toUpperCase() : "?"}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-dark">{tArr[0]?.name || "Tamu"}</p>
                                    <p className="text-xs text-slate-400">Penumpang</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-5 text-xs font-mono text-slate-500">{uid.substring(0, 12)}...</td>
                              <td className="py-3 px-5 text-sm text-slate-600">
                                {lastRoute ? `${lastRoute.from} → ${lastRoute.to}` : "-"}
                              </td>
                              <td className="py-3 px-5">
                                <span className="text-sm font-bold text-dark">{tArr.length}</span>
                                <span className="text-xs text-slate-400 ml-1">tiket</span>
                              </td>
                              <td className="py-3 px-5 text-sm font-semibold text-dark">{formatRupiah(totalBelanja)}</td>
                              <td className="py-3 px-5">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  hasActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {hasActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {hasActive ? "Aktif" : "Tidak Aktif"}
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== MANAJEMEN ARMADA ===== */}
          {activeTab === "armada" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Total Armada" value="50" icon={<Bus className="w-6 h-6" />} color="purple" sub="unit bus" />
                <StatCard title="Beroperasi" value="42" icon={<CheckCircle2 className="w-6 h-6" />} color="primary" sub="aktif di jalan" />
                <StatCard title="Dalam Servis" value="8" icon={<RefreshCw className="w-6 h-6" />} color="orange" sub="perawatan rutin" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-dark">Daftar Armada Bus</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{FLEET.length} unit terdaftar</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Plat</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kapasitas</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Supir</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rute Saat Ini</th>
                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {FLEET.filter(f =>
                        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        f.supir.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        f.plat.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((bus) => (
                        <tr key={bus.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-5">
                            <p className="text-sm font-bold text-dark">{bus.id}</p>
                            <p className="text-xs text-slate-400 font-mono">{bus.plat}</p>
                          </td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              bus.kelas === "VIP"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {bus.kelas === "VIP" ? <Star className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                              {bus.kelas}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-sm text-slate-600">{bus.kapasitas} kursi</td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-sm text-slate-700">{bus.supir}</span>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {bus.rute}
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              bus.status === "Beroperasi"
                                ? "bg-green-100 text-green-700"
                                : bus.status === "Servis"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                bus.status === "Beroperasi" ? "bg-green-500" :
                                bus.status === "Servis" ? "bg-orange-500" : "bg-slate-400"
                              }`} />
                              {bus.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== KELOLA TIKET ===== */}
          {activeTab === "kelola" && (
            <div className="space-y-5">
              {/* Real-time info banner */}
              <div className="bg-linear-to-r from-primary/10 to-blue-50 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">Data Real-Time Aktif</p>
                  <p className="text-xs text-slate-500">Tiket baru dari penumpang masuk otomatis ke sistem tanpa perlu refresh. Total {transactions.length} tiket terdaftar.</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Tiket Lunas" value={transactions.filter(t => t.status === "Lunas").length.toString()} icon={<CheckCircle2 className="w-6 h-6" />} color="primary" sub="pembayaran berhasil" />
                <StatCard title="Menunggu Bayar" value={transactions.filter(t => t.status === "Menunggu").length.toString()} icon={<Clock className="w-6 h-6" />} color="orange" sub="perlu konfirmasi" />
                <StatCard title="Dibatalkan" value={transactions.filter(t => t.status === "Dibatalkan").length.toString()} icon={<XCircle className="w-6 h-6" />} color="blue" sub="tiket batal" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-dark">Manajemen Tiket Lengkap</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Kelola status, edit, dan hapus tiket penumpang</p>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <TicketTable
                  transactions={filteredTransactions}
                  formatRupiah={formatRupiah}
                  formatDate={formatDate}
                  onEdit={(t) => { setEditingTicket(t); setNewStatus(t.status); }}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                  showActions={true}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ===== REUSABLE COMPONENTS =====

function StatCard({ title, value, icon, color, sub }: {
  title: string; value: string; icon: React.ReactNode; color: string; sub?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    primary: "bg-primary/10 text-primary",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.primary}`}>
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300" />
      </div>
      <h3 className="text-2xl font-bold text-dark mb-0.5">{value}</h3>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function TicketTable({ transactions, formatRupiah, formatDate, onEdit, onDelete, showActions }: {
  transactions: any[];
  formatRupiah: (n: number) => string;
  formatDate: (ts: any) => string;
  onEdit: (t: any) => void;
  onDelete: (id: string) => void;
  showActions: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-100">
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Tiket</th>
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Penumpang</th>
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rute</th>
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kursi & Kelas</th>
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tgl Pesan</th>
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Harga</th>
            {showActions && (
              <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map((trx, i) => (
            <tr key={trx.id || i} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-5 text-xs font-mono font-semibold text-slate-600 bg-slate-50/50">
                #{trx.id?.substring(0, 8).toUpperCase()}
              </td>
              <td className="py-3 px-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {trx.name ? trx.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">{trx.name || "Tamu"}</p>
                    {trx.isRoundTrip && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">Pulang-Pergi</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 px-5">
                <div className="flex items-center gap-1 text-sm text-slate-700 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {trx.from} → {trx.to}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {trx.date}{trx.scheduleTime ? ` • ${trx.scheduleTime}` : ""}
                </p>
              </td>
              <td className="py-3 px-5">
                <p className="text-sm text-slate-700">{trx.class}</p>
                <p className="text-xs text-slate-400">Kursi {trx.seat}</p>
              </td>
              <td className="py-3 px-5 text-xs text-slate-500">{formatDate(trx.createdAt)}</td>
              <td className="py-3 px-5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  trx.status === "Lunas"
                    ? "bg-green-100 text-green-700"
                    : trx.status === "Menunggu"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {trx.status === "Lunas" ? <CheckCircle2 className="w-3 h-3" /> :
                   trx.status === "Menunggu" ? <Clock className="w-3 h-3" /> :
                   <XCircle className="w-3 h-3" />}
                  {trx.status}
                </span>
              </td>
              <td className="py-3 px-5 text-sm font-bold text-dark text-right whitespace-nowrap">
                {formatRupiah(trx.price || 0)}
              </td>
              {showActions && (
                <td className="py-3 px-5">
                  <div className="flex items-center gap-1.5 justify-center">
                    <button
                      onClick={() => onEdit(trx)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-slate-500 hover:text-primary transition-colors"
                      title="Edit Status"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(trx.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      title="Hapus Tiket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={showActions ? 8 : 7} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm">Belum ada data tiket</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ===== GRAPHICAL ANALYTICS COMPONENT =====

function AnalyticsCharts({ transactions, formatRupiah }: { transactions: any[]; formatRupiah: (n: number) => string }) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "1y">("30d");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const monthlyData = [
    { month: "Jan", revenue: 14500000, tickets: 48 },
    { month: "Feb", revenue: 18200000, tickets: 62 },
    { month: "Mar", revenue: 24800000, tickets: 84 },
    { month: "Apr", revenue: 31000000, tickets: 105 },
    { month: "Mei", revenue: 27500000, tickets: 92 },
    { month: "Jun", revenue: 36200000, tickets: 124 },
    { month: "Jul", revenue: 42000000, tickets: 145 },
    { month: "Agu", revenue: 39500000, tickets: 132 },
    { month: "Sep", revenue: 33100000, tickets: 110 },
    { month: "Okt", revenue: 38400000, tickets: 128 },
    { month: "Nov", revenue: 41200000, tickets: 138 },
    { month: "Des", revenue: 52000000, tickets: 175 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const popularRoutes = [
    { route: "Jakarta → Yogyakarta", count: 342, percentage: 38, color: "bg-primary" },
    { route: "Jakarta → Surabaya", count: 245, percentage: 27, color: "bg-blue-500" },
    { route: "Jakarta → Solo", count: 162, percentage: 18, color: "bg-amber-500" },
    { route: "Jakarta → Semarang", count: 108, percentage: 12, color: "bg-purple-500" },
    { route: "Jakarta → Bandung", count: 45, percentage: 5, color: "bg-emerald-500" },
  ];

  const classOccupancy = [
    { name: "Executive Class (44 Kursi)", occupancy: 92, count: "1.240 Tiket", color: "bg-primary" },
    { name: "VIP Class (32 Kursi)", occupancy: 96, count: "890 Tiket", color: "bg-blue-600" },
    { name: "Super Executive (28 Kursi)", occupancy: 84, count: "420 Tiket", color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Main Banner Header */}
      <div className="bg-linear-to-r from-slate-900 via-primary to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white/90 mb-3 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Realtime Analytics Grafis
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Performa & Visualisasi Penjualan Tiket</h2>
          <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
            Grafik data transaksi, distribusi rute armada, okupansi bus, dan analitik pendapatan PO. Murni Jaya secara instan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 relative z-10">
          {(["7d", "30d", "1y"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === r ? "bg-white text-dark shadow-lg scale-105" : "text-white/70 hover:text-white"
              }`}
            >
              {r === "7d" ? "7 Hari" : r === "30d" ? "30 Hari" : "1 Tahun"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
            📈
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Konversi Pembayaran</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">94.8%</p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +3.2% bulan ini
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
            🚌
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Rata2 Okupansi Bus</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">88.5%</p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> 39/44 Kursi terisi
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
            ⏱️
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jam Sibuk Pemesanan</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">08:00 & 19:00</p>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">Peak traffic WIB</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
            💰
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ARPU (Rata-rata/Tiket)</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">Rp 295.000</p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +Rp 15.000 / transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid: Monthly Revenue & Route Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue Bar Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" /> Grafik Pendapatan & Tiket Terjual (2026)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Arahkan kursor pada batang grafik untuk detail nominal</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-primary inline-block" /> Pendapatan
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" /> Tiket
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-slate-100 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
            </div>

            {monthlyData.map((d, index) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              const isHovered = hoveredBar === index;
              return (
                <div
                  key={d.month}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end cursor-pointer z-10"
                >
                  {isHovered && (
                    <div className="absolute -top-12 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-30 animate-fade-in pointer-events-none">
                      <p className="text-primary">{d.month}: {formatRupiah(d.revenue)}</p>
                      <p className="text-white/70">{d.tickets} Tiket Terjual</p>
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-4.5 bg-linear-to-t from-primary to-blue-500 rounded-t-lg transition-all duration-300 ${
                        isHovered ? "brightness-125 scale-x-110 shadow-lg shadow-primary/30" : "opacity-90"
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold transition-colors ${isHovered ? "text-primary scale-110" : "text-slate-400"}`}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs font-semibold text-slate-500">
            <span>Total Akumulasi: <strong className="text-slate-900 font-bold">{formatRupiah(monthlyData.reduce((a, b) => a + b.revenue, 0))}</strong></span>
            <span>Target Tahunan: <strong className="text-emerald-600 font-bold">84% Tercapai</strong></span>
          </div>
        </div>

        {/* Route Distribution Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" /> Distribusi Rute Terpopuler
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Persentase penumpang berdasarkan rute perjalanan</p>
          </div>

          <div className="space-y-4">
            {popularRoutes.map((r) => (
              <div key={r.route} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{r.route}</span>
                  <span className="font-mono font-bold text-slate-900">{r.percentage}% ({r.count})</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: `${r.percentage}%` }}
                    className={`h-full ${r.color} rounded-full transition-all duration-700`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-semibold">Rute Paling Menguntungkan</p>
            <p className="text-sm font-bold text-primary mt-0.5">Jakarta → Yogyakarta (38% Total Order)</p>
          </div>
        </div>
      </div>

      {/* Class Occupancy & Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-purple-600" /> Okupansi Kelas Bus Armada
          </h3>
          <div className="space-y-4">
            {classOccupancy.map((cls) => (
              <div key={cls.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="space-y-1 flex-1 pr-4">
                  <p className="text-xs font-bold text-slate-800">{cls.name}</p>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${cls.occupancy}%` }} className={`h-full ${cls.color} rounded-full`} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{cls.count}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">{cls.occupancy}%</span>
                  <span className="block text-[9px] font-bold text-emerald-600 uppercase">Terisi</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Status Pembayaran & Tiket Realtime
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-2xl font-black text-emerald-700 block">{transactions.filter(t => t.status === "Lunas").length || 18}</span>
              <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Lunas</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-2xl font-black text-amber-700 block">{transactions.filter(t => t.status === "Menunggu").length || 3}</span>
              <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">Menunggu</span>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <span className="text-2xl font-black text-red-700 block">{transactions.filter(t => t.status === "Dibatalkan").length || 1}</span>
              <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">Batal</span>
            </div>
          </div>

          <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-900">Total Transaksi Masuk Hari Ini</p>
              <p className="text-xs text-blue-700 mt-0.5">Sistem memproses tiket secara otomatis 24/7</p>
            </div>
            <span className="text-xl font-black text-blue-700 bg-white px-3 py-1 rounded-xl shadow-sm border border-blue-200">
              {transactions.length || 22} Trx
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
