import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Language from '../../../backend/models/languageModel';


interface Language{
  _id?: string,
  name: string;
  exercises?: [string];
}

const fetchLanguages = async ():Promise<Language[]> => {
  const response = await fetch("/api/lang/all-lang");
  const data = await response.json();
  return data.data;
};

const createLanguage = async ({newLanguage, token}: {newLanguage: string, token: string | undefined}): Promise<Language> => {
  const response = await fetch("/api/lang/create-lang", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lang: newLanguage }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create language");
  }
  return data;
};

const Admin: React.FC = () => {
  const { state } = useAuthContext();
  const [newLanguage, setNewLanguage] = useState<string>("");
  const queryClient = useQueryClient();

  // Query for fetching languages
  const { data: languages } = useQuery({ queryKey: ["languages"], queryFn: fetchLanguages});

  // Mutation for adding a new language
  const addLanguageMutation = useMutation({
    mutationFn: createLanguage,
    onSuccess: () => {
      // Invalidate and refetch the languages query after mutation
      queryClient.invalidateQueries({ queryKey: ["languages"]});
      setNewLanguage("");
      toast.success("Language added successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAddLanguage = () => {
    addLanguageMutation.mutate({newLanguage, token: state?.user?.token });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Languages</h2>
        <ul>
          {languages &&
            languages.map((language) => (
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
