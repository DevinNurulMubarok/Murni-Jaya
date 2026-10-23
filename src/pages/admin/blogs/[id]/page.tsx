import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, BlogPost } from "@/lib/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (id) {
      const foundBlog = getBlogById(id as string);
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        navigate("/blog");
      }
    }
  }, [id, navigate]);

  if (!blog) return null;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <article className="pt-32 pb-24">
        {/* Hero Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-dark/40 hover:text-primary transition-colors font-bold mb-8">
            <ArrowLeft size={18} /> Kembali ke Berita
          </Link>
          
          <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-dark/5">
            {blog.imageUrl ? (
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-display font-bold text-4xl opacity-20">{blog.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-sm font-bold text-dark/40 uppercase tracking-widest mb-8">
            <span className="flex items-center gap-2"><Calendar size={18} className="text-primary" /> {blog.date}</span>
            <span className="flex items-center gap-2"><User size={18} className="text-secondary" /> {blog.author}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-dark mb-10 leading-tight">
            {blog.title}
          </h1>

          <div className="prose prose-lg max-w-none text-dark/70 leading-relaxed mb-16">
            <p className="text-xl font-medium text-dark mb-8 italic border-l-4 border-primary pl-6">
              {blog.excerpt}
            </p>
            {blog.content.split('\n').map((para, i) => (
              para ? <p key={i} className="mb-6">{para}</p> : <br key={i} />
            ))}
          </div>

          {/* Actions */}
          <div className="pt-12 border-t border-dark/5 flex items-center justify-between">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-light rounded-full font-bold text-dark hover:bg-primary/10 hover:text-primary transition-all">
                <Share2 size={18} /> Bagikan
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-light rounded-full font-bold text-dark hover:bg-secondary/10 hover:text-secondary transition-all">
                <MessageCircle size={18} /> Komentar
              </button>
            </div>
            <Link to="/blog" className="text-primary font-bold hover:underline">
              Lihat Berita Lainnya
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
