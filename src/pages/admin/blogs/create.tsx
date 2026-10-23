import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveBlog, isAuthenticated } from "@/lib/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Send, Type, FileText, UserCircle } from "lucide-react";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin Murni Jaya");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBlog({ title, excerpt, content, author });
    navigate("/blog");
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-light">
      <Header />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-dark/50 hover:text-primary transition-colors font-bold mb-8">
            <ArrowLeft size={18} /> Kembali ke Berita
          </Link>
          
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-dark/5">
            <div className="mb-10">
              <h1 className="text-3xl font-display font-bold text-dark">Buat Artikel Baru</h1>
              <p className="text-dark/50">Bagikan pembaruan perusahaan dengan komunitas Murni Jaya.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-dark/40 uppercase tracking-widest pl-2">Judul</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-4 text-dark/30" size={18} />
                    <input 
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Rute Baru ke Surabaya"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-dark/40 uppercase tracking-widest pl-2">Penulis</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-4 text-dark/30" size={18} />
                    <input 
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest pl-2">Kutipan Singkat</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-dark/30" size={18} />
                  <textarea 
                    required
                    rows={2}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-light border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Ringkasan singkat berita"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest pl-2">Konten</label>
                <textarea 
                  required
                  rows={8}
                  className="w-full p-6 rounded-2xl bg-light border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis konten artikel Anda di sini..."
                />
              </div>

              <button type="submit" className="w-full md:w-fit px-12 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all group lg:self-end">
                Terbitkan Artikel <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
