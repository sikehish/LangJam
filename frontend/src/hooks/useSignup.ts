import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userSignupMutFn } from '../utils/mutations';
import { useMutation } from "@tanstack/react-query";

function useSignup() {

  const navigate = useNavigate();
  const {dispatch}=useAuthContext()

  const {mutate:signup,error,isPending:isLoading , isSuccess: isSucc }=useMutation({
    mutationFn: userSignupMutFn, 
    onError: (error, variables, context) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables, context) => {
      console.log(data)
        dispatch({ type: "SIGNUP"});
        toast.success("Successfully signed up!");
        navigate("/languages");
    },
})
  return { signup, error, isLoading, isSucc };
  };



export default useSignup;
