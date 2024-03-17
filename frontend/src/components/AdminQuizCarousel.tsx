import React, { useState } from 'react';
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

const AdminQuizCarousel: React.FC<Props> = ({ quizData }) => {
  const { questions } = quizData;
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
  };

  const handleSaveQuestion = () => {
    setEditingQuestionIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
  };

  return (
    <div className="p-4">
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {questions.map((question, index) => (
            <CarouselItem key={index}>
              <div className="shadow-md rounded-lg p-4 bg-slate-100">
                <div className="flex justify-between mb-4">
                  <h3 className="inline text-lg font-semibold">Question {index + 1}</h3>
                  {editingQuestionIndex === index ? (
                    <div>
                      <button
                        onClick={handleSaveQuestion}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditQuestion(index)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <p className="mb-2">{question.question}</p>
                <ul className="mb-2">
                  {question.choices.map((choice, choiceIndex) => (
                    <li key={choiceIndex} className="mb-1">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={choiceIndex}
                          checked={question.correctOption==choiceIndex}
                          className="form-radio h-5 w-5 text-indigo-600"
                          disabled={editingQuestionIndex !== null}
                        />
                        <span className="ml-2">{choice}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="mb-2">Correct Option: {question.correctOption+1}</p>
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

export default AdminQuizCarousel;
