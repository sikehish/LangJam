import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, LoginData } from "../../typings";

interface LoginResponse {
  message: string;
  data: UserData; // Assuming UserData is a type representing your user data
}

interface UserData {
  status: string
  data: User
}

interface ErrorResponse {
  state: string;
  message: string
}

interface LoginHook {
  login: (resData: LoginData) => Promise<void>;
  error: string | null;
  isLoading: boolean;
  isSucc: boolean | null;
}


function useLogin(): LoginHook {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSucc, setIsSucc] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (resData: LoginData): Promise<void> => {
    setIsSucc(false);
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(resData),
    });

    const data: LoginResponse | ErrorResponse = await res.json();

    if (!res.ok) {
      console.log(data, res);
      setIsLoading(false);
      setIsSucc(false);
      // Some error - refer to userController to see what error was thrown
      // and most importantly, the error property name
      setError(data.message); // data.err is undefined
      toast.error(data.message);
    } else if (res.ok) {
      console.log(res, data, (data as LoginResponse).data);
      localStorage.setItem("langJam-user", JSON.stringify((data as LoginResponse).data));
      dispatch({ type: "LOGIN", payload: (data as LoginResponse).data.data });
      setError(null);
      setIsLoading(false);
      setIsSucc(true);
      toast.success("Successfully logged in!");
      navigate("/languages");
    }
  };

  return { login, error, isLoading, isSucc };
}

export default useLogin;
