import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoginData } from "../../typings";

function useLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSucc, setIsSucc] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (resData: LoginData) => {
    setIsSucc(false);
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/users/admin-login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(resData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data, res);
      setIsLoading(false);
      setIsSucc(false);
      //Some error -  refer to userController to see what error was thrown and most imp-the err property name
      setError(data.message); //data.err is undefined
      toast.error(data.message);
    } else if (res.ok) {
      console.log(res, data, data.data);
      localStorage.setItem("langJam-user", JSON.stringify(data.data));
      dispatch({ type: "LOGIN", payload: data.data });
      setError(null);
      setIsLoading(false);
      setIsSucc(true);
      toast.success("Successfully logged into admin!");
      navigate("/admin");
    }
  };

  return { login, error, isLoading, isSucc };
}

export default useLogin;
