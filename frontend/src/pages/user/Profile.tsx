import { MdFileUpload } from "react-icons/md";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Profile: React.FC<{token: string}> = ({ token }) => {
  const queryClient=useQueryClient()
  // const [isEditingName, setIsEditingName]=useState(false)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await fetch('/api/users/current-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to fetch user profile');
      }

      return response.json();
    },
  });

  if(data) console.log(Object.keys(data?.data))
  const {data: user}=data || {}

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch('/api/users/upload-dp', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to upload profile picture');
        }

        queryClient.invalidateQueries({queryKey:['current-user']});
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
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
      src="placeholder.svg"// Render placeholder image if user.dp is not available
      alt="Placeholder"
      className="w-12 h-12 rounded-full mr-5"
    />
  )}
  <label className="absolute bottom-0 right-2 text-lg text-black cursor-pointer">
    <input
      type="file"
      accept=".jpg, .jpeg, .png, .webp"
      style={{ display: 'none' }}
      onChange={handleInputChange}
    />
    <MdFileUpload />
  </label>
</div>

        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="mt-5">
        <h1>Description:</h1>
       {user?.description ? <p>{user?.description}</p> : <p className="text-red-600 mt-1 mb-4">Your description's empty! Please add a relevant description</p>}
      </div>
      <div className="mb-4">
        <h1>Your stats:</h1>
        <p className="text-lg font-semibold">XP: {user?.xp}</p>
        {user?.quizAttempts && <p className="text-lg font-semibold">Quizzes Attempted: {Object.keys(user?.quizAttempts).length}</p>}
        {user?.attempts && <p className="text-lg font-semibold">Questions Attempted: {Object.keys(user?.attempts).length}</p>}
      </div>
    </div>
  );
}

export default Profile;
