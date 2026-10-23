import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, BlogPost } from "@/lib/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Share2, MessageCircle, Heart, Send, X, Link as LinkIcon, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Social Stats State
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (id) {
      const foundBlog = getBlogById(id as string);
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        navigate("/blog");
      }

      // Fetch Likes Count
      const likesUnsubscribe = onSnapshot(doc(db, "blog_stats", id as string), 
        (docSnap) => {
          if (docSnap.exists()) {
            setLikesCount(docSnap.data().likes || 0);
          }
        },
        (error) => {
          console.warn("Firestore error (likes onSnapshot):", error.message);
        }
      );

      // Check if user liked (simplified with local storage if not logged in, or firestore if logged in)
      const checkLikeStatus = async () => {
        try {
          if (currentUser) {
            const likeDoc = await getDoc(doc(db, "blog_likes", `${id}_${currentUser.uid}`));
            setIsLiked(likeDoc.exists());
          } else {
            const localLiked = localStorage.getItem(`liked_${id}`);
            setIsLiked(!!localLiked);
          }
        } catch (error: any) {
          console.warn("Firestore error (checkLikeStatus):", error.message);
          // Fallback to local storage if offline or error
          const localLiked = localStorage.getItem(`liked_${id}`);
          setIsLiked(!!localLiked);
        }
      };
      checkLikeStatus();

      // Fetch Comments
      const q = query(
        collection(db, "blog_comments"),
        where("blogId", "==", id),
        orderBy("timestamp", "desc")
      );
      const commentsUnsubscribe = onSnapshot(q, 
        (snapshot) => {
          const commentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setComments(commentsData);
        },
        (error) => {
          console.warn("Firestore error (comments onSnapshot):", error.message);
        }
      );

      return () => {
        likesUnsubscribe();
        commentsUnsubscribe();
      };
    }
  }, [id, navigate, currentUser]);

  const handleLike = async () => {
    if (!id) return;

    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikesCount(prev => newLikeStatus ? prev + 1 : Math.max(0, prev - 1));

    try {
      const statsRef = doc(db, "blog_stats", id as string);
      const statsSnap = await getDoc(statsRef);
      const currentLikes = statsSnap.exists() ? statsSnap.data().likes : 0;

      await setDoc(statsRef, {
        likes: newLikeStatus ? currentLikes + 1 : Math.max(0, currentLikes - 1)
      }, { merge: true });

      if (currentUser) {
        const likeRef = doc(db, "blog_likes", `${id}_${currentUser.uid}`);
        if (newLikeStatus) {
          await setDoc(likeRef, { userId: currentUser.uid, blogId: id, timestamp: serverTimestamp() });
        } else {
          await deleteDoc(likeRef);
        }
      } else {
        if (newLikeStatus) {
          localStorage.setItem(`liked_${id}`, "true");
        } else {
          localStorage.removeItem(`liked_${id}`);
        }
      }
    } catch (error) {
      console.warn("Like error:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, "blog_comments"), {
        blogId: id,
        text: newComment,
        authorName: currentUser?.displayName || "Penumpang Murni Jaya",
        authorEmail: currentUser?.email || "anonim@murnijaya.com",
        authorPhoto: currentUser?.photoURL || null,
        timestamp: serverTimestamp(),
        userId: currentUser?.uid || "guest"
      });
      setNewComment("");
    } catch (error) {
      console.warn("Comment error:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "Berita Murni Jaya";
    let shareUrl = "";

    switch (platform) {
      case "wa":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`;
        break;
      case "fb":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
        return;
    }

    if (shareUrl) window.open(shareUrl, "_blank");
  };

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
          
          <div className="relative aspect-21/9 rounded-[2.5rem] overflow-hidden shadow-2xl border border-dark/5">
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
          <div className="pt-12 border-t border-dark/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                  isLiked 
                  ? "bg-red-50 text-red-500 scale-105" 
                  : "bg-light text-dark hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} /> 
                {likesCount > 0 ? likesCount : "Suka"}
              </button>
              
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-light rounded-full font-bold text-dark hover:bg-primary/10 hover:text-primary transition-all underline decoration-primary/30 decoration-2 underline-offset-4"
              >
                <Share2 size={18} /> Bagikan Berita
              </button>
              
              <button 
                onClick={() => document.getElementById("comment-section")?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 bg-light rounded-full font-bold text-dark hover:bg-secondary/10 hover:text-secondary transition-all"
              >
                <MessageCircle size={18} /> {comments.length} Komentar
              </button>
            </div>
            
            <Link to="/blog" className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2">
              Lihat Berita Lainnya <ArrowRight size={16} />
            </Link>
          </div>

          {/* Comment Section */}
          <div id="comment-section" className="pt-24 mt-12 border-t border-dark/5">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-display font-bold text-dark flex items-center gap-3">
                <MessageSquare className="text-secondary" size={28} />
                Komentar {comments.length > 0 && <span className="text-dark/20">({comments.length})</span>}
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-16 bg-light/50 p-8 rounded-4xl border border-dark/5 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary uppercase font-bold text-sm">
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    currentUser?.displayName?.[0] || <User size={20} />
                  )}
                </div>
                <div className="grow space-y-4">
                  <div className="text-sm font-bold text-dark/40 uppercase tracking-widest pl-2">
                    {currentUser ? `Komentar sebagai ${currentUser.displayName}` : "Komentar sebagai Penumpang"}
                  </div>
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis pendapat atau pertanyaan Anda di sini..."
                    required
                    rows={4}
                    className="w-full p-6 rounded-2xl bg-white border-none focus:ring-2 focus:ring-primary outline-none transition-all text-dark resize-none font-medium shadow-sm"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmittingComment}
                    className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-secondary transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-primary/20"
                  >
                    {isSubmittingComment ? "Mengirim..." : (
                      <>Kirim Komentar <Send size={18} /></>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-10">
              {comments.length === 0 ? (
                <div className="text-center py-20 bg-light/25 rounded-4xl border border-dashed border-dark/10">
                  <p className="text-dark/30 font-medium">Belum ada komentar. Jadilah yang pertama memberikan pendapat!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-secondary/10 flex items-center justify-center shrink-0 text-secondary uppercase font-bold text-lg group-hover:scale-110 transition-transform">
                      {comment.authorPhoto ? (
                        <img src={comment.authorPhoto} className="w-full h-full rounded-[1.2rem] object-cover" />
                      ) : (
                        comment.authorName?.[0] || 'P'
                      )}
                    </div>
                    <div className="grow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-bold text-dark text-lg">{comment.authorName}</h4>
                        <span className="text-[10px] font-black text-dark/30 uppercase tracking-widest bg-light px-3 py-1 rounded-full">
                          {comment.timestamp?.toDate ? new Date(comment.timestamp.toDate()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru saja'}
                        </span>
                      </div>
                      <p className="text-dark/60 leading-relaxed font-medium bg-light/30 p-5 rounded-2xl rounded-tl-none border-l-2 border-secondary/20">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-8"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-light rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-display font-bold text-dark mb-8 text-center pt-4">Bagikan Berita</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleShare('wa')}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-green-50 hover:bg-green-100 transition-all text-green-600 group"
                >
                  <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest">WhatsApp</span>
                </button>

                <button 
                  onClick={() => handleShare('fb')}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-blue-50 hover:bg-blue-100 transition-all text-blue-600 group"
                >
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest">Facebook</span>
                </button>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => handleShare('copy')}
                  className="w-full py-4 bg-light rounded-2xl flex items-center justify-center gap-3 font-bold text-dark hover:bg-dark hover:text-white transition-all group"
                >
                  <LinkIcon size={18} className="group-hover:rotate-45 transition-transform" />
                  {showCopySuccess ? "Salin Berhasil!" : "Salin Tautan"}
                </button>
              </div>

              <p className="mt-6 text-center text-dark/30 text-[10px] uppercase font-bold tracking-[0.2em]">Bagikan ke Tik Tok & Lainnya</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
