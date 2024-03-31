import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { SelectComponent } from '@/components/SelectComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserQuizTile from '@/components/UserQuizTile';

export interface IQuiz {
  _id: string;
  difficulty: string;
  numberOfQuestions: number;
  title: string;
  topic: string; //topicId is a string
  questions: Question[];
}

export interface Question {
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

const UserQuizzes: React.FC<{ token: string }> = ({ token }) => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { topicId, subjectId, categoryId } = useParams();
  const [filter, setFilter] = useState('yetto');

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
      if (data?.status === "error" || data?.status === "fail") {
        throw new Error(data?.message || 'Unknown error occurred');
      }
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
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-10">
      <ArrowLeft
        className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
        onClick={() => navigate(`/categories/${categoryId}/subjects/${subjectId}`)}
      />
      <div className="flex flex-row space-x-10">
        <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
        <SelectComponent setFilter={setFilter} />
      </div>
      {!quizzes.length ? <p>No Quizzes stored yet!</p> : renderQuizzes()}
    </div>
  );
};

export default UserQuizzes;
