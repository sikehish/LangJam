import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface SignupData{
  name: string
  email: string
  password: string
  confirmPassword: string
}

function useSignup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSucc, setIsSucc] = useState<boolean | null>(null);
  const { dispatch } = useAuthContext();

  const signup = async (resData: SignupData) => {
    setIsSucc(false);
    setIsLoading(true);
    setError(null);

    const res = await fetch("api/users/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        // mode: "no-cors",
        // "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      body: JSON.stringify(resData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.err, res);
      setIsLoading(false);
      setIsSucc(false);
      //Some error -  refer to userController to see what error was thrown and most imp-the err property name
      setError(data.statusText); //data.err is undefined
      toast.error(data.message);
    } else if (res.ok) {
      dispatch({ type: "SIGNUP" });
      // localStorage.setItem("user", JSON.stringify(data));
      setIsSucc(true);
      setIsLoading(false);
      setError(null);
      toast.success("Successfully signed up!");
      navigate("/languages");
    }
  };

  // console.log(error);
  return { signup, error, isLoading, isSucc };
}

export default useSignup;
