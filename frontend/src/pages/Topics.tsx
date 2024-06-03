import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSubjectQueries } from "../hooks/useSubjectQueries";
import Subject from "../components/Subject";
import { CreateBtn } from '@/components/buttons/CreateBtn';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Topic from '@/components/Topic';
import { useTopicQueries } from '@/hooks/useTopicQueries';
import { ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import Loader from '@/components/Loader';

const Topics: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate=useNavigate()
  const {state}=useAuthContext()
  const {subjectId, categoryId} = useParams();
  const { getTopics, createTopicMutation } = useTopicQueries(queryClient, subjectId!);
  const {data: getData, isLoading} = getTopics

  const renderTopics = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getData?.data?.map((topic: { name: string; _id: string, subject:string }) => (
          <Topic key={topic._id} topic={topic}categoryId={categoryId!}/>
        ))}
      </div>
    );
  };

  if(isLoading) return <Loader />

  return (
    <div className="container mx-auto pt-10">
      <ArrowLeft
          className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
          onClick={() => navigate(`/categories/${categoryId}`)}
          />
      <h1 className="text-3xl font-bold mb-4">Topics</h1>
      {!getData?.data?.length ? (
        <p>No Topics stored yet!</p>
      ) : (
        renderTopics()
      )}
      {state?.user?.isAdmin && <CreateBtn saveMethod={createTopicMutation} name="Topic"/>}
    </div>
  );
};

export default Topics;
