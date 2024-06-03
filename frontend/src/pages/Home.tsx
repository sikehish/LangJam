import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGlobe, FaTrophy, FaMobileAlt, FaUsers, FaArrowDown } from 'react-icons/fa';

const Home = () => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const languages = ['Rust', 'Golang', 'JavaScript', 'Python', 'C++', 'Java'];

  const changeLanguage = () => {
    setCurrentLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length);
  };

  useEffect(() => {
    const interval = setInterval(changeLanguage, 1000); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, []);

  const globeAnimation = {
    animate: {
      rotate: 360,
      transition: { duration: 7, repeat: Infinity, ease: 'linear' }, // Adjust the duration as needed
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-white py-24 px-8 text-center relative">
        <div className="container mx-auto">
          <div className="md:flex items-center justify-between">
            <div className="md:w-full md:mb-8 md:text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold mb-4"
              >
                Welcome to LangJam
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl mb-8"
              >
                Explore, Learn, and Play with{' '}
                <motion.span
                  initial={{ textDecoration: 'none', color: 'white' }}
                  animate={{
                    textDecoration: 'underline',
                    color: 'red', // You can use rainbow colors here
                  }}
                >
                  {languages[currentLanguageIndex]}
                </motion.span>
                .
              </motion.p>
              <Link
                to="/categories"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out hover:transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
            <div className="hidden md:block md:w-1/2 md:-mt-16">
              <motion.div
                animate={globeAnimation.animate}
                className="animate-spin-slow flex justify-center"
              >
                <span role="img" className="text-8xl" aria-label="Globe">
                  🌍
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:my-12">
            {/* Feature Card 1 */}
            <div className="p-8 bg-gray-100 shadow-lg rounded-lg text-center">
              <div className="flex justify-center pb-6">
                <FaGlobe size={48} />
              </div>
              <h3 className="text-2xl font-semibold mb-6">Language Exploration</h3>
              <p className="text-gray-600">
                Dive into the world of languages and cultures.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-8 bg-gray-100 shadow-lg rounded-lg text-center">
              <div className="flex justify-center pb-6">
                <FaTrophy size={48} />
              </div>
              <h3 className="text-2xl font-semibold mb-6">Leaderboard</h3>
              <p className="text-gray-600">
                Compete, climb the leaderboard, and celebrate your achievements.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {/* Feature Card 3 */}
            <div className="p-8 bg-gray-100 shadow-lg rounded-lg text-center">
              <div className="flex justify-center pb-6">
                <FaMobileAlt size={48} />
              </div>
              <h3 className="text-2xl font-semibold mb-6">Mobile-Friendly</h3>
              <p className="text-gray-600">
                Learn on the go with our mobile-friendly platform.
              </p>
            </div>

            {/* Feature Card 4 (New Feature) */}
            <div className="p-8 bg-gray-100 shadow-lg rounded-lg text-center">
              <div className="flex justify-center pb-6">
                <FaUsers size={48} />
              </div>
              <h3 className="text-2xl font-semibold mb-6">Community</h3>
              <p className="text-gray-600">
                Connect with a vibrant community of language enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Hierarchy Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8">The Learning Hierarchy</h2>
          <p className="text-lg md:text-xl mb-8 " >
            Discover our structured approach to learning with a clear hierarchy. Move from broad categories to specific quizzes.
          </p>
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-6 bg-blue-500 shadow-lg rounded-lg mb-4">
                <h3 className="text-2xl font-semibold mb-4">Categories</h3>
                <p className="text-gray-100">Start with broad language categories.</p>
              </div>
              <FaArrowDown size={48} className="text-black" />
            </div>
            <div className="flex flex-col items-center">
              <div className="p-6 bg-blue-600 shadow-lg rounded-lg mb-4">
                <h3 className="text-2xl font-semibold mb-4">Subjects</h3>
                <p className="text-gray-100">Dive deeper into specific subjects within each category.</p>
              </div>
              <FaArrowDown size={48} className="text-black" />
            </div>
            <div className="flex flex-col items-center">
              <div className="p-6 bg-blue-700 shadow-lg rounded-lg mb-4">
                <h3 className="text-2xl font-semibold mb-4">Topics</h3>
                <p className="text-gray-100">Explore detailed topics within each subject.</p>
              </div>
              <FaArrowDown size={48} className="text-black" />
            </div>
            <div className="flex flex-col items-center">
              <div className="p-6 bg-blue-800 shadow-lg rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Quizzes</h3>
                <p className="text-gray-100">Test your knowledge with quizzes on each topic.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section className="py-20 px-8 bg-gradient-to-r bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8">About Us</h2>
          <p className="text-lg md:text-xl text-gray-800 mb-4">
            At LangJam, we're passionate about making language learning enjoyable and accessible to all. Our mission is to connect people through languages.
          </p>
          <p className="text-lg md:text-xl text-gray-800">
            With a dedicated team and a global community, we aim to provide the best language learning experience.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8 text-center">
        <div className="container mx-auto">
          <p>&copy; 2023 LangJam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
