import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { User } from "../../typings";
import Loader from '../components/Loader';

// Define the AuthState interface
interface AuthState {
  user: User | null;
  flag?: string;
  loading: boolean;
}

interface AuthContextProps {
  dispatch: React.Dispatch<AuthAction>;
  state: AuthState;
}

interface AuthAction {
  type: 'SIGNUP' | 'LOGIN' | 'LOGOUT' | 'SET_LOADING';
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
      return { ...state, user: null, flag: 'signed up', loading: false };
    case 'LOGIN':
      return { ...state, user: action.payload || null, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { user: null, loading: true });

  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ type: 'SET_LOADING' });
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
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {state.loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
