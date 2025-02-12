import Footer from "@/components/Footer/Footer";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
// import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/hooks/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </AuthProvider>
  );
}
