import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    // Fetch languages from your backend and set them in the state
    axios.get("/api/lang/all-lang").then((response) => {
      setLanguages(response.data);
    });
  }, []);

  const handleAddLanguage = () => {
    // Send a POST request to your backend to add a new language
    axios
      .post("/api/lang/create-lang", { lang: newLanguage })
      .then((response) => {
        setLanguages([...languages, response.data]);
        setNewLanguage("");
      })
      .catch((error) => {
        console.error("Failed to add a new language:", error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Languages</h2>
        <ul>
          {languages.map((language) => (
            <li key={language._id}>{language.name}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Add New Language</h2>
        <div className="flex">
          <input
            type="text"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Language Name"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-500 text-white font-bold p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            onClick={handleAddLanguage}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
