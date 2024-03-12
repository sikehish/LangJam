export interface User {
    email: string
    isAdmin?: Boolean
    name:string, 
    token: string
  }

  export interface LoginData{
    email: string,
    password: string
  }

 export  interface LoginResponse {
    status: string;
    data: User // Assuming UserData is a type representing your user data
  }
  
  
  export interface ErrorResponse {
    status: string;
    message: string
  }


export interface SignupData{
  name: string
  email: string
  password: string
  confirmPassword: string
}

// export interface ApiResponse<T = unknown> {
//   status: string;
//   data?: T;
//   message?: string;
// }

// export interface User {
//   email: string;
//   isAdmin?: boolean;
//   name: string;
//   token: string;
// }

// export interface LoginData {
//   email: string;
//   password: string;
// }

// export type LoginResponse = ApiResponse<User>;
// export type ErrorResponse = ApiResponse<{ message: string }>;