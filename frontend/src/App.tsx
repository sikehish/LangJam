import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Languages from "./pages/Languages";
import Login from "./pages/auth/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/auth/Signup";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter, Routes, Route, Navigate
} from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
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
        {state?.user?.isAdmin ? (
          <Route path="/admin" element={<Admin />} />
        ) : (
          <Navigate to="/" />
        )}
        <Route
          path="/profile"
          element={state.user ? <Profile /> : <Navigate to="/" />}
        />
      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}
