import React, { useState } from "react";
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
import { Button } from '@/components/ui/button';
import { CircleX, Loader2, RotateCw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface QuizData {
  difficulty?: string;
  numberOfQuestions: number;
  questions: Question[];
  content: string;
}

interface Question {
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

interface Props {
  quizData: QuizData;
   topic: string,
   subject: string,
   category: string,
   token:string,
   title: string,
   quizId?: string,
   difficulty: string
}

const UserQuizCarousel: React.FC<Props> = ({ quizData, subject, topic, category,token, title, quizId, difficulty }) => {
  const { questions, content } = quizData;
  const queryClient=useQueryClient()
  const navigate=useNavigate()
  const [attemptQuestionIndex, setAttemptQuestionIndex] = useState<number | null>(null);

  const {mutate: saveToDatabase,isPending: isSaving} = useMutation({
    mutationFn: async () => {
      const quizGen= {
        topic, difficulty, numberOfQuestions: quizData?.numberOfQuestions, questions, title, content
      }
      const response=await fetch("/api/admin/quizzes",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizGen),
        });
        
        const data=await response.json()
        if(!response.ok || data?.status=="error" || data?.status=="fail") throw Error(data?.message)
        return data
    }
  ,
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey:['quiz', quizId]});
        toast.success("Quiz modified and saved!")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });



  return (
    <div className="p-4">

      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          <CarouselItem key="intro">
            <div className="shadow-md rounded-lg p-4 bg-slate-100">
              <h2 className="text-lg font-semibold mb-2">Introduction</h2>
             
                <div>
                  <p>{content}</p>
                </div>
            </div>
          </CarouselItem>

          {questions && questions.map((question, index) => (
            <CarouselItem key={index}>
              <div className="shadow-md rounded-lg p-4 bg-slate-100">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="inline text-lg font-semibold">
                        Question {index + 1}
                      </h3>
                      <div>
                      </div>
                    </div>
                    <p>{question.question}</p>
                    <ul className="my-4">
                      {question.choices.map((choice, choiceIndex) => (
                        <li key={choiceIndex} className="mb-1">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`question_${index}`}
                              value={choiceIndex}
                              checked={question.correctOption == choiceIndex}
                              onChange={(e) => {}}
                              className="form-radio h-5 w-5 text-indigo-600"
                              disabled={attemptQuestionIndex !== null}
                            />
                            <span className="ml-2">{choice}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <p>Correct Option: {question.correctOption + 1}</p>
                    <p>
                      <span className="underline">Explanation:</span>{" "}
                      {question.explanation}
                    </p>
                  </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious disabled={attemptQuestionIndex!==null} />
        <CarouselNext disabled={attemptQuestionIndex!==null} />
      </Carousel>
    </div>
  );
};

export default UserQuizCarousel;
