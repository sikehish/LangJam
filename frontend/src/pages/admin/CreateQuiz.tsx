import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const EntitySelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const categoryQuery = useQuery({queryKey: ['categories'], queryFn: () => fetchCategories()});
  const subjectQuery = useQuery({queryKey:['subjects', selectedCategory], queryFn:() =>
    selectedCategory ? fetchSubjects(selectedCategory) : Promise.resolve([])}
  );
  const topicQuery = useQuery({queryKey:['topics', selectedSubject], queryFn: () =>
    selectedSubject ? fetchTopics(selectedSubject) : Promise.resolve([])
});

  const fetchCategories = async () => {
    const response = await fetch('/api/entities/categories');
    const data = await response.json();
    return data;
  };

  const fetchSubjects = async (categoryId: string) => {
    const response = await fetch(`/api/entities/subjects/${categoryId}`);
    const data = await response.json();
    return data;
  };

  const fetchTopics = async (subjectId: string) => {
    const response = await fetch(`/api/entities/topics/${subjectId}`);
    const data = await response.json();
    return data;
  };

  return (
    <div className="flex flex-col space-y-4">
      <SelectInput
        label="Category"
        options={categoryQuery?.data?.data || []}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      />
      {selectedCategory && (
        <SelectInput
          label="Subject"
          options={subjectQuery?.data?.data || []}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        />
      )}
      {selectedSubject && (
        <SelectInput
          label="Topic"
          options={topicQuery?.data?.data || []}
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        />
      )}
    </div>
  );
};

interface SelectInputProps {
  label: string;
  options: Object[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange }) => {
  console.log(label, options)
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <select
        className="block w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options.length && options.map((option,index) => (
          <option key={index} value={option?._id}>
            {option?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EntitySelector;
