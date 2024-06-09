//All mutationFn's stored here:

import { ErrorResponse, LoginData, LoginResponse, SignupData } from "../../typings";

export const  userSignupMutFn= async (resData: SignupData) => {

  const res = await fetch("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      // mode: "no-cors",
      // "Access-Control-Allow-Origin": "http://localhost:3000",
    },
    body: JSON.stringify(resData),
  });

  const data = await res.json();
  if(!res.ok) throw Error((data as ErrorResponse).message)
    return data
}

//Clubbed the below 2 mutations(adminLOgin and userLogin) as apart from endpoint, everything else is the same
export const loginMutFn=async (resData: LoginData, endpoint: string): Promise<LoginResponse | ErrorResponse> => {
  const res = await fetch(`/api/users/${endpoint}`, {
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

// export const userLoginMutFn=async (resData: LoginData): Promise<LoginResponse | ErrorResponse> => {
//   const res = await fetch("/api/users/login", {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify(resData),
//   });
//   // console.log(res)
//   const data: LoginResponse | ErrorResponse = await res.json();
//   if(!res.ok) throw Error((data as ErrorResponse).message)
//   return data
// }


// export const adminLoginMutFn=async (resData: LoginData): Promise<LoginResponse | ErrorResponse> => {
//   const res = await fetch("/api/users/admin-login", {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify(resData),
//   });
//   // console.log(res)
//   const data: LoginResponse | ErrorResponse = await res.json();
//   if(!res.ok) throw Error((data as ErrorResponse).message)
//   return data
// }

