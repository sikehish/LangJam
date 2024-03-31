import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuizQueries } from '@/hooks/useQuizQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import AdminQuizTile from '@/components/admin/AdminQuizTile';

export interface IQuiz {
    _id: string,
    difficulty: string;
    numberOfQuestions: number;
    title: string,
    topic: string, //topicId is a string
    questions: Question[];
  }
  
export interface Question {
    question: string;
    choices: string[];
    correctOption: number;
    explanation: string;
  }
  

const Quizzes: React.FC<{ token: string }> = ({ token }) => {
  const {state}=useAuthContext()
    const navigate=useNavigate()
  const queryClient = useQueryClient();
  const {topicId, subjectId, categoryId} = useParams();
  const { getQuizzes } = useQuizQueries(queryClient, token, topicId!);

  const renderQuizzes = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getQuizzes?.data?.map((quiz:IQuiz) => (
          <AdminQuizTile key={quiz._id} quiz={quiz} token={token} categoryId={categoryId!} subjectId={subjectId!}/>
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
      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
      {!getQuizzes?.data?.length ? (
        <p>No Quizzes stored yet!</p>
      ) : (
        renderQuizzes()
      )}
     {token && state?.user?.isAdmin && <Button onClick={()=>navigate("/admin/new-quiz")}>
        New Quiz
     </Button>}
    </div>
  );
};

export default Quizzes;
