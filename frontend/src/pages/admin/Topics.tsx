import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSubjectQueries } from "../../hooks/useSubjectQueries";
import Subject from "../../components/Subject";
import { CreateBtn } from '@/components/buttons/CreateBtn';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Topic from '@/components/Topic';
import { useTopicQueries } from '@/hooks/useTopicQueries';
import { ArrowLeft } from 'lucide-react';

const Topics: React.FC<{ token: string }> = ({ token }) => {
  const queryClient = useQueryClient();
  const navigate=useNavigate()
  const {subjectId, categoryId} = useParams();
  const { getTopics, createTopicMutation } = useTopicQueries(queryClient, token, subjectId!);

  const renderTopics = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getTopics?.data?.map((topic: { name: string; _id: string, subject:string }) => (
          <Topic key={topic._id} topic={topic} token={token} categoryId={categoryId!}/>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-10">
      <ArrowLeft
          className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
          onClick={() => navigate(`/admin/categories/${categoryId}`)}
          />
      <h1 className="text-3xl font-bold mb-4">Topics</h1>
      {!getTopics?.data?.length ? (
        <p>No Topics stored yet!</p>
      ) : (
        renderTopics()
      )}
      <CreateBtn saveMethod={createTopicMutation} name="Topic"/>
    </div>
  );
};

export default Topics;
