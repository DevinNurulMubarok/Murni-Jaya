export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
}

const STORAGE_KEY = "murni_jaya_blogs";

export const getBlogs = (): BlogPost[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [
    {
      id: "1",
      title: "Update Layanan Murni Jaya Hari Ini",
      excerpt: "Semua rute beroperasi normal. Cek ketersediaan tiket Anda sekarang untuk keberangkatan sore ini.",
      content: "Po. Murni Jaya memastikan seluruh rute Antar Kota Antar Provinsi (AKAP) beroperasi sesuai jadwal hari ini. Kami juga telah meningkatkan protokol kebersihan di setiap armada untuk kenyamanan Anda. Reservasi dapat dilakukan melalui situs ini atau agen terdekat.",
      author: "Admin",
      date: "2026-03-05",
      imageUrl: "https://hariliburnasional.com/wp-content/uploads/2025/07/Panduan-Lengkap-Rute-dan-Jadwal-Bus-PO-Murni-Jaya-Cikarang-Bogor.jpg"
    },
    {
      id: "2",
      title: "Ekspansi Armada Baru 2026",
      excerpt: "Kabar gembira! Po. Murni Jaya menambah 50 armada bus mewah modern untuk rute Jawa.",
      content: "Kami dengan bangga mengumumkan penambahan 50 unit armada bus terbaru dengan fasilitas ultra-modern. Setiap bus dilengkapi dengan kursi ergonomis, hiburan pribadi, dan sistem keamanan terkini untuk memastikan kenyamanan Anda selama perjalanan.",
      author: "Admin",
      date: "2026-03-01",
      imageUrl: "https://mbtech.info/asset/uploads/gallery/2025/01/jok-bus-murni-jaya-5.jpg"
    },
    {
      id: "3",
      title: "Persiapan Mudik Lebaran 2026",
      excerpt: "Po. Murni Jaya siap melayani pemudik dengan penambahan jadwal dan pemeliharaan armada ekstra.",
      content: "Menyambut musim mudik Lebaran 2026, Po. Murni Jaya telah menyiapkan seluruh personil dan armada terbaik. Kami berkomitmen untuk mengantarkan Anda sampai ke kampung halaman dengan aman, nyaman, dan tepat waktu.",
      author: "Admin",
      date: "2026-04-11",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_DXsWnno765NdahfQrqv7auRzyQ5o5SFwA&s"
    },
    {
      id: "4",
      title: "Layanan Double Decker Jakarta-jogja",
      excerpt: "Nikmati kemewahan tingkat tinggi dengan armada terbaru Jetbus 5 SDD kami.",
      content: "Mulai April 2026, Po. Murni Jaya resmi mengoperasikan armada Double Decker terbaru untuk rute Jakarta-Solo. Dilengkapi dengan kursi super executive di dek bawah dan dek atas yang luas, perjalanan Anda akan terasa seperti di kelas bisnis pesawat terbang.",
      author: "Admin",
      date: "2026-03-07",
      imageUrl: "https://otodriver.com/image/load/800/450/gallery/murni-jaya3462.jpg"
    },
    {
      id: "5",
      title: "Sleeper Bus Premium Series",
      excerpt: "Revolusi istirahat dalam perjalanan dengan Sleeper Bus terbaru Murni Jaya.",
      content: "Kami menghadirkan 10 unit Sleeper Bus pertama kami untuk rute jarak jauh. Setiap cabin dilengkapi dengan kasur flat-bed, port charger, lampu baca, dan layar hiburan personal untuk memastikan Anda bangun dengan segar di kota tujuan.",
      author: "Redaksi",
      date: "2026-03-15",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSwUAdJItDz4W1AqhieC_E0kGTuDmjEKgQ5w&s"
    },
    {
      id: "6",
      title: "Layanan Bus Premium Series",
      excerpt: "Layanan bus premium dengan fasilitas lengkap untuk perjalanan nyaman dan menyenangkan bagi keluarga anda.",
      content: "Kami menghadirkan 10 unit Sleeper Bus pertama kami untuk rute jarak jauh. Setiap cabin dilengkapi dengan kasur flat-bed, port charger, lampu baca, dan layar hiburan personal untuk memastikan Anda bangun dengan segar di kota tujuan.",
      author: "Redaksi",
      date: "2026-05-10",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6lrRzwg0tMZMYF9zCb2pT8CmPBIi2IVC7Tw&s"
    },
    {
      id: "7",
      title: "bus murni jaya terbaru",
      excerpt: "lebaran tahun  ini berasa mudik pakai pesawat",
      content: "Kami menghadirkan 10 unit Sleeper Bus pertama kami untuk rute jarak jauh. Setiap cabin dilengkapi dengan kasur flat-bed, port charger, lampu baca, dan layar hiburan personal untuk memastikan Anda bangun dengan segar di kota tujuan.",
      author: "Redaksi",
      date: "2026-05-10",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7saz9d5SqwpWmtcFY11qw_xVNv1FMag9s7Q&s"
    },
  ];
};

export const getBlogById = (id: string): BlogPost | undefined => {
  const blogs = getBlogs();
  return blogs.find(b => b.id === id);
};

export const saveBlog = (blog: Omit<BlogPost, "id" | "date">) => {
  const blogs = getBlogs();
  const newBlog: BlogPost = {
    ...blog,
    id: Date.now().toString(),
    date: new Date().toISOString().split("T")[0]
  };
  blogs.unshift(newBlog);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
};

export const updateBlog = (id: string, updatedData: Partial<Omit<BlogPost, "id" | "date">>) => {
  const blogs = getBlogs();
  const index = blogs.findIndex(b => b.id === id);
  if (index !== -1) {
    blogs[index] = { ...blogs[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  }
};

export const deleteBlog = (id: string) => {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("murni_jaya_auth") === "true";
};

export const login = () => {
  localStorage.setItem("murni_jaya_auth", "true");
};

export const logout = () => {
  localStorage.removeItem("murni_jaya_auth");
};
