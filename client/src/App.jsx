import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Login, Signup } from "./pages/Auth";
import { Chat } from "./pages/Chat";
import "./styles/global.css";

// Layout component that conditionally renders Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const fullScreenRoutes = ["/chat", "/dashboard"];
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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          {/* Placeholder routes for future pages */}
          <Route path="/features" element={<Home />} />
          <Route path="/how-it-works" element={<Home />} />
          <Route path="/pricing" element={<Home />} />
          <Route path="/docs" element={<Home />} />
          <Route path="/dashboard" element={<Chat />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
