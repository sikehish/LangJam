import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UserQuizCarousel from '@/components/UserQuizCarousel';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { attemptQuestion } from '../../../../backend/controllers/userController';
const UserQuiz = ({ token }: { token: string }) => {
  const { subjectId, topicId, categoryId, quizId } = useParams();
  const navigate=useNavigate()

  const { data: quizDetails } = useQuery({
    queryKey: ['quizDetails', quizId],
    queryFn: async () => {
      const response = await fetch(`/api/users/attempted-quiz-details/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Unable to fetch quiz details');
      }
      return response.json();
    }
  });

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
  const { questionsAttempted, questionsCorrect}= quizDetails?.data?.attemptedQuizDetails ?? {}
  console.log(quizDetails?.data?.attemptedQuizDetails)

  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
      {/* <ArrowLeft
          className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
          onClick={() => navigate(`/admin`)}
          /> */}
        <h2 className="text-2xl font-bold mb-4 pt-12">Quiz Title: <span className="underline">{title}</span></h2>
        <p className="mb-2">Difficulty Level: {difficulty}</p>
         {questionsAttempted ? <p className="mb-4">
          Questions attempted: {questionsAttempted}/{questions.length} | Correct answers : {questionsCorrect}
        </p>  : <p className="mb-4">
          Number of Questions: {numberOfQuestions}
        </p>}
      </div>
      <div className='flex flex-row justify-center items-center mb-4'>
<button
   className="cursor-pointer transition-transform transform hover:scale-110 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
   onClick={() => navigate(`/categories/${categoryId}/subjects/${subjectId}/topics/${topicId}`)}
   >Return</button>
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
