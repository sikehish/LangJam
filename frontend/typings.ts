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