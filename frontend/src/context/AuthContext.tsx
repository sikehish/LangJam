import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface User {
  email: string
  isAdmin?: Boolean
  name:string, 
  token: string
}

interface AuthState {
  user: User | null | undefined;
  flag?: string; // Add any other properties as needed
}

interface AuthContextProps {
  dispatch: React.Dispatch<AuthAction>;
  state: AuthState;
}

interface AuthAction {
  type: 'SIGNUP' | 'LOGIN' | 'LOGOUT';
  payload?: User;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuthContext = (): AuthContextProps => {
  const val = useContext(AuthContext);
  if (!val) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return val;
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  if (action.type === 'SIGNUP') {
    return { user: null, flag: 'signed up' }; // NOT IMPLEMENTING AUTO REGISTRATION ON SIGNUP
  } else if (action.type === 'LOGIN') {
    return { user: action.payload };
  } else if (action.type === 'LOGOUT') {
    return { user: null };
  } else return state;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: localStorage.getItem('langJam-user') ? JSON.parse(localStorage.getItem('langJam-user')!) : null,
  });

  return (
    <AuthContext.Provider value={{ dispatch, state }}>
      {children}
    </AuthContext.Provider>
  );
};
