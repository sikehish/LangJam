import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSubjectQueries } from "../../hooks/useSubjectQueries";
import Subject from "../../components/Subject";
import { CreateBtn } from '@/components/buttons/CreateBtn';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Quiz from '@/components/Quiz';
import { useTopicQueries } from '@/hooks/useTopicQueries';
import { Button } from '@/components/ui/button';

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
    const navigate=useNavigate()
  const queryClient = useQueryClient();
  const {subjectId, categoryId} = useParams();
  const { getTopics, createTopicMutation } = useTopicQueries(queryClient, token, subjectId!);

  const renderQuizzes = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getTopics?.data?.map((quiz:IQuiz) => (
          <Quiz key={quiz._id} quiz={quiz} token={token} categoryId={categoryId!} subjectId={subjectId!}/>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-10">
      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
      {!getTopics?.data?.length ? (
        <p>No Quizzes stored yet!</p>
      ) : (
        renderQuizzes()
      )}
     <Button onClick={()=>navigate("/admin/new-quiz")}>
        New Quiz
     </Button>
    </div>
  );
};

export default Quizzes;
