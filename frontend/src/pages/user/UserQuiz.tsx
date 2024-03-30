import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UserQuizCarousel from '@/components/UserQuizCarousel';
import { Input } from '@/components/ui/input';

const UserQuiz = ({ token }: { token: string }) => {
  const { subjectId, topicId, categoryId, quizId } = useParams();

  const { data } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const response = await fetch(`/api/entities/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Unable to fetch quizzes');
      }
      return response.json();
    }
  });
  
  const { title, questions, difficulty, numberOfQuestions, content } = data?.data ?? {};

  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 pt-12">Quiz Title: <span className="underline">{title}</span></h2>
        <p className="mb-2">Difficulty Level: {difficulty}</p>
        <p className="mb-4">
          Number of Questions: {numberOfQuestions}
        </p>
      </div>
      {questions && 
        <UserQuizCarousel
          token={token}
          quizData={{questions, content, numberOfQuestions}}
          topic={topicId!}
          subject={subjectId!}
          category={categoryId!}
          title={title}
          quizId={quizId}
          difficulty={difficulty}
        />
      }
    </div>
  );
  
};

export default UserQuiz;
