import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogs, BlogPost } from "@/lib/blog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Search } from "lucide-react";

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setBlogs(getBlogs());
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="pt-40 pb-24 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://i.pinimg.com/736x/24/a3/dc/24a3dca051e68725ab756718aa28bd42.jpg" alt="Overlay" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-secondary/10 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full text-primary font-bold text-xs uppercase tracking-widest mb-6 border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Pusat Informasi
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">
                Berita <span className="text-primary italic">Murni Jaya</span>
              </h1>
              <p className="text-white/60 text-xl leading-relaxed max-w-2xl">
                Dapatkan informasi terbaru mengenai layanan, tips perjalanan, dan pengumuman resmi dari <span className="text-white font-semibold">Po. Murni Jaya</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mb-20 max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden ring-1 ring-dark/5">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
            <input 
              type="text" 
              placeholder="Cari berita atau pengumuman..." 
              className="w-full pl-16 pr-6 py-6 rounded-2xl bg-white border-none focus:ring-0 outline-none transition-all text-lg placeholder:text-dark/20 text-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="group flex flex-col h-full bg-white rounded-4xl overflow-hidden border border-dark/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                  {blog.imageUrl ? (
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center p-8">
                      <span className="text-primary font-display font-bold text-lg text-center opacity-40 group-hover:opacity-100 transition-opacity">
                        {blog.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                      {new Date(blog.date).toDateString() === new Date().toDateString() ? "Berita Hari Ini" : "Berita Terbaru"}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex flex-col grow">
                  <div className="flex items-center gap-6 text-[10px] font-bold text-dark/30 uppercase tracking-[0.2em] mb-6">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {blog.date}</span>
                    <span className="flex items-center gap-2"><User size={14} className="text-primary" /> {blog.author}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-dark mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>
                  <p className="text-dark/50 text-sm leading-relaxed mb-8 grow line-clamp-3 font-medium">
                    {blog.excerpt}
                  </p>
                  <Link to={`/blog/${blog.id}`} className="group/btn inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide transition-all">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-2" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-dark/40 text-lg">Tidak ada artikel yang ditemukan.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
