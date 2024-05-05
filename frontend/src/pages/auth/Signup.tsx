import React, { FormEvent, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useSignup from "../../hooks/useSignup"; // Import your useSignup hook
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { dispatch } = useAuthContext();
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const { signup, error, isLoading, isSucc } = useSignup(setShowOptionalFields);
  const navigate=useNavigate()
  const queryClient=useQueryClient() 

  console.log(process.env.REACT_APP_API_URL)

  const googleAuth = (e) => {
    e.preventDefault()
		window.open(
			`${process.env.REACT_APP_API_URL}/api/oauth/google/callback`,
			"_self"
		);
	};

  const handleSubmitBasicInfo = (e: FormEvent) => {
    e.preventDefault();
    signup({ name, email, password, confirmPassword, profilePicture, description });
  };
  
  const handleOptionalFields = async () => {
    try {
      if (!email) {
        throw new Error("Email cannot be empty!");
      }
      
      if(typeof description === "string" && description.length && !description.trim()){
        throw new Error("Ensure that the description you enter isnt an empty string!");
      }
  
      const formData = new FormData();
  
      formData.append("email", email);
  
      if (description || profilePicture) {
        if (typeof description === "string" && description.trim()) {
          formData.append("description", description.trim());
        }
  
        if (profilePicture) {
          formData.append("profilePicture", profilePicture);
        }
      } else {
        throw new Error("Data has to be entered for it to be saved :P");
      }
  
      const response = await fetch("/api/users/optional-fields", {
        method: "PATCH",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to update optional fields");
      }
  
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Optional fields successfully updated!");
      navigate("/login");
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };
  
  const handleSubmitAllInfo = async (e: FormEvent) => {
    e.preventDefault();
    handleOptionalFields()
  };

  const handleSkipOptionalFields = () => {
    navigate("/login")
    setShowOptionalFields(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Signup</h2>

        {!showOptionalFields ? (<><form onSubmit={handleSubmitBasicInfo}>
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
          <div className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in here
          </Link>
        </div>
        </>
      ) :(
          (
            <form onSubmit={handleSubmitAllInfo} className="mt-7">
            <div className="mb-7 flex">
              <label htmlFor="profilePictureInput" className="block mx-3 font-bold text-gray-700">
                PFP:
              </label>
              <input
                id="profilePictureInput"
                placeholder="Profile Picture"
                type="file"
                accept=".jpg, .jpeg, .png, .webp"
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>
            <textarea
            rows={4}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-1 rounded-md mb-7 mt-3 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            />
          
            <div className="flex justify-between items-center mb-4">
              <button
                type="submit"
                className="w-1/2 bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 mr-2"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleSkipOptionalFields}
                className="w-1/2 bg-gray-300 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400 ml-2"
              >
                Skip for now
              </button>
            </div>
          </form>
        ))}

        {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
        {/* {isSucc && <div className="text-green-500 mb-4">Signup successful!</div>} */}

      </div>
      <button onClick={googleAuth}>
						<span>Sing up with Google</span>
					</button>
    </div>
  );
}

export default Signup;
