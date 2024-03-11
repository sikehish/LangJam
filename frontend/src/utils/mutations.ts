//All mutationFn's stored here:

import { ErrorResponse, LoginData, LoginResponse } from "../../typings";

export const userLoginMutFn=async (resData: LoginData): Promise<LoginResponse | ErrorResponse> => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(resData),
    });
    console.log(res)
    const data: LoginResponse | ErrorResponse = await res.json();
    if(!res.ok) throw Error((data as ErrorResponse).message)
    return data
  }