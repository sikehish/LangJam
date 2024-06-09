import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CircleX, Loader2, RotateCw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import Confetti from "./Confetti";
import ReactMarkdown from 'react-markdown';

interface QuizData {
  _id?: string;
  difficulty?: string;
  numberOfQuestions: number;
  questions: Question[];
  content: string;
}

interface Question {
  _id?: string;
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

interface Props {
    quizData: QuizData;
    subject: string;
    topic: string;
    category: string;
    title: string;
    quizId?: string;
    difficulty: string;
  }
  

const UserQuizCarousel: React.FC<Props> = ({
  quizData,
  subject,
  topic,
  category,
  title,
  quizId,
  difficulty
}) => {
  const { questions, content } = quizData;
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const queryClient = useQueryClient();
  const { state } = useAuthContext();
  const navigate = useNavigate();
  
  const [attemptedQuestions, setAttemptedQuestions] = useState<{
    [questionId: string]: { isCorrect: boolean; chosenOption: number };
  } | null>(null); // Track attempted questions

  useEffect(() => {
    // Fetch user's attempted questions from profile and update state
    const fetchAttemptedQuestions = async () => {
      try {
        const response = await fetch("/api/users/attempted-questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch attempted questions"
          );
        }
        setAttemptedQuestions(data?.data?.attemptedQuestions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAttemptedQuestions();
  }, [state?.user]);
  

  // const [attemptQuestionIndex, setAttemptQuestionIndex] = useState<number | null>(null);
  const [attemptChoiceIndex, setAttemptChoiceIndex] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { mutate: saveAttempt, isPending: isSaving } = useMutation({
    mutationFn: async (variables:{index: number, correctOption: number}) => {
      
        setIsSubmitting(true);
        const { index, correctOption } = variables;
      const quesData = {
        quizId,
        questionId: questions[index!]?._id,
        chosenOption: attemptChoiceIndex,
      };
      const response = await fetch("/api/users/attempt-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(quesData),
      });

      const data = await response.json();
      if (!response.ok || data?.status == "error" || data?.status == "fail")
        throw Error(data?.message);
    console.log(attemptChoiceIndex, correctOption)
      setAttemptedQuestions((prev) => ({
        ...prev,
        [questions[index!]?._id as string]: {
          isCorrect: attemptChoiceIndex == correctOption,
          chosenOption: attemptChoiceIndex!,
        },
      }));
      return data?.data;
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:['quizDetails', quizId]})
        queryClient.refetchQueries({queryKey:['quizDetails', quizId]})
      setIsSubmitting(false);
      if (data?.isCorrect) {
        toast.success("That's right!");
        setIsConfettiVisible(true)
      }
      else toast.error("OOPS! Better luck next time!");
      setAttemptChoiceIndex(null);
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast.error(error.message);
    },
  });

  const handleSubmitAttempt = (
    e: React.FormEvent,
    index: number,
    correctOption: number
  ) => {
    e.preventDefault();
    if (
      attemptChoiceIndex !== null &&
      attemptedQuestions &&
      questions[index]?._id &&
      !attemptedQuestions[questions[index]._id!]
      ) {
        saveAttempt({index, correctOption});
      } else  toast.error("Please select an option!")
    };
    
    return (
      <div className="p-4">
      {isConfettiVisible && <Confetti setIsConfettiVisible={setIsConfettiVisible} />}
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          <CarouselItem key="intro">
            <div className="shadow-md rounded-lg p-4 bg-slate-100">
              <h2 className="text-lg font-semibold mb-2">Introduction</h2>
              <div>
              <ReactMarkdown children={content} />
              </div>
            </div>
          </CarouselItem>
          {attemptedQuestions &&
            questions &&
            questions.map((question, index) => (
              <CarouselItem key={index}>
                <form
                  className={`shadow-md rounded-lg p-4 ${question?._id && (attemptedQuestions[question._id]?.isCorrect ? "bg-green-50" : attemptedQuestions[question._id]?.isCorrect==false ? "bg-red-50" :  "bg-slate-100" )  }`}
                  onSubmit={(e) =>
                    handleSubmitAttempt(e, index, question.correctOption)
                  }
                >
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="inline text-lg font-semibold">
                        Question {index + 1}
                      </h3>
                    </div>
                    <ReactMarkdown children={question.question} />
                    <ul className="my-4">
                      {question.choices.map((choice, choiceIndex) => (
                        <li key={choiceIndex} className="mb-1">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`question_${index}`}
                              value={choiceIndex}
                              onChange={(e) => {
                                setAttemptChoiceIndex(choiceIndex);
                              }}
                              className="form-radio h-5 w-5 text-indigo-600"
                              defaultChecked={
                                question?._id !== undefined &&
                                attemptedQuestions.hasOwnProperty(
                                  question?._id
                                ) &&
                                choiceIndex ==
                                  attemptedQuestions[question._id].chosenOption
                              }
                              disabled={
                                question?._id != undefined &&
                                attemptedQuestions.hasOwnProperty(question?._id)
                              }
                            />
                            <span className="flex ml-2">
                              {<ReactMarkdown children={choice} className="mx-1" />}
                              {question?._id != undefined &&
                                attemptedQuestions.hasOwnProperty(
                                  question?._id
                                ) &&
                                choiceIndex == question.correctOption && (
                                  <span className="px-1">✅</span>
                                )}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                     </div>
                     <div className="flex justify-center items-center">
                {question?._id && !attemptedQuestions[question._id] && (
                    <button
                    type="submit"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              ) : (
                                  "Answer!"
                                  )}
                        </button>
                      )}
                      </div>
                </form>
                    

                    {question?._id && attemptedQuestions[question._id] && <div  className={`flex flex-row justify-center items-center shadow-md rounded-lg p-4 mt-7 mb-4 ${(attemptedQuestions[question._id]?.isCorrect ? "bg-green-100" : "bg-red-100")  }`}>
                      {question._id && attemptedQuestions[question._id] && (
                        <div>
                          {attemptedQuestions[question._id].isCorrect ? (
                            <p>Correct answer!</p>
                          ) : (
                            <p>Wrong answer!</p>
                          )}
                          <p>
                            <span className="underline">Explanation:</span>{" "}
                            {<ReactMarkdown children={question.explanation} />}
                          </p>
                        </div>
                      )}
                      
                      </div>}
                      
              </CarouselItem>
            ))}
        </CarouselContent>
        {!isConfettiVisible && <CarouselPrevious />}
        {!isConfettiVisible && <CarouselNext />}
      </Carousel>
    </div>
  );
};

export default UserQuizCarousel;
