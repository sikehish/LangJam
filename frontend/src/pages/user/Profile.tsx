import { MdFileUpload } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "react-toastify";

const Profile: React.FC<{ token: string }> = ({ token }) => {
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch("/api/users/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch user profile");
      }

      return response.json();
    },
  });

  if (data) console.log(Object.keys(data?.data));
  const { data: user } = data || {};
  const [descData, setDescData] = useState(user?.description || "");
  const [nameData, setNameData] = useState(user?.name || "");

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch("/api/users/upload-dp", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        queryClient.invalidateQueries({ queryKey: ["current-user"] });

        toast.success("DP successfully updated!");
      } catch (error) {
        toast.error("Error uploading profile picture!");
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleEditDesc = async () => {
    if (isEditingDesc) {
      try {
        if (descData.trim()) {
          throw new Error("Description can't be empty!");
        }

        const response = await fetch("/api/users/update", {
          method: "POST",
          body: JSON.stringify({ description: descData }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to update description");
        }

        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success("Description successfully updated!");
      } catch (error) {
        toast.error((error as Error)?.message);
        console.error("Error updating description:", error);
      }
    }
    setIsEditingDesc((prev) => !prev);
  };

  const handleEditName = async () => {
    if (isEditingName) {
      try {
        if (nameData.trim()) {
          throw new Error("Description can't be empty!");
        }
        const response = await fetch("/api/users/update", {
          method: "POST",
          body: JSON.stringify({ name: nameData }), // Stringify the object
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to update name");
        }

        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success("Name successfully updated!");
      } catch (error) {
        toast.error((error as Error)?.message);
        console.error("Error updating name:", error);
      }
    }
    setIsEditingName((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto shadow-md rounded-md p-6 mt-20 bg-slate-100">
      <div className="relative flex items-center mb-4">
        <div className="relative mr-2">
          {user?.dp ? (
            <img
              src={`data:image/jpeg;base64,${user.dp}`}
              alt="User Avatar"
              className="w-[5rem] h-[5rem] rounded-full mr-5"
            />
          ) : (
            <img
              src="placeholder.svg"
              alt="Placeholder"
              className="w-12 h-12 rounded-full mr-5"
            />
          )}
          <label className="absolute bottom-0 right-2 text-lg text-black cursor-pointer">
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
            <MdFileUpload />
          </label>
        </div>

        <div>
          <div>
            {isEditingName ? (
              <input
                type="text"
                value={nameData}
                onChange={(e) => setNameData(e.target.value)} 
              />
            ) : (
              <h2 className="text-xl font-semibold">{nameData}</h2>
            )}
             <button onClick={handleEditName}>
            {isEditingName ? <Save /> : <Pencil />}
          </button>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        </div>

        <div className="mt-5">
          <h1>Description:</h1>
          {isEditingDesc ? (
            <textarea
              value={descData}
              onChange={(e) => setDescData(e.target.value)}
            />
          ) : (
            <p>
              {descData ? (
                descData
              ) : (
                <span className="text-red-600">
                  Your description's empty! Please add a relevant description
                </span>
              )}
            </p>
          )}
          <button onClick={handleEditDesc}>
            {isEditingDesc ? <Save /> : <Pencil />}
          </button>
        </div>

        <div className="mb-4">
          <h1>Your stats:</h1>
          <p className="text-lg font-semibold">XP: {user?.xp}</p>
          {user?.quizAttempts && (
            <p className="text-lg font-semibold">
              Quizzes Attempted: {Object.keys(user?.quizAttempts).length}
            </p>
          )}
          {user?.attempts && (
            <p className="text-lg font-semibold">
              Questions Attempted: {Object.keys(user?.attempts).length}
            </p>
          )}
        </div>
      </div>
  );
};

export default Profile;
