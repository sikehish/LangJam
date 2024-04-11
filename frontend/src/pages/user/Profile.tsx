
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const Profile: React.FC<{token: string}> = ({ token }) => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await fetch('/api/users/current-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to fetch subjects');
      }

      return response.json();
    },
  });

  console.log(data)
  const {data: user}=data || {}

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
      <div className="flex items-center mb-4">
        <img
          src={user?.dp ? user?.dp : 'placeholder.svg'}
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          {/* Display user name and email */}
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">XP: {user?.xp}</p>
      </div>
      <div>
       {user?.quizAttempts && <p className="text-lg font-semibold">Quizzes Attempted: {Object.keys(user?.quizAttempts).length}</p>}
       {user?.attempts && <p className="text-lg font-semibold">Questions Attempted: {Object.keys(user?.attempts).length}</p>}
      </div>
    </div>
  );
}

export default Profile