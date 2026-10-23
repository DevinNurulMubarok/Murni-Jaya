import React, { useState, useRef, useEffect } from "react";
import { Bus, Send, MapPin, Clock, Ticket, XCircle, PhoneCall, CheckCircle2, Smile } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// ---------- Types ----------
interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface QuickReply {
  label: string;
  icon: React.ReactNode;
  query: string;
}

// ---------- Bot logic ----------
function formatTime(): string {
  const d = new Date();
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function getBotReply(message: string): string {
  const t = message.toLowerCase();

  if (t.includes("halo") || t.includes("hai") || t.includes("selamat") || t.includes("pagi") || t.includes("siang") || t.includes("malam")) {
    return "Halo, selamat datang di Layanan Pelanggan PT Murni Jaya! 🚌 Ada yang bisa saya bantu seputar tiket bus hari ini?";
  }
  if (t.includes("harga") || t.includes("tarif") || t.includes("biaya")) {
    return "Harga tiket kami mulai dari Rp85.000 tergantung rute dan kelas bus (Ekonomi, Eksekutif, atau Sleeper). Rute mana yang ingin Anda tanyakan?";
  }
  if (t.includes("jadwal") || t.includes("rute") || t.includes("jam") || t.includes("keberangkatan")) {
    return "Kami melayani banyak rute antar kota dengan keberangkatan pagi, siang, dan malam. Mohon sebutkan kota asal dan tujuan Anda agar saya bisa cek jadwalnya.";
  }
  if (t.includes("pesan") || t.includes("booking") || t.includes("beli") || t.includes("order")) {
    return "Untuk memesan tiket, Anda bisa: 1) pilih rute & tanggal, 2) pilih kursi, 3) lakukan pembayaran via transfer/e-wallet. Setelah lunas, e-tiket akan dikirim ke email/WhatsApp Anda. Mau saya bantu mulai pemesanan?";
  }
  if (t.includes("batal") || t.includes("refund") || t.includes("reschedule") || t.includes("ubah jadwal")) {
    return "Pembatalan tiket bisa dilakukan maksimal 6 jam sebelum keberangkatan dengan potongan 25%. Untuk reschedule, cukup hubungi CS dengan menyertakan kode booking Anda.";
  }
  if (t.includes("bayar") || t.includes("pembayaran") || t.includes("transfer") || t.includes("e-wallet") || t.includes("qris")) {
    return "Pembayaran dapat dilakukan via transfer bank, QRIS, atau e-wallet (OVO, GoPay, Dana). Tiket akan otomatis terkonfirmasi setelah pembayaran berhasil.";
  }
  if (t.includes("alamat") || t.includes("terminal") || t.includes("lokasi")) {
    return "Loket utama PT Murni Jaya berada di Terminal Pulo Gebang, Jakarta. Kami juga memiliki agen tiket di beberapa kota besar lainnya.";
  }
  if (t.includes("terima kasih") || t.includes("makasih") || t.includes("thanks")) {
    return "Sama-sama! Terima kasih telah memilih PT Murni Jaya. Selamat menempuh perjalanan, semoga selamat sampai tujuan! 🙏";
  }
  if (t.includes("cs") || t.includes("admin") || t.includes("hubungi") || t.includes("telepon")) {
    return "Anda bisa menghubungi CS kami di 0821-xxxx-xxxx (08.00–20.00 WIB) atau lanjutkan chat di sini, saya siap membantu.";
  }

  if (t.includes("masalah") || t.includes("keluhan") || t.includes("komplain") || t.includes("proses")) {
    return "Kami mohon maaf atas ketidaknyamanan Anda. Silakan jelaskan masalah atau keluhan Anda secara singkat, dan tim CS kami akan segera menindaklanjuti.";
  }

  if (t.includes("jawa barat") || t.includes("jakarta") || t.includes("jawa tengah") || t.includes("jawa timur")) {
    return "Untuk rute di Jawa Barat, Jakarta, Jawa Tengah, dan Jawa Timur, kami memiliki banyak jadwal keberangkatan setiap hari. Silakan sebutkan kota asal dan tujuan Anda agar saya bisa cek jadwal dan harga tiketnya.";
  }

  return "Maaf, saya belum sepenuhnya memahami pertanyaan Anda. Bisa dijelaskan lebih detail, atau pilih salah satu topik cepat di bawah ini?";
}

// ---------- Quick replies ----------
const QUICK_REPLIES: QuickReply[] = [
  { label: "Jadwal & Rute", icon: <Clock size={14} />, query: "Saya ingin tanya jadwal dan rute bus" },
  { label: "Harga Tiket", icon: <Ticket size={14} />, query: "Berapa harga tiketnya?" },
  { label: "Cara Pesan", icon: <MapPin size={14} />, query: "Bagaimana cara pesan tiket?" },
  { label: "Pembatalan", icon: <XCircle size={14} />, query: "Saya mau batalkan tiket" },
  { label: "Hubungi CS", icon: <PhoneCall size={14} />, query: "Saya ingin hubungi CS" },
  { label: "Terima Kasih", icon: <Smile size={14} />, query: "Terima kasih" },

];

// ---------- Component ----------
export default function MurniJayaCS(): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Halo! Saya asisten virtual PT Murni Jaya 🚌. Tanyakan apa saja seputar jadwal, harga, atau pemesanan tiket bus.",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  function sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 550 + Math.random() * 500;
    window.setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: getBotReply(trimmed),
        time: formatTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />
      <main className="grow pt-28 pb-16 px-4 flex items-center justify-center">
        <div
          style={{
            // @ts-ignore custom properties
            "--navy": "#16324F",
            "--navy-deep": "#0D2038",
            "--amber": "#F2A93B",
            "--amber-deep": "#D98A1F",
            "--cream": "#FBF7EF",
            "--ink": "#1E2532",
            "--muted": "#7C8798",
            "--line": "#D8CCB4",
            "--confirm": "#2F7A5F",
            fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
          } as React.CSSProperties}
          className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl"
         >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
            .mj-font-display { font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; }
            .mj-scroll::-webkit-scrollbar { width: 6px; }
            .mj-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
            .mj-perforation {
              height: 0;
              border-top: 2px dashed var(--line);
              position: relative;
            }
            .mj-perforation::before, .mj-perforation::after {
              content: "";
              position: absolute;
              top: -9px;
              width: 18px;
              height: 18px;
              background: var(--navy-deep);
              border-radius: 999px;
            }
            .mj-perforation::before { left: -9px; }
            .mj-perforation::after { right: -9px; }
            @keyframes mj-bounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
              30% { transform: translateY(-4px); opacity: 1; }
            }
            .mj-dot { animation: mj-bounce 1.1s infinite; }
            .mj-dot:nth-child(2) { animation-delay: 0.15s; }
            .mj-dot:nth-child(3) { animation-delay: 0.3s; }
          `}</style>

          {/* Header: ticket top */}
          <div style={{ background: "linear-gradient(135deg, var(--navy-deep), var(--navy))" }} className="px-5 pt-5 pb-6 relative">
            <div className="flex items-center gap-3">
              <div
                style={{ background: "var(--amber)" }}
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md"
              >
                <Bus size={24} color="#16324F" strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <h1 className="mj-font-display text-white text-base font-bold leading-tight truncate">
                  CS Murni Jaya
                </h1>
                <p style={{ color: "#C9D3E0" }} className="text-xs leading-tight">
                  Layanan Pelanggan · Tiket Bus Antar Kota
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <span style={{ background: "var(--confirm)" }} className="w-2 h-2 rounded-full inline-block" />
                <span style={{ color: "#C9D3E0" }} className="text-[11px]">Online</span>
              </div>
            </div>

            {/* Ticket meta row */}
            <div className="mt-4 flex items-center justify-between text-[11px]" style={{ color: "#9FB0C6" }}>
              <span className="flex items-center gap-1">
                <Ticket size={12} /> Bantuan 24/7 Jam
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} /> Respon Cepat
              </span>
            </div>
          </div>

          {/* Perforated divider (ticket stub effect) */}
          <div style={{ background: "var(--navy-deep)" }} className="px-5">
            <div className="mj-perforation" />
          </div>

          {/* Chat body */}
          <div style={{ background: "var(--cream)" }} className="flex flex-col h-105">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto mj-scroll px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    style={
                      m.sender === "user"
                        ? { background: "var(--amber)", color: "var(--navy-deep)" }
                        : { background: "#fff", color: "var(--ink)", border: "1px solid var(--line)" }
                    }
                    className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug shadow-sm"
                  >
                    <p>{m.text}</p>
                    <span
                      style={{ color: m.sender === "user" ? "#5A4009" : "var(--muted)" }}
                      className="block text-[10px] mt-1 text-right"
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div
                    style={{ background: "#fff", border: "1px solid var(--line)" }}
                    className="px-4 py-3 rounded-2xl flex gap-1 items-center shadow-sm"
                  >
                    <span className="mj-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--muted)" }} />
                    <span className="mj-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--muted)" }} />
                    <span className="mj-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--muted)" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="px-4 pt-1 pb-2 flex gap-2 overflow-x-auto mj-scroll">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.query)}
                  style={{ border: "1px solid var(--line)", color: "var(--navy-deep)", background: "#fff" }}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:brightness-95 transition"
                >
                  {q.icon}
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{ borderTop: "1px solid var(--line)" }} className="flex items-center gap-2 px-3 py-3 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pertanyaan Anda..."
                style={{ color: "var(--ink)" }}
                className="flex-1 text-sm outline-none px-3 py-2 rounded-full bg-(--cream)"
              />
              <button
                type="submit"
                style={{ background: "var(--amber)" }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:brightness-95 transition disabled:opacity-40"
                disabled={!input.trim()}
                aria-label="Kirim pesan"
              >
                <Send size={16} color="#16324F" />
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}