import CreateQuizCarousel from '@/components/admin/CreateQuizCarousel';
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Question } from './Quizzes';

function CreateQuiz({token}:{token: string}) {
    const location = useLocation();
  const {subject,
    topic,
    category,
    difficulty,
    numberOfQuestions,
    title} = location.state;
  
  const content="Enter introduction content here..."

  const questions: Question[] = Array.from({ length: numberOfQuestions }, (_, i) => ({
    question: `Question ${i + 1}`,
    choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    correctOption: 0,
    explanation: `Explanation ${i + 1}`
  }));  
  
  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 pt-12">Quiz Title: <span className="underline">{title}</span></h2>
        <p className="mb-2">Difficulty Level: {difficulty}</p>
        <p className="mb-4">
          Number of Questions: {numberOfQuestions}
        </p>
      </div>
      {<CreateQuizCarousel token={token} questions={questions} content={content} numberOfQuestions={numberOfQuestions} topic={topic} subject={subject} category={category} title={title}  difficulty={difficulty}/>}
    </div>
  );
}

export default CreateQuiz