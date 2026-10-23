import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/index";
import About from "./pages/about";
import Blog from "./pages/blog";
import BlogDetail from "./pages/blog/[id]";
import Booking from "./pages/booking";
import BookingPaket from "./pages/booking-paket";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import AdminLogin from "./pages/admin-login";
import AdminRegister from "./pages/admin-register";
import AdminProfile from "./pages/admin-profile";
import Services from "./pages/services";
import Teams from "./pages/teams";
import Trips from "./pages/trips";
import CreateBlog from "./pages/admin/blogs/create";
import Faq from "./pages/faq";
import EditBlog from "./pages/admin/blogs/[id]/page";
import Cs from "./pages/Cs";
import Paket from "./pages/paket";
  

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            duration: 2600,
            className: "!rounded-2xl !font-semibold",
            style: {
              background: "#0F172A",
              color: "#FFFFFF",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/faq" element={<Faq />} /> 
          <Route path="/cs" element={<Cs />} />
          <Route path="/paket" element={<Paket />} />
          <Route path="/booking-paket" element={<BookingPaket />} />
        <Route path="/services" element={<Services />} />          
          {/* Admin Routes */}
          <Route path="/admin/blogs/create" element={<CreateBlog />} />
          <Route path="/admin/blogs/:id" element={<EditBlog />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}