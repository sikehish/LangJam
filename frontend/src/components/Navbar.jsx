import  { useState } from 'react';

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
          <li className="text-white hover:text-blue-200 cursor-pointer">Home</li>
          <li className="text-white hover:text-blue-200 cursor-pointer">Courses</li>
          <li className="text-white hover:text-blue-200 cursor-pointer">Practice</li>
          <li className="text-white hover:text-blue-200 cursor-pointer">About</li>
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
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">Courses</li>
            <li className="cursor-pointer">Practice</li>
            <li className="cursor-pointer">About</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
