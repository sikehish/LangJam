import  { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white">LangJam</h1>
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white p-2 focus:outline-none"
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
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        <ul className="hidden lg:flex space-x-8">
          <Link to='' className="text-white hover:text-blue-200 cursor-pointer">Home</Link>
          <Link to='' className="text-white hover:text-blue-200 cursor-pointer">Languages</Link>
          <Link to='' className="text-white hover:text-blue-200 cursor-pointer">Leaderboard</Link>
          <Link to='' className="text-white hover:text-blue-200 cursor-pointer">Login</Link>
          <Link to='' className="text-white hover:text-blue-200 cursor-pointer">Profile</Link>
          <Link to='' className="text-white hover:text-blue-200 cursor-pointer">Admin</Link>
        </ul>
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
          <ul className="space-y-4 py-16">
            <Link to='' className="cursor-pointer">Home</Link>
            <Link to='' className="cursor-pointer">Languages</Link>
            <Link to='' className="cursor-pointer">Leaderboard</Link>
            <Link to='' className="cursor-pointer">Login</Link>
            <Link to='' className="cursor-pointer">Profile</Link>
            <Link to='' className="cursor-pointer">Admin</Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
