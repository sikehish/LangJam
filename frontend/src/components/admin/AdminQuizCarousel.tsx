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
import ReactMarkdown from 'react-markdown';

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
   title: string,
   mode: string,
   quizId?: string,
   difficulty: string
}

const AdminQuizCarousel: React.FC<Props> = ({ quizData, subject, topic, category, title, mode, quizId, difficulty }) => {
  const { questions, content } = quizData;
  const queryClient=useQueryClient()
  const navigate=useNavigate()
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null | "intro">(null);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(questions);
  const [editedContent, setEditedContent]=useState<string>(content)
  const [originalContent, setOriginalContent]=useState<string>(content)
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>(questions); //Used to ahndle the cancellation of an edit in a question

  const {mutate: reGenerateQuestions,isPending: isLoading} = useMutation({
    mutationFn: async () => {
      const quizParams= {
        subject,
        topic,
        category,
        difficulty,
        numberOfQuestions: quizData?.numberOfQuestions,
        title
      }
      const response = await fetch("/api/admin/ai-quiz-gen",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(quizParams),
      });
  
      const data=await response.json()
      if(!response.ok) throw Error(data?.message)
      return data
    },
    onSuccess: (data) => {
      toast.success("Regenerated quiz questions!")
      setEditedQuestions(data?.data?.questions)
      setEditedContent(data?.data?.content)
      navigate("/admin/new-quiz/generate",{
        state:{data,subject,topic,category,title} 
      })
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const {mutate: saveToDatabase,isPending: isSaving} = useMutation({
    mutationFn: async () => {
      const quizGen= {
        topic, difficulty, numberOfQuestions: quizData?.numberOfQuestions, questions: editedQuestions, title, content: editedContent
      }
      let response 
      if(mode=="generate-view"){
        response=await fetch("/api/admin/quizzes",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(quizGen),
        });
      }else{
        response=await fetch(`/api/admin/quizzes/${quizId}`,{
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(quizGen),
        });
      }
  
      const data=await response.json()
      if(!response.ok || data?.status=="error" || data?.status=="fail") throw Error(data?.message)
      return data
    }
  ,
    onSuccess: (data) => {
      console.log(mode)
      if(mode=="generate-view")  toast.success("New quiz generated and saved!")
      else{
    queryClient.invalidateQueries({ queryKey:['quiz', quizId]});
    toast.success("Quiz modified and saved!")
  }
  navigate(`/categories/${category}/subjects/${subject}/topics/${topic}`)
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEditQuestion = (num: number) => {
    setEditingQuestionIndex(num);
  };

  const handleSaveQuestion = (index: number) => {
    const { question, choices, correctOption, explanation } = editedQuestions[index];
    if (isNaN(correctOption) || correctOption < 0 || correctOption >= choices.length) {
      toast.error("Enter correct option number");
      return;
    }
    if (!(question.trim())) {
      toast.error("Question can't be empty");
      return;
    }
    if (!(explanation.trim())) {
      toast.error("Explanation can't be empty");
      return;
    }
    for (const [ind, choice] of choices.entries()) {
      if (choice.trim() === "") {
        toast.error(`Choice ${ind + 1} can't be left empty`);
        return;
      }
    }
    setOriginalQuestions(editedQuestions)
    setEditingQuestionIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
    setEditedQuestions(originalQuestions)
  };

  const handleInputChange = (
    index: number,
    field: keyof Question,
    value: string | number,
    choiceIndex?: number
  ) => {
    const updatedQuestions = [...editedQuestions];
    if (choiceIndex !== undefined && typeof value === "string") {
      updatedQuestions[index].choices[choiceIndex] = value;
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
    }
    setEditedQuestions(updatedQuestions);
  };

  return (
    <div className="p-4">
    {editingQuestionIndex==null && 
    (<div className="flex flex-row items-center justify-center mb-5 mt-3">
        <Button variant={"secondary"} disabled={isSaving} className="mx-2 text-white bg-blue-500 hover:bg-blue-700" onClick={(e)=>saveToDatabase()}>
            {isSaving ? <Loader2  className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" /> }
            {isSaving ? "Saving... " : "Save Quiz" }
        </Button>
        {mode=="generate-view" && <Button variant={"ghost"} disabled={isLoading} className="mx-2 bg-gray-200" onClick={(e)=>reGenerateQuestions()}>
            {isLoading ? <Loader2  className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
            {isLoading ? "Regenerating... " : "Regenerate" }
        </Button>}
        {mode=="generate-view" ? (
            <Button variant={"destructive"} onClick={()=>navigate("/admin/new-quiz")} className="mx-2">
                <CircleX className="mr-2 h-4 w-4" /> Abort
            </Button>
        ) : (
            <Button variant={"destructive"} onClick={()=> navigate(`/categories/${category}/subjects/${subject}/topics/${topic}`)} className="mx-2">
                <CircleX className="mr-2 h-4 w-4" /> Return
            </Button>
        )}
    </div>)}
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {/* Introduction Card */}
          <CarouselItem key="intro">
            <div className="shadow-md rounded-lg p-4 bg-slate-100">
              <h2 className="text-lg font-semibold mb-2">Introduction</h2>
              {editingQuestionIndex === "intro" ? (
                <div>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    id="editContent"
                    className="form-input mt-1 block w-full"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => {
                        setEditedContent(originalContent)
                        setEditingQuestionIndex(null)
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded mr-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(e) => {
                        setOriginalContent(editedContent)
                        setEditingQuestionIndex(null);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                   <ReactMarkdown children={editedContent} />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => setEditingQuestionIndex("intro")}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CarouselItem>


          {editedQuestions && editedQuestions.map((question, index) => (
            <CarouselItem key={index}>
              <div className="shadow-md rounded-lg p-4 bg-slate-100">
                {editingQuestionIndex === index ? (
                  // Edit Mode
                  <div>
                    <div className="flex justify-between mb-4">
                      <label htmlFor="editlabel">
                        <h3 className="inline text-lg font-semibold">
                          Question {index + 1}
                        </h3>
                      </label>
                      <div>
                        <button
                          onClick={() => handleSaveQuestion(index)}
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
                    <Textarea
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
                        <label key={choiceIndex} className="flex flex-row my-2 w-full">
                          <span className="mr-2">{choiceIndex + 1})</span>
                          <Textarea 
                            value={choice}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "choices",
                                e.target.value,
                                choiceIndex
                              )
                            }
                            className="w-full min-h-min"
                          />
                        </label>
                      ))}
                    </p>
                    <label>
                      Correct Option:
                      <input
                        type="number"
                        value={question.correctOption + 1}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "correctOption",
                            parseInt(e.target.value) - 1
                          )
                        }
                        className="form-input mt-1 block w-full"
                      />
                    </label>
                    <label>
                    Explanation:
                    <Textarea
                      value={question.explanation}
                      onChange={(e) =>
                        handleInputChange(index, "explanation", e.target.value)
                      }
                      className="form-input mt-1 block w-full min-h-min"
                    />
                    </label>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <div className="flex justify-between mb-2">
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
                    <ReactMarkdown children={question.question} />
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
                              disabled={editingQuestionIndex !== null}
                            />
                            <span className="ml-2">{<ReactMarkdown children={choice} />}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <p>Correct Option: {question.correctOption + 1}</p>
                    <p>
                      <span className="underline">Explanation:</span>{" "}
                      <ReactMarkdown children={question.explanation} />
                    </p>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious disabled={editingQuestionIndex!==null} />
        <CarouselNext disabled={editingQuestionIndex!==null} />
      </Carousel>
    </div>
  );
};

export default AdminQuizCarousel;
