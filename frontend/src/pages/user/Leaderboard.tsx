import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Crown, Sparkles } from 'lucide-react';

const Leaderboard = ({ token }: { token: string | null }) => {
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const { data: leaderboard, isLoading: leaderboardLoading, isError: leaderboardError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/users/leaderboard');
      if (!response.ok) {
        throw new Error('Unable to fetch leaderboard');
      }
      return response.json();
    }
  });

  const { data: userRank, isLoading: rankLoading, isError: rankError } = useQuery({
    queryKey: ['userRank'],
    queryFn: async () => {
      if(!token) return {}
      const response = await fetch('/api/users/user-rank', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Unable to fetch user rank');
      }
      return response.json();
    }
  });

  if (leaderboardLoading || rankLoading) {
    return <p>Loading...</p>;
  }

  if (leaderboardError) {
    return <p>Error fetching data.</p>;
  }

  return (
    <div className="container mx-auto pt-10">
     <div className="flex items-center justify-center mt-5 mb-4 py-4">
        <span className="text-3xl font-bold">👑 Leaderboard 👑</span>
      </div>
      <ul>
        {leaderboard?.data.map((user: { _id: string, name: string, xp: number, email: string }, index: number) => (
          <li key={user._id} className={`p-4 rounded-lg shadow-md ${user.email === state?.user?.email ? 'bg-blue-200' : 'bg-gray-200'} mt-4 md:w-[50%] mx-auto flex justify-between items-center`}>
            <p className="text-lg">{index + 1}. {user.name}</p>
            <p className='flex bg-blue-400 bg-opacity-20 px-3 py-1.5 rounded-xl shadow-md shadow-blue-400'><span className='text-lg'>{user.xp}</span> <Sparkles className="text-yellow-600 pl-1 fill-yellow-400" /></p>
          </li>
        ))}
      </ul>
      {!rankError && state?.user && token && userRank?.data?.rank && userRank?.data?.rank > leaderboard?.data?.length && (
        <div className="mt-16">
          <div className="border-b border-black mb-4" />
          <div className="p-4 rounded-lg shadow-md bg-blue-200 mt-4">
            <p className="text-lg">{userRank?.data?.rank}. {userRank?.data?.name}</p>
            <p>{userRank?.data?.xp} ⚡</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
