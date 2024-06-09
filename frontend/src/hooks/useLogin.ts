import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, LoginData, LoginResponse, ErrorResponse } from "../../typings";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { loginMutFn } from "../utils/mutations";

interface LoginHook {
  login: UseMutateFunction<LoginResponse | ErrorResponse, Error, LoginData, unknown>;
  error: Error | null;
  isLoading: boolean;
  isSucc: boolean | null;
}

function useLogin(): LoginHook {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const { mutate: login, error, isPending: isLoading, isSuccess: isSucc } = useMutation({
    mutationFn: (resData: LoginData) => loginMutFn(resData, "login"),
    onError: (error, variables, context) => {
      console.log(error)
      if (error.message.startsWith("JSON.parse")) toast.error("Network error!");
      else toast.error(error.message);
    },
    onSuccess: (data, variables, context) => {
      console.log(data);
      const userData = (data as LoginResponse).data;
      dispatch({ type: "LOGIN", payload: userData });
      toast.success("Successfully logged in!");
      navigate("/categories");
    },
  });

  return { login, error, isLoading, isSucc };
}

export default useLogin;
