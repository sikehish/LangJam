import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import {User} from "../../typings"

// Define the AuthState interface
interface AuthState {
  user: User | null;
  flag?: string; 
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
  switch (action.type) {
    case 'SIGNUP':
      return { user: null, flag: 'signed up' };
    case 'LOGIN':
      return { user: action.payload || null };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}


export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { user: null });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        if (data.user) {
          dispatch({ type: 'LOGIN', payload: data.user });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};