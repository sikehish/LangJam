import Home from "../pages/Home";
import Navbar from "./components/Navbar";
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
export default function App() {

  const{state, dispatch}=useAuthContext()

  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/"  element={<Home />}></Route>
    </Routes>
    </BrowserRouter>
  )
}