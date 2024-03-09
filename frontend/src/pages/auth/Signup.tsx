import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useSignup from "../../hooks/useSignup"; // Import your useSignup hook
import { Link } from "react-router-dom";

function Signup() {
  const { signup, error, isLoading, isSucc } = useSignup();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup({ name, email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md mb-7 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md mb-7 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md mb-7 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-md mb-7 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 mb-4"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
        {/* {isSucc && <div className="text-green-500 mb-4">Signup successful!</div>} */}

        <div className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
