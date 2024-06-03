import { MdFileUpload } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descData, setDescData] = useState("");
  const [nameData, setNameData] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch("/api/users/current-user", {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Unable to fetch user profile");
      }

      return response.json();
    },
  });

  if (data) console.log(Object.keys(data?.data));
  const { data: user } = data || {};

  useEffect(() => {
    if (user?.name) setNameData(user?.name);
    if (user?.description) setDescData(user?.description);
  }, [user]);

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch("/api/users/upload-dp", {
          method: "PATCH",
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        queryClient.invalidateQueries({ queryKey: ["user-rank"] });

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
        if (!descData.trim()) {
          throw new Error("Description can't be empty!");
        }

        const response = await fetch("/api/users/update", {
          method: "PATCH",
          body: JSON.stringify({ description: descData }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
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
        if (!nameData.trim()) {
          throw new Error("Name can't be empty!");
        }
        const response = await fetch("/api/users/update", {
          method: "PATCH",
          body: JSON.stringify({ name: nameData }), // Stringify the object
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          credentials: 'include',
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

  if (isLoading) {
    return (
        <Loader />
    );
  }


  return (
    <div className="mx-auto max-w-md mt-20">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Your Profile</h1>
      <div className="max-w-md mx-auto shadow-md rounded-md p-6 bg-slate-100">
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
            <label className="absolute bottom-0 right-2 text-lg text-black cursor-pointer" title="Upload profile photo">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .webp"
                style={{ display: "none" }}
                onChange={handleInputChange}
              />
              <MdFileUpload/>
            </label>
          </div>

          <div>
            <div className="flex items-center">
              {isEditingName ? (
                <input
                  type="text"
                  value={nameData}
                  onChange={(e) => setNameData(e.target.value)} 
                />
              ) : (
                <h2 className="text-xl font-semibold">{nameData}</h2>
              )}
              <button onClick={handleEditName} className="ml-2">
                {isEditingName ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex-col mb-4">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">Description:</h1>
            <button onClick={handleEditDesc} className="ml-2">
              {isEditingDesc ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
            </button>
          </div>
          {isEditingDesc? (
            <textarea
              rows={4}
              value={descData}
              onChange={(e) => setDescData(e.target.value)}
              className="w-full px-2 pb-5 pt-1"
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
        </div>

        <div className="mb-4">
          <h1 className="text-lg font-semibold mb-1">Your stats:</h1>
          <p className="">XP: {user?.xp}</p>
          {user?.quizAttempts && (
            <p className="">
              Quizzes Attempted: {Object.keys(user?.quizAttempts).length}
            </p>
          )}
          {user?.attempts && (
            <p className="">
              Questions Attempted: {Object.keys(user?.attempts).length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
