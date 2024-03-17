import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { toast } from "react-toastify";

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
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(questions);

  const handleEditQuestion = (num: number) => {
    setEditingQuestionIndex(num);
  };

  const handleSaveQuestion = (index: number) => {
    const {question,choices,correctOption,explanation}=editedQuestions[index]
    if(correctOption<0 || correctOption>=choices.length){
      toast.error("Enter correct opton number")
      return
    }
    if(!(question.trim())){
      toast.error("Question can't be empty")
      return
    }
    if(!(explanation.trim())){
      toast.error("Explanation can't be empty")
      return
    }
    for(const [ind,choice] of choices.entries()){
        if(choice.trim()==""){
          toast.error(`Choice ${ind+1} can't be left empty`)
          return
        }
    }

    setEditingQuestionIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
  };

  const handleInputChange = (
    index: number,
    field: keyof Question,
    value: string | number,
    choiceIndex?: number
  ) => {
    const updatedQuestions = [...editedQuestions];
    if(choiceIndex!=undefined && typeof value=="string") updatedQuestions[index].choices[choiceIndex]=value
    else updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setEditedQuestions(updatedQuestions);
  };

  return (
    <div className="p-4">
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {editedQuestions.map((question, index) => (
            <CarouselItem key={index}>
              <div className="shadow-md rounded-lg p-4 bg-slate-100">
                {editingQuestionIndex === index ? (
                  <div>
                    <div className="flex justify-between mb-4">
                      <label htmlFor="editlabel">
                        <h3 className="inline text-lg font-semibold">
                          Question {index + 1}
                        </h3>
                      </label>
                      <div>
                        <button
                          onClick={(e)=>{handleSaveQuestion(index)}}
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
                    </div>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) =>
                        handleInputChange(index, "question", e.target.value)
                      }
                      id="editlabel"
                      className="form-input mt-1 block w-full"
                    />
                    <p>
                      Choices:
                      {question.choices.map((choice, choiceIndex) => (
                        <label key={choiceIndex} className="flex flex-row my-2 w-full"><span className="mr-2">{choiceIndex+1})</span><input
                          key={choiceIndex}
                          type="text"
                          value={choice}
                          onChange={(e) =>
                            handleInputChange(index, "choices", e.target.value,choiceIndex)
                          }
                          className="w-full"
                          /></label>
                      ))}
                    </p>
                    <label>
                      Correct Option:
                      <input
                        type="number"
                        value={question.correctOption+1}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "correctOption",
                            parseInt(e.target.value)-1
                          )
                        }
                        className="form-input mt-1 block w-full"
                      />
                    </label>
                    <label>
                      Explanation:
                      <input
                        type="text"
                        value={question.explanation}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "explanation",
                            e.target.value
                          )
                        }
                        className="form-input mt-1 block w-full"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-4">
                      <h3 className="inline text-lg font-semibold">
                        Question {index + 1}
                      </h3>
                      <div>
                        <button
                          onClick={() => handleEditQuestion(index)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p>{question.question}</p>
                        <ul className="mb-2">
                          {question.choices.map((choice, choiceIndex) => (
                            <li key={choiceIndex} className="mb-1">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`question_${index}`}
                                  value={choiceIndex}
                                  checked={
                                    question.correctOption == choiceIndex
                                  }
                                  onChange={(e)=>{}}
                                  className="form-radio h-5 w-5 text-indigo-600"
                                  disabled={editingQuestionIndex !== null}
                                />
                                <span className="ml-2">{choice}</span>
                              </label>
                            </li>
                          ))}
                    </ul>
                    <p>Correct Option: {question.correctOption+1}</p>
                    <p>Explanation: {question.explanation}</p>
                    <button onClick={() => handleEditQuestion(index)}>
                      Edit
                    </button>
                  </div>
                )}
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
