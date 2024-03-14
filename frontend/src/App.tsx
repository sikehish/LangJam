import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Categories from "./pages/admin/Categories";
import Leaderboard from "./pages/Leaderboard";
import Languages from "./pages/Languages";
import Login from "./pages/auth/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/auth/Signup";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./pages/auth/AdminLogin";

export default function App() {
  const { state } = useAuthContext();
  console.log(state);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={state.user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={state.user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/admin-login"
          element={state.user ? <Navigate to="/" /> : <AdminLogin />}
        />
          <Route path="/admin" element={state?.user?.isAdmin? <Categories token={state?.user?.token} /> :   <Navigate to="/" />} />
        <Route
          path="/profile"
          element={state.user ? <Profile /> : <Navigate to="/" />}
        />
        <Route path="/languages" element={state.user? <Languages/> : <Navigate to="/login" /> } />
      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}
