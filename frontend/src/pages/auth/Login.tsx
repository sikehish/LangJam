import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useLogin from "../../hooks/useLogin"; // Import your useLogin hook
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

function Login() {
  const { login, error, isLoading, isSucc } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };
  
  const googleAuth = (e: any) => {
    e.preventDefault()
		window.open(
			`${process.env.REACT_APP_API_URL}/api/oauth/google/callback`,
			"_self"
		);
	};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
            >
              {showPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* {error && <div className="text-red-500 mt-4">{error}</div>} */}
        {/* {isSucc && <div className="text-green-500 mt-4">Login successful!</div>} */}
        
        <div className="mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
      <span className="text-gray-400 mt-2">--- OR ---</span>
      <button onClick={googleAuth} className="mt-2 mb-4 flex box-border bg-blue-600 px-3 py-2 rounded-full items-center justify-center w-3/4 md:w-1/2 lg:w-1/3">
        <FaGoogle className="mr-2 text-white" />
						<span className="text-white">Sign in with Google</span>
					</button>
    </div>
  );
}

export default Login;
