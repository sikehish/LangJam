import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from 'react';

const EntitySelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const { state, dispatch } = useAuthContext();
  const { token } = state?.user!;

  const categoryQuery = useQuery({ queryKey: ['categories'], queryFn: () => fetchCategories() });
  const subjectQuery = useQuery({
    queryKey: ['subjects', selectedCategory],
    queryFn: () => (selectedCategory ? fetchSubjects(selectedCategory) : Promise.resolve([])),
  });
  const topicQuery = useQuery({
    queryKey: ['topics', selectedSubject],
    queryFn: () => (selectedSubject ? fetchTopics(selectedSubject) : Promise.resolve([])),
  });

  useEffect(()=>{
    setSelectedSubject("")
    setSelectedTopic("")
  },[selectedCategory])

  useEffect(()=>{
    setSelectedTopic("")
  },[selectedSubject])

  const fetchCategories = async () => {
    const response = await fetch('/api/entities/categories', {
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
  // console.log(selectedCategory,selectedSubject,selectedTopic)
  return (
    <div className="flex justify-center items-center h-full py-20 ">
      <Card className="w-[70%] lg:w-[50%] mx-0 bg-blue-50">
        <CardHeader className='text-center'>
          <CardTitle>New Quiz Parameters</CardTitle>
          <CardDescription>You can either create or generate the quiz using GenAI</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 mb-8">
          <SelectInput
            label="Category"
            options={categoryQuery?.data?.data || []}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
          />
          {selectedCategory &&  (
            <SelectInput
              label="Subject"
              options={subjectQuery?.data?.data || []}
              value={selectedSubject}
              onChange={(value) => setSelectedSubject(value)}
            />
          )}
          {selectedSubject && (
            <SelectInput
              label="Topic"
              options={topicQuery?.data?.data || []}
              value={selectedTopic}
              onChange={(value) => setSelectedTopic(value)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface SelectInputProps {
  label: string;
  options: { name: string; _id: string }[];
  value: string;
  onChange: (value: string) => void;
  // setter: React.Dispatch<React.SetStateAction<string>>
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="md:w-[80%] mx-auto">
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`}/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option._id} value={option._id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EntitySelector;
