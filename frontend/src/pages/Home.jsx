// Hero.js
import React from 'react';

const Home = () => {
  return (
    <section className="bg-primary text-white py-16 text-center">
      <h1 className="text-4xl font-extrabold">Welcome to LangJam</h1>
      <p className="mt-6 text-lg">Learn a new language with fun and interactive courses.</p>
      <button className="mt-8 px-8 py-3 bg-secondary rounded-full hover:bg-secondary-dark hover:shadow-lg text-primary font-semibold">
        Get Started
      </button>
    </section>
  );
};

export default Home;
