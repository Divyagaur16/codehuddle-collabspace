
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { Helmet } from "react-helmet";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Log in - CodeHuddle</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 md:py-24 px-4">
        <AuthForm type="login" />
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
