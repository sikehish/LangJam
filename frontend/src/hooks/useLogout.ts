import { MouseEvent } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useLogout(): (e: MouseEvent) => void {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        dispatch({ type: "LOGOUT" });
        toast.success("Logged out!");
        navigate("/");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return logout;
}

export default useLogout;