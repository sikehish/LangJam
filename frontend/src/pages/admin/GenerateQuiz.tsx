import React from "react";
import { useLocation } from "react-router-dom";
import AdminQuizCarousel from "@/components/admin/AdminQuizCarousel";

const GenerateQuiz = () => {
  const location = useLocation();
  const {data: quizData, subject, topic, category, title} = location.state;
  
  return (
    <div className="w-[80%] lg:w-[60%] mx-auto mb-8">
      <div className="mx-0 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 pt-12">Quiz Title: <span className="underline">{title}</span></h2>
        <p className="mb-2">Difficulty Level: {quizData?.data?.difficulty}</p>
        <p className="mb-4">
          Number of Questions: {quizData?.data?.numberOfQuestions}
        </p>
      </div>
      {quizData && <AdminQuizCarousel  quizData={quizData?.data} topic={topic} subject={subject} category={category} title={title} mode={"generate-view"} difficulty={quizData?.data?.difficulty}/>}
    </div>
  );
};

export default GenerateQuiz;
