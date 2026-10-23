import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeatPicker from "@/components/SeatPicker";
import { Calendar, MapPin, Clock, CreditCard, ChevronRight, Bus, CheckCircle2, Tag, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const schedules = [
  { time: "07:00", arrival: "16:00", class: "Executive", price: 250000 },
  { time: "09:00", arrival: "18:00", class: "VIP", price: 300000 },
  { time: "13:00", arrival: "22:00", class: "Executive", price: 250000 },
  { time: "18:00", arrival: "04:00 ", class: "Executive", price: 270000 },
  { time: "20:00", arrival: "06:00 ", class: "VIP", price: 350000 },
  { time: "22:00", arrival: "08:00 ", class: "Executive", price: 290000 },
  { time: "23:00", arrival: "10:00 ", class: "VIP", price: 300000 },
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState("Jakarta");
  const [to, setTo] = useState("Yogyakarta");
  const [date, setDate] = useState("2026-03-20");
  const [returnDate, setReturnDate] = useState("2026-03-25");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedClassOverride, setSelectedClassOverride] = useState<string>("");
  
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const navigate = useNavigate();
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const cities = ["Jakarta", "Yogyakarta", "Bandung", "Surabaya", "Semarang", "Solo", "Malang", "Purworejo", "Purwokerto", "Kebumen", "Cilacap", "Purbalingga", "Banjarnegara"];

  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    if (selectedSchedule === null || !selectedSeat) return;
    setIsBooking(true);
    
    try {
      const c = selectedClassOverride || schedules[selectedSchedule].class;
      const finalPrice = schedules[selectedSchedule].price - discount;
      const formattedPrice = `Rp ${finalPrice.toLocaleString('id-ID')}`;
      const randomTicketId = Math.random().toString(36).substr(2, 9);
      const displayDate = new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      
      const newTicketObj = {
        id: randomTicketId,
        userId: auth.currentUser?.uid || "guest",
        name: auth.currentUser?.displayName || "Tamu",
        from,
        to,
        route: `${from} → ${to}`,
        date: displayDate || date,
        returnDate: isRoundTrip ? returnDate : null,
        isRoundTrip,
        scheduleTime: schedules[selectedSchedule].time,
        scheduleArrival: schedules[selectedSchedule].arrival,
        class: c,
        price: finalPrice,
        formattedPrice,
        seat: selectedSeat,
        bank: selectedBank,
        status: "Lunas",
        createdAt: new Date().toISOString(),
      };

      // 1. Instantly sync with user_history in localStorage
      try {
        const savedHistory = localStorage.getItem("user_history");
        const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
        localStorage.setItem("user_history", JSON.stringify([newTicketObj, ...currentHistory]));
      } catch (e) {
        console.error("Localstorage history update error:", e);
      }

      // 2. Instantly push notification to passenger dashboard
      try {
        const savedNotifs = localStorage.getItem("passenger_notifications");
        const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
        const bookingNotif = {
          id: `notif-${Date.now()}`,
          title: "Pembayaran Berhasil!",
          message: `Tiket ${from} → ${to} (Kursi ${selectedSeat}) lunas & terkonfirmasi.`,
          time: "Baru saja",
          read: false,
          type: "ticket"
        };
        localStorage.setItem("passenger_notifications", JSON.stringify([bookingNotif, ...currentNotifs]));
      } catch (e) {
        console.error("Localstorage notif update error:", e);
      }

      // 3. Fire Firestore save reliably
      try {
        const firestoreTask = addDoc(collection(db, "tickets"), {
          ...newTicketObj,
          price: finalPrice,
          status: "Lunas",
          createdAt: serverTimestamp(),
        });
        const timeoutTask = new Promise((resolve) => setTimeout(resolve, 1500));
        await Promise.race([firestoreTask, timeoutTask]);
      } catch (e) {
        console.error("Firestore save error:", e);
      }

      setStep(4);
    } catch (error) {
      console.error("Error saving ticket: ", error);
      setStep(4);
    } finally {
      setIsBooking(false);
    }
  };

  const applyVoucher = () => {
    if (voucher.toUpperCase() === "MJ2026") {
      setDiscount(50000);
      setVoucherError("");
    } else {
      setVoucherError("Kode voucher tidak valid");
      setDiscount(0);
    }
  };

  const banks = [
    { id: "bca", name: "BCA Virtual Account", icon: "BCA" },
    { id: "mandiri", name: "Mandiri Virtual Account", icon: "MDR" },
    { id: "bni", name: "BNI Virtual Account", icon: "BNI" },
    { id: "bri", name: "BRI Virtual Account", icon: "BRI" },
    { id: "cimb", name: "CIMB Virtual Account", icon: "CIMB" },
  ]; 

  const total = selectedSchedule !== null ? schedules[selectedSchedule].price : 0;
  const finalPrice = total - discount;
   

  return (
    <main className="min-h-screen bg-light">
      <Header />
      
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-dark/10">|</span>
            <button 
              onClick={() => {
                if (step > 1) {
                  setStep(1);
                } else {
                  navigate(-1);
                }
              }} 
              className="p-2 bg-white rounded-xl text-dark/60 hover:text-primary hover:bg-primary/5 border border-dark/5 shadow-sm transition-all flex items-center justify-center group"
              title="Kembali ke Jadwal Tiket"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center max-w-3xl mx-auto mb-16 relative">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8 bg-white/50 backdrop-blur-sm p-6 rounded-4xl border border-white shadow-xl shadow-dark/5">
              {[1, 2, 3, 4].map((s, idx) => (
                <div key={s} className="flex items-center group">
                  <div className="flex flex-col items-center gap-2 relative">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 relative z-10 ${
                        step >= s ? "bg-primary text-white scale-110 shadow-xl shadow-primary/20" : "bg-white text-dark/30 border-2 border-dark/5 shadow-sm"
                      } ${step === s ? "ring-4 ring-primary/20" : ""}`}
                    >
                      {step > s ? <CheckCircle2 size={24} /> : s}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                      step === s ? "text-primary" : step > s ? "text-dark/60" : "text-dark/20"
                    }`}>
                    { s === 1 ? "Jadwal"  :  s === 2 ?  "Kursi"  : s === 3 ? "Pembayaran" : s === 4 ? "Selesai" : ""}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className="flex items-center px-1 sm:px-2 md:px-4 -mt-6">
                      <ArrowRight 
                        size={18} 
                        className={`transition-all duration-700 ${step > idx + 1 ? "text-primary translate-x-1" : "text-dark/10"}`} 
                        strokeWidth={4}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-dark/5">
                    <div className="flex bg-light p-2 rounded-2xl mb-8">
                      <button 
                        onClick={() => setIsRoundTrip(false)}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!isRoundTrip ? "bg-white text-primary shadow-sm" : "text-dark/40 hover:text-dark"}`}
                      >
                        Sekali Jalan
                      </button>
                      <button 
                        onClick={() => setIsRoundTrip(true)}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${isRoundTrip ? "bg-white text-primary shadow-sm" : "text-dark/40 hover:text-dark"}`}
                      >
                        Pergi Pulang
                      </button>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-dark mb-8">Detail Perjalanan</h2>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-2">Dari</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                          <div 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light font-medium text-dark outline-none cursor-pointer flex justify-between items-center select-none"
                            onClick={() => { setIsFromOpen(!isFromOpen); setIsToOpen(false); }}
                          >
                            <span>{from}</span>
                            <ChevronRight className={`transition-transform duration-300 text-dark/40 ${isFromOpen ? "rotate-90" : ""}`} size={16} />
                          </div>
                          
                          <AnimatePresence>
                            {isFromOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -10 }} 
                                className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-dark/5 overflow-hidden"
                              >
                                <div className="max-h-48 overflow-y-auto p-2">
                                  {cities.map(city => (
                                    <div 
                                      key={city} 
                                      className={`px-4 py-3 rounded-xl cursor-pointer transition-colors ${from === city ? "bg-primary text-white font-bold" : "hover:bg-primary/5 text-dark"}`}
                                      onClick={() => { setFrom(city); setIsFromOpen(false); }}
                                    >
                                      {city}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-2">Ke</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                          <div 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light font-medium text-dark outline-none cursor-pointer flex justify-between items-center select-none"
                            onClick={() => { setIsToOpen(!isToOpen); setIsFromOpen(false); }}
                          >
                            <span>{to}</span>
                            <ChevronRight className={`transition-transform duration-300 text-dark/40 ${isToOpen ? "rotate-90" : ""}`} size={16} />
                          </div>
                          
                          <AnimatePresence>
                            {isToOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -10 }} 
                                className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-dark/5 overflow-hidden"
                              >
                                <div className="max-h-48 overflow-y-auto p-2">
                                  {cities.map(city => (
                                    <div 
                                      key={city} 
                                      className={`px-4 py-3 rounded-xl cursor-pointer transition-colors ${to === city ? "bg-secondary text-white font-bold" : "hover:bg-secondary/5 text-dark"}`}
                                      onClick={() => { setTo(city); setIsToOpen(false); }}
                                    >
                                      {city}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-2">Tanggal Berangkat</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                          <input type="date" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light border-none font-medium text-dark focus:ring-2 focus:ring-primary outline-none" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isRoundTrip && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest pl-2">Tanggal Pulang</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                              <input type="date" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light border-none font-medium text-dark focus:ring-2 focus:ring-primary outline-none" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <h2 className="text-2xl font-display font-bold text-dark mb-8">Jadwal Tersedia</h2>
                  {schedules.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSchedule(idx)}
                      className={`w-full text-left p-8 rounded-4xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                        selectedSchedule === idx 
                          ? "bg-white border-primary shadow-xl ring-2 ring-primary/10" 
                          : "bg-white/40 border-dark/5 hover:bg-white hover:border-primary/20"
                      }`}
                    >
                      {/* Suble background accent */}
                      <div className={`absolute inset-0 opacity-[0.03] transition-colors pointer-events-none ${
                        selectedSchedule === idx ? "bg-primary" : "bg-dark group-hover:bg-primary"
                      }`} />

                      <div className="flex items-center gap-12 relative z-10">
                        <div className="flex flex-col">
                          <span className="text-3xl font-display font-bold text-dark">{item.time}</span>
                          <span className="text-[10px] font-bold text-dark/30 uppercase tracking-widest leading-none mt-1">{from}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <ChevronRight className={`transition-colors ${selectedSchedule === idx ? "text-primary" : "text-primary/30 group-hover:text-primary"}`} size={24} />
                          <span className="text-[10px] font-bold text-dark/20 uppercase tracking-[0.2em] mt-1">9j 0m</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-3xl font-display font-bold text-dark">{item.arrival}</span>
                          <span className="text-[10px] font-bold text-dark/30 uppercase tracking-widest leading-none mt-1">{to}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-10 relative z-10">
                        {/* Dashed Separator */}
                        <div className="h-16 w-px border-l-2 border-dashed border-dark/10 mr-2" />
                        
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.class === "Executive" ? "bg-primary text-white" : "bg-secondary text-white"
                          }`}>
                            {item.class === "Executive" ? "Eksekutif" : item.class}
                          </span>
                          <p className="text-xl font-bold text-dark mt-2 tracking-tighter">Rp {item.price.toLocaleString()}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                          selectedSchedule === idx 
                            ? "bg-primary text-white scale-110 shadow-primary/20" 
                            : "bg-white text-dark/20 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}>
                          {selectedSchedule === idx ? <CheckCircle2 size={24} /> : <Bus size={22} />}
                        </div>
                      </div>
                    </button>
                  ))}
                  {selectedSchedule !== null && (
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-6 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      Lanjutkan ke Pemilihan Kursi
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-8">
                  <h2 className="text-2xl font-display font-bold text-dark mb-8">Pilih Kursi Anda</h2>
                  <SeatPicker 
                    onSelect={setSelectedSeat} 
                    selectedSeat={selectedSeat} 
                    busClass={selectedClassOverride || (selectedSchedule !== null ? schedules[selectedSchedule].class : "Standar")} 
                    onChangeClass={setSelectedClassOverride}
                  />
                </div>
                <div className="lg:col-span-4">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-dark/5 sticky top-32">
                    <h3 className="text-xl font-display font-bold text-dark mb-6">Ringkasan Pemesanan</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-dark/40 font-medium uppercase tracking-widest text-[10px]">Rute</span>
                        <span className="text-dark font-bold">{from} → {to}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark/40 font-medium uppercase tracking-widest text-[10px]">Kelas</span>
                        <span className="text-dark font-bold">
                          {(() => {
                            const c = selectedClassOverride || (selectedSchedule !== null ? schedules[selectedSchedule].class : "Standar");
                            return c === "Executive" ? "Eksekutif" : c;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark/40 font-medium uppercase tracking-widest text-[10px]">Kursi</span>
                        <span className="text-primary font-bold">{selectedSeat || "Belum dipilih"}</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-dark/5 flex justify-between items-center mb-8">
                      <span className="text-lg font-bold text-dark">Total</span>
                      <div className="text-right">
                        {discount > 0 && (
                          <p className="text-sm text-dark/40 line-through">Rp {schedules[selectedSchedule!].price.toLocaleString()}</p>
                        )}
                        <span className="text-2xl font-display font-bold text-secondary">
                          Rp {(schedules[selectedSchedule!].price - discount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-4 bg-light text-dark font-bold rounded-xl text-sm transition-all hover:bg-dark/5">Kembali</button>
                      <button 
                        disabled={!selectedSeat}
                        onClick={() => setStep(3)} 
                        className="flex-2 py-4 bg-primary text-white font-bold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary/20"
                      >
                        Lanjutkan ke Pembayaran
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-7">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-dark/5">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <CreditCard size={24} />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-dark">Metode Pembayaran</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {banks.map((bank) => (
                        <button 
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between ${
                            selectedBank === bank.id ? "bg-primary/5 border-primary shadow-md" : "bg-light border-dark/5 hover:bg-white hover:border-primary/20"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">{bank.icon}</div>
                            <span className="font-bold text-dark">{bank.name}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedBank === bank.id ? "border-primary bg-primary" : "border-dark/10"}`}>
                            {selectedBank === bank.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-12 pt-10 border-t border-dark/5">
                      <div className="flex items-center gap-4 mb-6">
                        <Tag size={20} className="text-secondary" />
                        <h3 className="text-lg font-bold text-dark">Punya Kode Voucher?</h3>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            className="w-full px-6 py-4 rounded-xl bg-light border-none focus:ring-2 focus:ring-secondary/20 outline-none font-bold uppercase tracking-widest text-sm text-dark placeholder:text-dark/40"
                            placeholder="KODE VOUCHER"
                            value={voucher}
                            onChange={(e) => setVoucher(e.target.value)}
                          />
                          {voucherError && <p className="text-[10px] text-secondary font-bold mt-2 ml-2 uppercase tracking-wider">{voucherError}</p>}
                          {discount > 0 && <p className="text-[10px] text-green-500 font-bold mt-2 ml-2 uppercase tracking-wider">Voucher Berhasil Digunakan!</p>}
                        </div>
                        <button 
                          onClick={applyVoucher}
                          className="px-8 py-4 bg-dark text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          Pakai
                        </button>
                      </div> 
                      <p className="text-[10px] text-dark/30 mt-3 ml-2 font-medium">Gunakan kode <span className="font-bold text-primary italic">MJ2026</span> untuk diskon Rp 50.000</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-dark text-white p-10 rounded-[2.5rem] shadow-2xl border border-white/5 sticky top-32">
                    <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
                      <div className="w-8 h-1 bg-primary rounded-full" /> Konfirmasi Pembayaran
                    </h3>
                    
                    <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <div>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Total Tiket</p>
                          <p className="text-lg font-bold">Rp {selectedSchedule !== null ? schedules[selectedSchedule].price.toLocaleString() : 0}</p>
                        </div>
                        {discount > 0 && (
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1">Diskon Voucher</p>
                            <p className="text-lg font-bold text-secondary">- Rp {discount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-display font-bold">Total Bayar</span>
                        <span className="text-3xl font-display font-bold text-primary">
                          Rp {selectedSchedule !== null ? (schedules[selectedSchedule].price - discount).toLocaleString() : 0}
                        </span>
                      </div>
                    </div>

                    <button 
                      disabled={!selectedBank || isBooking}
                      onClick={handleBooking}
                      className="w-full py-6 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-20 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                    >
                      {isBooking ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Memproses...
                        </>
                      ) : (
                        <>
                          Konfirmasi & Bayar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-white/20 mt-6 uppercase tracking-widest font-bold">Klik bayar untuk memproses pesanan Anda</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto text-center"
              >
                <style>{`
                  @media print {
                    @page {
                      size: A4 portrait;
                      margin: 0;
                    }
                    html, body {
                      height: 100%;
                      margin: 0 !important;
                      padding: 0 !important;
                      overflow: hidden !important;
                      background: white !important;
                    }
                    nav, footer, .no-print, header, nav * {
                      display: none !important;
                    }
                    main {
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    #printable-ticket-wrapper {
                      position: fixed;
                      inset: 0;
                      display: flex;
                      align-items: center;
                      justify-center: center;
                      padding: 20px;
                      background: white !important;
                      z-index: 9999;
                    }
                    #printable-ticket {
                      width: 100% !important;
                      max-width: 500px !important;
                      margin: 0 auto !important;
                      box-shadow: none !important;
                      border: 2 border-primary !important;
                      page-break-inside: avoid !important;
                      break-inside: avoid !important;
                    }
                  }
                `}</style>
                <div className="bg-white p-6 sm:p-10 rounded-[3rem] shadow-2xl border border-dark/5">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-500/20 no-print">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-dark mb-2 no-print">Pemesanan Dikonfirmasi!</h2>
                  <p className="text-dark/60 mb-6 leading-relaxed text-sm no-print">Tiket Anda untuk kursi <span className="text-primary font-bold">{selectedSeat}</span> telah diterbitkan.</p>
                  
                  <div id="printable-ticket-wrapper" className="my-6">
                    <div id="printable-ticket" className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row relative">
                      {/* Left side (Main Info) */}
                      <div className="flex-1 p-6 border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-gray-300 relative bg-linear-to-br from-primary/5 to-transparent text-left">
                        <div className="hidden sm:block absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#f3f4f6] rounded-full border border-gray-200"></div>
                        <div className="hidden sm:block absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-6 h-6 bg-[#f3f4f6] rounded-full border border-gray-200"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1">PO. MURNI JAYA</span>
                            <h3 className="text-xl sm:text-2xl font-black text-dark tracking-tight uppercase">BOARDING PASS</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-dark/40 uppercase tracking-widest block mb-0.5">Kode Booking</span>
                            <span className="text-sm font-mono font-bold text-dark bg-gray-100 px-2 py-1 rounded">MJ-2026-X8892</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-[9px] font-bold text-dark/40 uppercase tracking-widest block mb-0.5">Dari</span>
                            <span className="text-sm font-bold text-dark">{from}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-dark/40 uppercase tracking-widest block mb-0.5">Tujuan</span>
                            <span className="text-sm font-bold text-dark">{to}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                          <div>
                            <span className="text-[9px] font-bold text-dark/40 uppercase tracking-widest block mb-0.5">Tanggal</span>
                            <span className="text-sm font-bold text-dark">{date}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-dark/40 uppercase tracking-widest block mb-0.5">Jam</span>
                            <span className="text-sm font-bold text-dark">{selectedSchedule !== null ? schedules[selectedSchedule].time : "07:00"} WIB</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-dark/40 uppercase tracking-widest block mb-0.5">Kursi</span>
                            <span className="text-lg font-black text-primary">{selectedSeat}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side (Stub) */}
                      <div className="w-full sm:w-48 p-6 flex flex-col items-center justify-center bg-gray-50">
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider mb-3 text-center">E-TIKET</span>
                        <div className="w-24 h-24 bg-white p-1.5 border border-gray-200 rounded-lg shadow-sm">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MJ-2026-X8892`} 
                            alt="QR Code" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <span className="text-[9px] text-dark/40 mt-3 text-center font-medium leading-tight">Pindai saat naik bus</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 no-print mt-6">
                    <button onClick={() => navigate('/profile')} className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all">Selesai & Lihat Tiket Saya</button>
                    <button onClick={() => setStep(1)} className="text-dark/40 hover:text-dark font-bold text-[10px] uppercase tracking-widest transition-colors">Kembali ke Pemesanan Baru</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}
