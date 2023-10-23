import { createContext, useReducer, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const val = useContext(AuthContext);
  //Need to throw error if value is being acesed outside the context defined
  return val;
};

const reducer = (state, action) => {
  if (action.type === 'SIGNUP') {
    return { user: null, flag: 'signed up' }; //NOT IMPLEMENTING AUTO REGISTRATION ON SIGNUP
  } else if (action.type === 'LOGIN') {
    return { user: action.payload };
  } else if (action.type === 'LOGOUT') {
    return { user: null };
  } else return state;
};

//NOTE: Due to shortage of time, I'm storing the JWT key on the frontend. Otherwise, I would have stored it in a cookie.

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: JSON.parse(localStorage.getItem("langJam-user")) || null
  });

  return (
    <AuthContext.Provider value={{ dispatch, state }}>
      {children}
    </AuthContext.Provider>
  );
};