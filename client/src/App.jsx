import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Login, Signup } from "./pages/Auth";
import { Chat } from "./pages/Chat";
import { Pricing } from "./pages/Pricing";
import Docs from "./pages/Docs";
import { supabase } from "./supabaseClient";
import "./styles/global.css";

// Layout component that conditionally renders Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const fullScreenRoutes = ["/chat", "/dashboard", "/pricing"];
  const isAuthPage = authRoutes.includes(location.pathname);
  const isFullScreenPage = fullScreenRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthPage && !isFullScreenPage && <Navbar />}
      {children}
      {!isAuthPage && !isFullScreenPage && <Footer />}
    </>
  );
};

// Auth handler component
const AuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle the auth callback from magic link
    const handleAuthCallback = async () => {
      // Check if there's a hash fragment with access_token
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && !error) {
          // Store user data in localStorage
          localStorage.setItem("userToken", session.access_token);
          localStorage.setItem("userEmail", session.user.email);
          localStorage.setItem("userId", session.user.id);

          // Store user metadata if available
          if (session.user.user_metadata?.name) {
            localStorage.setItem("userName", session.user.user_metadata.name);
          } else {
            // Use email as fallback for name
            const name = session.user.email.split("@")[0];
            localStorage.setItem("userName", name);
          }

          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);

          // Navigate to dashboard
          navigate("/dashboard");
        }
      }
    };

    handleAuthCallback();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Store user data in localStorage
          localStorage.setItem("userToken", session.access_token);
          localStorage.setItem("userEmail", session.user.email);
          localStorage.setItem("userId", session.user.id);

          // Store user metadata if available
          if (session.user.user_metadata?.name) {
            localStorage.setItem("userName", session.user.user_metadata.name);
          } else {
            // Use email as fallback for name
            const name = session.user.email.split("@")[0];
            localStorage.setItem("userName", name);
          }

          // Navigate to dashboard if not already there
          if (location.pathname !== "/dashboard" && location.pathname !== "/chat") {
            navigate("/dashboard");
          }
        } else if (event === "SIGNED_OUT") {
          // Clear localStorage
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          
          // Navigate to login
          navigate("/login");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <AuthHandler />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pricing" element={<Pricing />} />
          {/* Placeholder routes for future pages */}
          <Route path="/features" element={<Docs />} />
          <Route path="/how-it-works" element={<Docs />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/dashboard" element={<Chat />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
