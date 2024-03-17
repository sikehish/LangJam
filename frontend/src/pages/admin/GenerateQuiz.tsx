import React from "react";
import { useLocation } from "react-router-dom";
import AdminQuizCarousel from "@/components/AdminQuizCarousel";

const GenerateQuiz = ({ token }: { token: string }) => {
  const location = useLocation();
  const quizData = location.state;

  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 pt-12">Quiz Information</h2>
        <p className="mb-2">Difficulty Level: {quizData?.data?.difficulty}</p>
        <p className="mb-4">
          Number of Questions: {quizData?.data?.numberOfQuestions}
        </p>
      </div>
      {quizData && <AdminQuizCarousel token={token} quizData={quizData?.data} topic={quizData?.topic} subject={quizData?.subject} category={quizData?.category} />}
    </div>
  );
};

export default GenerateQuiz;
