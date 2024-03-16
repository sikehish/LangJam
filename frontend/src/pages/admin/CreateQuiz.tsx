import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { ReactNode, useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateQuiz: React.FC<{token:string}> = ({token}) => {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumber] = useState("10");
  const [difficulty, setDifficulty] = useState("");
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  const subjectQuery = useQuery({
    queryKey: ["subjects", category],
    queryFn: () => (category ? fetchSubjects(category) : Promise.resolve([])),
  });
  const topicQuery = useQuery({
    queryKey: ["topics", subject],
    queryFn: () => (subject ? fetchTopics(subject) : Promise.resolve([])),
  });

  useEffect(() => {
    setSubject("");
    setTopic("");
  }, [category]);

  useEffect(() => {
    setTopic("");
  }, [subject]);

  const fetchCategories = async () => {
    const response = await fetch("/api/entities/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const fetchSubjects = async (categoryId: string) => {
    const response = await fetch(`/api/entities/subjects/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const fetchTopics = async (subjectId: string) => {
    const response = await fetch(`/api/entities/topics/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const generateQuestions = async () => {
    const quizParams = {
      subject,
      topic,
      category,
      difficulty,
      numberOfQuestions,
    };
    const response = await fetch("/api/admin/ai-quiz-gen",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quizParams),
    });

    const data=await response.json()
    if(data.status!="status"){
      toast.error(data?.message)
    }
    else navigate("/admin/new-quiz/create",{
      state:data?.data
    })
  };

  return (
    <div className="flex justify-center items-center h-full py-20 ">
      <Card className="w-[70%] lg:w-[50%] mx-0 bg-blue-50">
        <CardHeader className="text-center">
          <CardTitle>New Quiz Parameters</CardTitle>
          <CardDescription>
            You can either create or generate the quiz using GenAI
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 mb-8">
          <SelectInput
            label="Category"
            options={categoryQuery?.data?.data || []}
            value={category}
            onChange={(value) => setCategory(value)}
          />
          {category && (
            <SelectInput
              label="Subject"
              options={subjectQuery?.data?.data || []}
              value={subject}
              onChange={(value) => setSubject(value)}
            />
          )}
          {subject && (
            <SelectInput
              label="Topic"
              options={topicQuery?.data?.data || []}
              value={topic}
              onChange={(value) => setTopic(value)}
            />
          )}
          {topic && (
            <div className="md:w-[80%] mx-auto">
              <Label htmlFor="numberofqs" className="text-sm">
                Number Of Questions
              </Label>
              <Input
                id="numberofqs"
                type="number"
                defaultValue={numberOfQuestions}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          )}
          {category && subject && topic && numberOfQuestions && (
            <SelectInput
              label="Difficulty"
              options={[{ name: "Easy" }, { name: "Medium" }, { name: "Hard" }]}
              value={difficulty}
              onChange={(value) => setDifficulty(value)}
              isIds={false} //if isIds is set to false, then it indicates that the Option object doesnt contain _id like in the above case
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-center mt-16 mb-8">
          <Button
            className="px-8 py-6 mx-4"
            onClick={() => {
              navigate("/admin/new-quiz/create", {
                state: {
                  subject,
                  topic,
                  category,
                  difficulty,
                  numberOfQuestions,
                },
              });
            }}
          >
            Create Quiz
          </Button>
          <Button
            className="px-8 py-6 mx-4"
            onClick={(e) => generateQuestions()}
          >
            Generate Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface Option {
  name: string;
  _id?: string;
}

interface SelectInputProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  isIds?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  value,
  onChange,
  isIds = true,
}) => {
  return (
    <div className="md:w-[80%] mx-auto">
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {isIds &&
              options.map((option) => (
                <SelectItem key={option._id} value={option._id as string}>
                  {option.name}
                </SelectItem>
              ))}
            {!isIds &&
              options.map((option, index) => (
                <SelectItem key={index} value={option.name}>
                  {option.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CreateQuiz;
