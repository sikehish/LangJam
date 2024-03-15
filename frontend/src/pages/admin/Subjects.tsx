import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSubjectQueries } from "../../hooks/useSubjectQueries";
import Subject from "../../components/Subject";
import { CreateBtn } from '@/components/buttons/CreateBtn';
import { useParams, useSearchParams } from 'react-router-dom'

const Subjects: React.FC<{ token: string }> = ({ token }) => {
  const queryClient = useQueryClient();
  const {categoryId} = useParams();
  const { getSubjects, createSubjectMutation } = useSubjectQueries(queryClient, token, categoryId!);

  const renderSubjects = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getSubjects?.data?.map((subject: { name: string; _id: string, category:string }) => (
          <Subject key={subject._id} subject={subject} token={token} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-10">
      <h1 className="text-3xl font-bold mb-4">Subjects</h1>
      {!getSubjects?.data?.length ? (
        <p>No Subjects stored yet!</p>
      ) : (
        renderSubjects()
      )}
      <CreateBtn saveMethod={createSubjectMutation} name="Subject"/>
    </div>
  );
};

export default Subjects;
