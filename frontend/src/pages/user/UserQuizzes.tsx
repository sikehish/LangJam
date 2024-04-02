import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { SelectComponent } from '@/components/SelectComponent';
import { useQuery } from '@tanstack/react-query';
import UserQuizTile from '@/components/UserQuizTile';
import { IQuiz } from '../Quizzes';

const UserQuizzes: React.FC<{ token: string }> = ({ token }) => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const { topicId, subjectId, categoryId } = useParams();
  const [filter, setFilter] = useState('incomplete');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quizzes', filter],
    queryFn: async () => {
      const response = await fetch(`/api/users/quiz-filter/${topicId}?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Unable to fetch quizzes');
      }
      const data = await response.json();
      if (data?.status === 'error' || data?.status === 'fail') {
          throw new Error(data?.message || 'Unknown error occurred');
        }
    //       if(!((data?.data)?.length)){
    //   if(filter=="yetto") setFilter("incomplete")
    //   else if(filter=="completed") setFilter("yetto")
    //   else setFilter("completed")
    // }
      return data;
    },
  });

  const quizzes = data?.data || [];

  const renderQuizzes = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quizzes.map((quiz: IQuiz) => (
          <UserQuizTile
            key={quiz._id}
            quiz={quiz}
            token={token}
            categoryId={categoryId!}
            subjectId={subjectId!}
            filter={filter}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-10">
        <ArrowLeft
          className="cursor-pointer mr-2 transform transition-transform hover:scale-110"
          onClick={() => navigate(`/categories/${categoryId}/subjects/${subjectId}`)}
        />
      <div className="flex flex-row justify-between mt-4">
        <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
        <SelectComponent setFilter={setFilter} filter={filter} />
      </div>
      {isLoading && <p className="mt-4">Loading...</p>}
      {isError && <p className="mt-4 text-red-500">Error fetching quizzes.</p>}
      {!isLoading && quizzes.length === 0 && (
        <p className="mt-4">
          {filter === 'yetto' ? 'Fresh quizzes coming your way!' :
          filter === 'incomplete' ? 'You have no incomplete quizzes so far!' :
          'You haven\'t completed any quizzes so far :('}
        </p>
      )}
      {!isLoading && quizzes.length > 0 && renderQuizzes()}
    </div>
  );
};

export default UserQuizzes;
