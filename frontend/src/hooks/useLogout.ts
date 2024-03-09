import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = (e) => {
    localStorage.removeItem("langJam-user");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out!");
    navigate("/");
  };
  return logout;
}
export default useLogout;
