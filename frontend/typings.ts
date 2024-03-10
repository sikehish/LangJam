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