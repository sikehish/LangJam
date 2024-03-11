// /useLogin.ts: Latest version of custom hook: useLogin
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, LoginData } from "../../typings";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";

interface LoginResponse {
  status: string;
  data: User // Assuming UserData is a type representing your user data
}


interface ErrorResponse {
  status: string;
  message: string
}

interface LoginHook {
  login: UseMutateFunction<LoginResponse | ErrorResponse, Error, LoginData, unknown>
  error: Error | null;
  isLoading: boolean;
  isSucc: boolean | null;
}


function useLogin(): LoginHook {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  
  const {mutate:login,error,isPending:isLoading , isSuccess: isSucc }=useMutation({ 
    mutationFn: async (resData: LoginData): Promise<LoginResponse | ErrorResponse> => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(resData),
    });

    const data: LoginResponse | ErrorResponse = await res.json();
    return data
  }, onError: (error, variables, context) => {
    console.log("ERRRR!")
    toast.error(error.message);
  },
  onSuccess: (data, variables, context) => {
    console.log(data)
        localStorage.setItem("langJam-user", JSON.stringify((data as LoginResponse).data));
      dispatch({ type: "LOGIN", payload: (data as LoginResponse).data });
      toast.success("Successfully logged in!");
      navigate("/languages");
  },
})

  return { login, error, isLoading, isSucc };
}

export default useLogin;
