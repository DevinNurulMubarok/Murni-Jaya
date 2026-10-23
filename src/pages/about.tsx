import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Target, Rocket, Award, ShieldCheck, Building2 } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. H. Murni Jaya",
    role: "Founder & Chairman",
    bio: "Pemimplin visioner yang mendirikan perusahaan pada tahun 1994 dengan satu bus dan impian untuk merevolusi perjalanan di Indonesia.",
    image: "/images/team/founder.png",
  },
  {
    name: "Siska Putri Jaya",
    role: "Chief Executive Officer",
    bio: "Membawa inovasi digital dan standar pelayanan modern ke dalam operasional tradisional perusahaan, memastikan Murni Jaya tetap relevan di era baru.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Budi Santoso",
    role: "Chief Operating Officer",
    bio: "Pakar logistik dan manajemen armada yang memastikan setiap rute berjalan efisien dengan standar keselamatan tertinggi bagi seluruh penumpang.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  }
];

export default function About() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://otodriver.com/image/load/800/450/gallery/murni-jaya3462.jpg" alt="Overlay" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">Visi & Misi Perusahaan</h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Menjadi penyedia layanan transportasi terdepan yang menghubungkan setiap perjalanan dengan sentuhan kenyamanan dan kepuasan maksimal.
          </p>
        </div>
      </section>

      {/* Vision & Mission Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-6">
                <Target size={18} /> Visi & Misi
              </div>
              <h2 className="text-4xl font-display font-bold text-dark mb-8">Visi & Misi Murni Jaya</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Visi Kami</h3>
                  <p className="text-dark/70 text-lg leading-relaxed">
                    Menjadi perusahaan otobus terkemuka di Indonesia yang diakui secara nasional atas standar keselamatan tertinggi, invoasi teknologi, dan layanan pelanggan yang luar biasa.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Misi Kami</h3>
                  <ul className="space-y-4 text-dark/70 text-lg">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Menyediakan armada bus modern yang terawat dengan standar keamanan internasional.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Memberikan pengalaman perjalanan yang nyaman dan berkesan bagi setiap penumpang.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Mengintegrasikan teknologi digital untuk mempermudah akses dan reservasi pelanggan.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Membangun sumber daya manusia yang profesional, jujur, dan berorientasi pada pelayanan.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 grid grid-cols-1 gap-6">
              <div className="aspect-[16/9] relative rounded-3xl overflow-hidden shadow-lg">
                <img src="https://i.pinimg.com/1200x/57/8c/16/578c165c4eab597a2f44889fdd2b2e38.jpg" alt="Armada Murni Jaya 1" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[16/9] relative rounded-3xl overflow-hidden shadow-lg">
                <img src="https://s1.rdbuz.com/bo-images/IDN/WM/29212/1429/FR/ML/webp/bLGYVU.webp" alt="Armada Murni Jaya 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hiba Group Partnership Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-y border-white/10">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/15 font-bold text-xs sm:text-sm tracking-wide shadow-inner">
                <Building2 size={18} className="text-secondary" /> Bagian Resmi Hiba Group
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Bagian Resmi dari <span className="text-primary italic">Hiba Group</span>
              </h2>

              <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal">
                PT Murni Anugrah Jaya Usaha (PO Murni Jaya) merupakan bagian resmi dari Hiba Group (PT Hiba Utama), salah satu penyedia layanan transportasi terbesar dan tepercaya di Indonesia sejak tahun 1949. Di bawah naungan manajemen Hiba Group, kami berkomitmen untuk terus meningkatkan standar pelayanan, keselamatan, dan kenyamanan armada bus Antar Kota Antar Provinsi (AKAP) bagi seluruh masyarakat.
              </p>

              <div className="pt-3 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-sm">
                  <ShieldCheck className="text-secondary w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/60 font-medium">Standar Keselamatan</p>
                    <p className="text-sm font-bold text-white">Hiba Group Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-sm">
                  <Award className="text-primary w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/60 font-medium">Pengalaman Pengoperasian</p>
                    <p className="text-sm font-bold text-white">Terpercaya Sejak 1949</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img
                  src="/images/hiba-group.jpg"
                  alt="Armada Bus Hiba Utama Group"
                  className="w-full h-[300px] sm:h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Armada Hiba Utama Group</p>
                    <p className="text-[12px] text-white/80">Penyedia Transportasi Indonesia</p>
                  </div>
                  <span className="px-3 py-1 bg-primary text-white text-[11px] font-bold uppercase rounded-full tracking-wider shadow">
                    Resmi 1949
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-dark mb-16">Nilai-Nilai yang Mendorong Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Target, title: "Presisi", desc: "Setiap jadwal dipenuhi dengan disiplin yang ketat dan perhatian terhadap detail." },
              { icon: Rocket, title: "Inovasi", desc: "Terus memperbarui armada dan teknologi kami untuk memberikan pengalaman terbaik." },
              { icon: Users, title: "Empati", desc: "Memperlakukan setiap penumpang seperti keluarga, memastikan kenyamanan mereka adalah prioritas kami." }
            ].map((value, idx) => (
              <div key={idx} className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-primary mx-auto mb-6">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-dark">{value.title}</h3>
                <p className="text-dark/60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-dark mb-4">Orang-orang di Balik Perjalanan</h2>
            <p className="text-dark/60">Tim kepemimpinan kami membawa puluhan tahun pengalaman untuk memastikan keunggulan Murni Jaya.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group bg-light rounded-3xl overflow-hidden border border-dark/5 transition-all hover:shadow-xl">
                <div className="relative h-64 w-full">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-dark mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-4">{member.role}</p>
                  <p className="text-dark/60 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
