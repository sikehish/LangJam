import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface QuizData {
  difficultyLevel: string;
  numberOfQuestions: number;
  questions: Question[];
}

interface Question {
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

interface Props {
  quizData: QuizData;
}

const QuizCarousel: React.FC<Props> = ({ quizData }) => {
  const { questions } = quizData;
  return (
    <div className="p-4">
      <Carousel 
        className="w-full max-w-lg mx-auto"
      >
        <CarouselContent>
          {questions.map((question, index) => (
            <CarouselItem key={index}>
              <div className="shadow-md rounded-lg p-4 bg-slate-100">
              {/* <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3> */}
                <p className="mb-2"> <h3 className="inline text-md font-semibold">{index + 1}.</h3> {question.question}</p>
                <ul className="mb-2">
                  {question.choices.map((choice, choiceIndex) => (
                    <li key={choiceIndex} className="mb-1">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={choiceIndex}
                          className="form-radio h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">{choice}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="mb-2">Correct Option: {question.correctOption}</p>
                <p>Explanation: {question.explanation}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default QuizCarousel;
