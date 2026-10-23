

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Loader2, Users, ArrowRight, Award, Briefcase, Heart, Shield, X, CheckCircle2, GraduationCap, TrendingUp, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface TeamMember {
  name: { first: string; last: string };
  email: string;
  phone: string;
  picture: { large: string };
  location: { city: string; country: string };
  role: string;
  bio: string;
}

const leadershipTeam = [
  {
    name: "Dr. H. Murni Jaya",
    role: "Founder & Chairman",
    image: "/images/team/founder.png",
    bio: "Visionary leader dengan lebih dari 35 tahun pengalaman dalam industri transportasi Indonesia. Membangun Murni Jaya dari satu bus menjadi armada nasional."
  },
  {
    name: "Hj. Siti Rahma",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Membawa inovasi digital dan standar pelayanan modern ke dalam operasional tradisional perusahaan, memastikan Murni Jaya tetap relevan di era baru."
  },
  {
    name: "Ir. Bambang Wijaya",
    role: "Chief Operating Officer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "Pakar logistik dan manajemen armada yang memastikan setiap rute berjalan efisien dengan standar keselamatan tertinggi bagi seluruh penumpang."
  }
];

const staticIndonesianTeam = [
  {
    name: { first: "Bambang", last: "Hermawan" },
    email: "bambang.h@murnijaya.com",
    phone: "0812-3456-7890",
    picture: { large: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/068d6240de804f9399a91d544f5cb1a7~tplv-o3syd03w52-resize-webp:800:800.webp?dr=15584&t=555f072d&ps=933b5bde&shp=6ce186a1&shcp=e1be8f53&idc=my&from=1826719393" },
    location: { city: "Jakarta", country: "Indonesia" },
    role: "Kapten Senior",
    bio: "Berdedikasi untuk memberikan perjalanan teraman bagi setiap penumpang dengan pengalaman lebih dari 15 tahun di rute lintas Jawa."
  },
  {
    name: { first: "Santi", last: "Aminah" },
    email: "santi.a@murnijaya.com",
    phone: "0812-9876-5432",
    picture: { large: "https://www.hijup.com/magazine/wp-content/uploads/2023/01/8122bab0-blazer-formal-basic-one-set.png" },
    location: { city: "Surabaya", country: "Indonesia" },
    role: "Pramugari Premium",
    bio: "Berkomitmen untuk memberikan layanan bintang lima dan menangani setiap kebutuhan penumpang dengan profesionalisme tertinggi."
  },
  {
    name: { first: "Agus", last: "Santoso" },
    email: "agus.s@murnijaya.com",
    phone: "0813-1111-2222",
    picture: { large: "https://cdn0-production-images-kly.akamaized.net/AknZ8cupQLxrIol65DpwoCDXQK0=/500x667/smart/filters:quality(75):strip_icc()/kly-media-production/medias/5202249/original/057585300_1745894554-ChatGPT_Image_Apr_29__2025__09_26_56_AM.jpg" },
    location: { city: "Semarang", country: "Indonesia" },
    role: "Mekanik Ahli",
    bio: "Ahli dalam pemeliharaan sistem mekanis tingkat lanjut dan teknologi bus modern untuk menjamin keandalan perjalanan."
  },
  {
    name: { first: "Ratna", last: "Sari" },
    email: "ratna.s@murnijaya.com",
    phone: "0813-3333-4444",
    picture: { large: "https://filebroker-cdn.lazada.co.id/kf/Sc354540a3eb0445d98b65bb436b87141O.jpg" },
    location: { city: "Yogyakarta", country: "Indonesia" },
    role: "Customer Service",
    bio: "Siap membantu setiap pertanyaan dan memberikan solusi terbaik bagi pengalaman perjalanan Anda yang tak terlupakan."
  }
];

const cultureImages = [
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    title: "Kantor Pusat",
    desc: "Markas besar Murni Jaya yang modern di jantung kota Jakarta."
  },
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    title: "Ruangan Tempat Kantor",
    desc: "Lingkungan kerja kolaboratif yang didukung teknologi terkini."
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200",
    title: "Pelatihan Kru",
    desc: "Ruang pelatihan modern untuk meningkatkan standar hospitality kru kami."
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    title: "Fasilitas Karyawan",
    desc: "Fasilitas lengkap untuk kenyamanan dan kesejahteraan karyawan."
  }
];

const roles = [
  "Kapten Senior",
  "Supervisor Armada",
  "Keunggulan Pelanggan",
  "Pimpinan Teknis",
  "Koordinator Operasional",
  "Manajer Terminal",
  "Mekanik Ahli",
  "Pramugari Premium",
  "Tim Keamanan Senior",
  "Spesialis Logistik",
  "Manajer Kualitas",
  "Customer Service"
];

const bios = [
  "Berdedikasi untuk memberikan perjalanan teraman bagi setiap penumpang dengan pengalaman lebih dari 15 tahun di rute lintas Jawa.",
  "Ahli dalam manajemen armada dan teknik otomotif modern, memastikan setiap unit bus kami selalu dalam kondisi performa tertinggi.",
  "Berkomitmen untuk memberikan layanan bintang lima dan menangani setiap kebutuhan penumpang dengan profesionalisme tertinggi.",
  "Spesialis dalam pemeliharaan sistem mekanis tingkat lanjut dan teknologi bus modern untuk menjamin keandalan perjalanan.",
  "Mengoptimalkan setiap rute dan jadwal untuk memastikan ketepatan waktu keberangkatan dan kedatangan bagi ribuan penumpang setiap hari.",
  "Memastikan kelancaran operasional di terminal dengan fokus utama pada efisiensi layanan dan kenyamanan tunggu penumpang.",
  "Memastikan setiap detail mesin dan sistem keselamatan bus berada dalam kondisi sempurna sebelum unit dilepas ke jalan raya.",
  "Memberikan kenyamanan ekstra melalui layanan hospitality premium di kabin bus, memastikan Anda merasa seperti di rumah.",
  "Menjamin keamanan lingkungan perjalanan Anda dengan standar pengawasan ketat, memberikan Anda ketenangan pikiran selama di jalan.",
  "Mengelola ketersediaan armada dan logistik operasional secara presisi untuk menunjang pertumbuhan layanan Murni Jaya.",
  "Mengawasi standar kebersihan dan kenyamanan interior bus secara mendetail, memastikan standar premium kami selalu terjaga.",
  "Siap membantu setiap pertanyaan dan memberikan solusi terbaik bagi pengalaman perjalanan Anda yang tak terlupakan."
];

const jobVacancies = [
  {
    title: "Kapten Bus Senior (Antar Kota)",
    type: "Full-Time",
    location: "Jakarta / Surabaya",
    desc: "Kebutuhan mendesak untuk rute antar kota lintas Jawa. Diharapkan memiliki pengalaman minimal 5 tahun dengan SIM BI/BII Umum.",
    tags: ["Urgent", "Senior Role"]
  },
  {
    title: "Mekanik Mesin Scania/MB",
    type: "Full-Time",
    location: "Pool Cileungsi",
    desc: "Ahli dalam perawatan berkala, troubleshooting sistem elektrikal, dan overhoul mesin bus Eropa modern.",
    tags: ["Technical", "Eropa Tech"]
  },
  {
    title: "Pramugari Premium (VIP Service)",
    type: "Contract/Full-Time",
    location: "Jakarta - Solo",
    desc: "Berorientasi pada layanan pelanggan tinggi, berpenampilan menarik, dan mampu berkomunikasi dengan baik untuk layanan bus VIP.",
    tags: ["Hospitality", "Customer Care"]
  },
  { 
    title: "Customer Care",
    type: "Full-Time",
    location: "Jakarta",
    desc: "Bertanggung jawab untuk melayani pelanggan yang datang ke kantor pusat Murni Jaya",
    tags: ["Customer Service"]
  }  
];

const careerCenterInfo = [
  {
    title: "Program Pelatihan Kru",
    icon: GraduationCap,
    desc: "Sertifikasi berkala dari APM (Agen Pemegang Merek) untuk memastikan standar keselamatan dan teknologi terbaru selalu dikuasai."
  },
  {
    title: "Tunjangan & Kesejahteraan",
    icon: Star,
    desc: "Asuransi kesehatan komprehensif, bonus performa tahunan, pensiun, dan fasilitas mess karyawan yang layak."
  },
  {
    title: "Jenjang Karier",
    icon: TrendingUp,
    desc: "Kesempatan promosi terbuka lebar bagi setiap kru berprestasi untuk menjadi supervisor pool atau instruktur keselamatan."
  }
];

export default function Teams() {
  const [members, setMembers] = useState<TeamMember[]>(staticIndonesianTeam);
  const [loading, setLoading] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [activeRecruitmentSection, setActiveRecruitmentSection] = useState<'none' | 'jobs' | 'career'>('none');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Application Form State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{title: string, location: string} | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null as File | null
  });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setApplyForm(prev => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || ""
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email || !applyForm.phone || !applyForm.cv) {
      setApplyError("Mohon lengkapi semua data dan unggah CV Anda.");
      return;
    }

    setApplyLoading(true);
    setApplyError(null);

    try {
      // 1. Upload CV to Storage
      const cvRef = ref(storage, `cvs/${Date.now()}_${applyForm.cv.name}`);
      const uploadResult = await uploadBytes(cvRef, applyForm.cv);
      const cvURL = await getDownloadURL(uploadResult.ref);

      // 2. Save Application to Firestore
      await addDoc(collection(db, "job_applications"), {
        jobTitle: selectedJob?.title,
        jobLocation: selectedJob?.location,
        fullName: applyForm.name,
        email: applyForm.email,
        phone: applyForm.phone,
        cvURL: cvURL,
        timestamp: serverTimestamp(),
        userId: currentUser?.uid || "guest"
      });

      setApplySuccess(true);
      setApplyForm({ name: currentUser?.displayName || "", email: currentUser?.email || "", phone: "", cv: null });
    } catch (err: any) {
      console.warn("Submit application error:", err);
      setApplyError("Gagal mengirim lamaran. Silakan coba lagi.");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-black/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-white/20">
              Keluarga Besar Murni Jaya
            </span>
            <h1 className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tight">Kekuatan setiap <br /><span className="text-secondary italic">Di Balik mimpi Anda</span></h1>
            <p className="text-white/80 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Lebih dari 1.000 profesional berdedikasi bekerja siang dan malam untuk memastikan kenyamanan, keselamatan, dan kebahagiaan Anda di setiap rute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/5 p-12 md:p-20">
            <div className="text-center mb-16">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Dewan Direksi</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-dark">Kepemimpinan Visioner</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {leadershipTeam.map((leader, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h4 className="text-2xl font-display font-bold text-dark mb-1">{leader.name}</h4>
                  <p className="text-secondary font-bold text-sm uppercase tracking-tighter mb-4">{leader.role}</p>
                  <p className="text-dark/60 text-sm leading-relaxed max-w-xs">{leader.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            <div className="lg:w-1/2">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Budaya Perusahaan</h2>
              <h3 className="text-4xl md:text-6xl font-display font-bold text-dark mb-8 leading-tight">
                Integritas Melampaui <span className="text-secondary italic">Keuntungan</span>
              </h3>
              <p className="text-dark/70 text-lg mb-10 leading-relaxed">
                Di Murni Jaya, kami percaya bahwa setiap detail kecil berkontribusi pada pengalaman besar. Budaya kami berakar pada rasa hormat, disiplin tinggi, dan semangat kekeluargaan yang membuat setiap anggota tim merasa memiliki misi yang sama.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-light rounded-2xl border border-dark/5">
                  <Shield className="text-primary mb-4" size={32} />
                  <h5 className="font-bold text-dark mb-2">Safety First</h5>
                  <p className="text-dark/50 text-xs">Standard keselamatan tanpa kompromi.</p>
                </div>
                <div className="p-6 bg-light rounded-2xl border border-dark/5">
                  <Heart className="text-secondary mb-4" size={32} />
                  <h5 className="font-bold text-dark mb-2">Family Oriented</h5>
                  <p className="text-dark/50 text-xs">Bekerja dengan hati dan kepedulian.</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
                  <img src={cultureImages[0].url} alt={cultureImages[0].title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent text-white text-[10px] font-bold uppercase tracking-widest">
                    {cultureImages[0].title}
                  </div>
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg">
                  <img src={cultureImages[2].url} alt={cultureImages[2].title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent text-white text-[10px] font-bold uppercase tracking-widest">
                    {cultureImages[2].title}
                  </div>
                </div>
              </div>
              <div className="pt-12">
                <div className="relative h-100 rounded-3xl overflow-hidden shadow-lg">
                  <img src={cultureImages[1].url} alt={cultureImages[1].title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black/80 to-transparent text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-secondary">{cultureImages[1].title}</p>
                    <p className="text-xs text-white/70">{cultureImages[1].desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Teams Grid Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Garda Terdepan Kami</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-dark">Temui Kru Profesional Kami</h3>
            <p className="text-dark/60 max-w-2xl mx-auto">Mereka adalah wajah dari pelayanan kami, pahlawan di balik kemudi dan layanan prima setiap harinya.</p>
            
            {!showTeam && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTeam(true)}
                className="bg-primary text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 flex items-center gap-3 mx-auto mt-10 hover:bg-secondary transition-all"
              >
                <Users size={24} />
                Lihat Semua Kru
                <ArrowRight size={20} />
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {showTeam && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="relative">
                      <Loader2 className="animate-spin text-primary" size={64} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-dark font-bold uppercase tracking-[0.3em] text-xs mb-2">Mengambil Data Real-Time</p>
                      <p className="text-dark/40 text-[10px] italic">Sinkronisasi dengan Sistem Manajemen Kru Murni Jaya...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {members.map((member, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white rounded-3xl overflow-hidden border border-dark/5 transition-all hover:shadow-2xl hover:-translate-y-2"
                      >
                        <div className="relative h-64 w-full overflow-hidden">
                          <img 
                            src={member.picture.large} 
                            alt={`${member.name.first} ${member.name.last}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary border border-primary/20 shadow-sm">
                            Verified
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-secondary font-bold text-[10px] uppercase tracking-widest mb-2">{member.role}</p>
                          <h4 className="text-xl font-display font-bold text-dark mb-4">{member.name.first} {member.name.last}</h4>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-3 text-xs text-dark/60">
                              <div className="w-6 h-6 rounded-lg bg-light flex items-center justify-center text-primary">
                                <Mail size={12} />
                              </div>
                              <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-dark/60">
                              <div className="w-6 h-6 rounded-lg bg-light flex items-center justify-center text-secondary">
                                <MapPin size={12} />
                              </div>
                              <span>{member.location.city}, {member.location.country}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedMember(member)}
                            className="w-full py-3 bg-light text-dark font-bold text-xs rounded-xl group-hover:bg-primary group-hover:text-white transition-all"
                          >
                            Lihat Profil Lengkap
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Recruitment CTA */}
      <section className="py-24 text-white relative overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" 
            alt="Career Background" 
            className="w-full h-full object-cover brightness-[0.25]" 
          />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 -skew-x-12 translate-x-1/4 backdrop-blur-sm z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-sm p-12 rounded-[3.5rem] border border-white/10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6"> Anda bisa bergabung dengan  <span className="text-secondary italic">anggota keluarga kami, lamar sekarang</span></h2>
              <p className="text-white/60 text-lg">Kami selalu membuka pintu bagi individu bertalenta yang ingin mengembangkan karier bersama perusahaan transportasi terbaik di Indonesia.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setActiveRecruitmentSection(activeRecruitmentSection === 'jobs' ? 'none' : 'jobs')}
                className={`px-10 py-5 rounded-full font-bold text-lg transition-all shadow-lg ${
                  activeRecruitmentSection === 'jobs' 
                  ? 'bg-white text-primary scale-95' 
                  : 'bg-secondary text-white hover:scale-105 shadow-secondary/20'
                }`}
              >
                {activeRecruitmentSection === 'jobs' ? 'Tutup Lowongan' : 'Lamar Sekarang'}
              </button>
              <button 
                onClick={() => setActiveRecruitmentSection(activeRecruitmentSection === 'career' ? 'none' : 'career')}
                className={`px-10 py-5 rounded-full font-bold text-lg transition-all border ${
                  activeRecruitmentSection === 'career'
                  ? 'bg-white text-dark scale-95 border-white'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
              >
                {activeRecruitmentSection === 'career' ? 'Tutup Info' : 'Pusat Karier'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {activeRecruitmentSection !== 'none' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="mt-12 overflow-hidden"
              >
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-display font-bold">
                      {activeRecruitmentSection === 'jobs' ? 'Lowongan Tersedia' : 'Informasi Karier'}
                    </h3>
                    <button 
                      onClick={() => setActiveRecruitmentSection('none')}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {activeRecruitmentSection === 'jobs' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {jobVacancies.map((job, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white/10 p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                              {job.type}
                            </span>
                            <div className="flex gap-1">
                              {job.tags.map((tag, i) => (
                                <span key={i} className="text-[8px] font-bold px-2 py-0.5 bg-white/5 rounded-md text-white/40 italic">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <h4 className="text-lg font-bold mb-2 group-hover:text-secondary transition-colors">{job.title}</h4>
                          <p className="text-white/40 text-xs mb-4 flex items-center gap-2">
                            <MapPin size={12} /> {job.location}
                          </p>
                          <p className="text-white/60 text-sm leading-relaxed mb-6">
                            {job.desc}
                          </p>
                          <button 
                            onClick={() => {
                              setSelectedJob(job);
                              setIsApplyModalOpen(true);
                              setApplySuccess(false);
                              setApplyError(null);
                            }}
                            className="w-full py-3 bg-white text-dark font-display font-bold text-sm rounded-xl hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            Kirim Lamaran <ArrowRight size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {careerCenterInfo.map((info, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-5"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                            <info.icon size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold mb-2">{info.title}</h4>
                            <p className="text-white/60 text-sm leading-relaxed">
                              {info.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      <div className="md:col-span-3 mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <CheckCircle2 size={24} />
                          </div>
                          <p className="text-sm text-white/80 italic font-light">"Murni Jaya menjunjung tinggi kesetaraan peluang bagi seluruh anak bangsa."</p>
                        </div>
                        <Link to="mailto:karir@murnijaya.com" className="text-secondary font-bold hover:underline flex items-center gap-2">
                          Hubungi Tim HR <Mail size={16} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white md:text-dark md:bg-light md:hover:bg-dark/5 backdrop-blur-md transition-all"
              >
                <X size={24} />
              </button>

              <div className="md:w-2/5 relative h-80 md:h-auto">
                <img 
                  src={selectedMember.picture.large} 
                  alt={selectedMember.name.first} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-dark/60 to-transparent md:hidden" />
                <div className="absolute bottom-6 left-6 text-white md:hidden">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-secondary">{selectedMember.role}</p>
                  <h2 className="text-3xl font-display font-bold">{selectedMember.name.first} {selectedMember.name.last}</h2>
                </div>
              </div>

              <div className="p-8 md:p-12 md:w-3/5 flex flex-col">
                <div className="hidden md:block mb-8">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase mb-3">
                    Verified Professional
                  </span>
                  <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-2">{selectedMember.role}</p>
                  <h2 className="text-4xl font-display font-bold text-dark">{selectedMember.name.first} {selectedMember.name.last}</h2>
                </div>

                <div className="space-y-6 grow">
                  <div>
                    <h5 className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3">Tentang</h5>
                    <p className="text-dark/70 leading-relaxed italic border-l-4 border-primary/20 pl-6 text-lg">
                      "{selectedMember.bio}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3">Kontak</h5>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-dark/70">
                          <Mail size={16} className="text-primary" />
                          <span>{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-dark/70">
                          <Phone size={16} className="text-secondary" />
                          <span>{selectedMember.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3">Lokasi Tugas</h5>
                      <div className="flex items-center gap-3 text-sm text-dark/70">
                        <MapPin size={16} className="text-accent" />
                        <span>{selectedMember.location.city}, {selectedMember.location.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-dark/5 flex gap-4">
                  <button 
                    onClick={() => {
                      const waNumber = selectedMember.phone.startsWith('0') ? '62' + selectedMember.phone.substring(1).replace(/\\D/g, '') : selectedMember.phone.replace(/\\D/g, '');
                      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${selectedMember.name.first} ${selectedMember.name.last}, saya penumpang yang ingin menjadwalkan pertemuan dengan Anda.`)}`, '_blank');
                    }}
                    className="grow py-4 bg-primary text-white rounded-2xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                  >
                    Jadwalkan Pertemuan
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/favicon.ico'; // Placeholder for actual CV
                      link.download = `CV_${selectedMember.name.first}_${selectedMember.name.last}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-6 py-4 bg-light text-dark rounded-2xl font-bold hover:bg-dark/5 transition-all"
                  >
                    Unduh CV
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Job Application Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-12"
            >
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-light rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase mb-3">
                  Job Application
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">{selectedJob?.title}</h2>
                <p className="text-dark/40 text-sm mt-1 flex items-center gap-2">
                  <MapPin size={14} /> {selectedJob?.location}
                </p>
              </div>

              {applySuccess ? (
                <div className="py-8 text-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">Lamaran Terkirim!</h3>
                  <p className="text-dark/60 text-sm">Terima kasih telah melamar. Tim HR kami akan meninjau CV Anda dan menghubungi Anda segera melaui email atau WhatsApp.</p>
                  <button 
                    onClick={() => setIsApplyModalOpen(false)}
                    className="mt-8 px-8 py-3 bg-dark text-white rounded-xl font-bold hover:scale-105 transition-all text-sm"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-5">
                  {applyError && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium">
                      {applyError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nama sesuai KTP"
                      className="w-full px-5 py-3.5 rounded-xl bg-light border-none font-medium text-dark focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1">Email Aktif</label>
                    <input 
                      type="email" 
                      required
                      placeholder="email@anda.com"
                      className="w-full px-5 py-3.5 rounded-xl bg-light border-none font-medium text-dark focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1">Nomor HP / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />
                      <input 
                        type="tel" 
                        required
                        placeholder="0812xxxx"
                        className="w-full pl-10 pr-5 py-3.5 rounded-xl bg-light border-none font-medium text-dark focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest pl-1">Unggah CV (PDF)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        required
                        className="w-full pl-10 pr-5 py-3.5 rounded-xl bg-light border-none font-medium text-dark focus:ring-2 focus:ring-primary outline-none transition-all text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary file:cursor-pointer"
                        onChange={(e) => setApplyForm({...applyForm, cv: e.target.files ? e.target.files[0] : null})}
                      />
                    </div>
                    <p className="text-[9px] text-dark/30 pl-1">Maksimal 5MB. Format: PDF, DOCX.</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={applyLoading}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-[0.98] mt-4 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:grayscale"
                  >
                    {applyLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Memproses...
                      </>
                    ) : (
                      <>Kirim Lamaran Sekarang <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
