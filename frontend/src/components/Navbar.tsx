import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';

const Navbar: React.FC = () => {
  const { state, dispatch } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logout = useLogout();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"} className="text-3xl font-extrabold text-white">LangJam</Link>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white p-2 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex space-x-8">
          <Link to="/" className="text-white hover:text-blue-200 cursor-pointer">
            Home
          </Link>
          <Link to="/categories" className="text-white hover:text-blue-200 cursor-pointer">
            Categories
          </Link>
          <Link to="/leaderboard" className="text-white hover:text-blue-200 cursor-pointer">
            Leaderboard
          </Link>
          {!state.user && (
            <Link to="/login" className="text-white hover:text-blue-200 cursor-pointer">
              Login
            </Link>
          )}
          {state.user && !state?.user?.isAdmin && (
            <Link to="/profile" className="text-white hover:text-blue-200 cursor-pointer">
              Profile
            </Link>
          )}
          {!state.user && (
            <Link to="/admin-login" className="text-white hover:text-blue-200 cursor-pointer">
              Admin
            </Link>
          )}
          {state.user?.isAdmin && (
            <Link to="/admin" className="text-white hover:text-blue-200 cursor-pointer">
              Admin
            </Link>
          )}
          {state.user && !state?.user?.isAdmin  &&(
            <Link to="/notes" className="text-white hover:text-blue-200 cursor-pointer">
            Notes
          </Link>
          )}
          {state.user && (
            <button onClick={logout} className="text-white hover:text-blue-200 cursor-pointer">
              Logout
            </button>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-blue-800 text-white text-center z-10">
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 text-white p-2 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ul className="space-y-8 py-16">
            <li>
              <Link to="/" onClick={toggleMenu}>Home</Link>
            </li>
            <li>
              <Link to="/categories" onClick={toggleMenu}>Categories</Link>
            </li>
            <li>
              <Link to="/leaderboard" onClick={toggleMenu}>Leaderboard</Link>
            </li>
            {!state.user && <li>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
            </li> }
            {state.user && !state?.user?.isAdmin && <li>
              <Link to="/profile" onClick={toggleMenu}>Profile</Link>
            </li>}
            {state.user && !state?.user?.isAdmin  &&(
              <li>
            <Link to="/notes" onClick={toggleMenu}>
            Notes
          </Link>
              </li>
          )}
          {!state.user && (
            <li>
            <Link to="/admin-login" onClick={toggleMenu}>
              Admin
            </Link>
            </li>
          )}
            {state.user?.isAdmin  && <li>
              <Link to="/admin" onClick={toggleMenu}>Admin</Link>
            </li>}
            {state.user && <li>
              <button onClick={logout} >
              Logout
            </button>
            </li>}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
