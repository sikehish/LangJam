import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Languages from "./pages/Languages";
import Login from "./pages/auth/Login"
import Profile from "./pages/Profile"
import Signup from "./pages/auth/Signup"
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter, Routes, Route, redirect
} from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import AdminLogin from "./pages/auth/AdminLogin";
export default function App() {

  const{state, dispatch}=useAuthContext()
  console.log(state)
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
       <Route path="/"  element={<Home />} />
      {!state.user && <Route path="/login"  element={<Login />} />}
      {!state.user && <Route path="/signup"  element={<Signup />} />}
       <Route path="/leaderboard"  element={<Leaderboard />} />
      {!state.user && <Route path="/admin-login"  element={<AdminLogin />} />}
      {state?.user?.isAdmin && <Route path="/admin"  element={<Admin />} />}
       <Route path="/languages"  element={<Languages />} />
      {state.user && <Route path="/profile"  element={<Profile />} />}
    </Routes>
    <ToastContainer position="top-right"/>
    </BrowserRouter>
  )
}