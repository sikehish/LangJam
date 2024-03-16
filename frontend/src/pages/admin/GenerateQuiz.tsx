import React from "react";
import { useLocation } from "react-router-dom";
import QuizCarousel from "@/components/QuizCarousel";

const GenerateQuiz = ({ token }: { token: string }) => {
  const location = useLocation();
  const quizData = location.state;

  return (
    <div>
      <div className="mx-0">
        <h2 className="text-2xl font-bold mb-4">Quiz Information</h2>
        <p className="mb-2">Difficulty Level: {quizData?.difficultyLevel}</p>
        <p className="mb-4">
          Number of Questions: {quizData?.numberOfQuestions}
        </p>
      </div>
      {quizData && <QuizCarousel quizData={quizData} />}
    </div>
  );
};

export default GenerateQuiz;
