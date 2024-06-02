import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSubjectQueries } from "../hooks/useSubjectQueries";
import Subject from "../components/Subject";
import { CreateBtn } from '@/components/buttons/CreateBtn';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

const Subjects: React.FC = () => {
  const {state}=useAuthContext()
  const queryClient = useQueryClient();
  const {categoryId} = useParams();
  const navigate=useNavigate()
  const { getSubjects, createSubjectMutation } = useSubjectQueries(queryClient, categoryId!);

  const renderSubjects = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getSubjects?.data?.map((subject: { name: string; _id: string, category:string }) => (
          <Subject key={subject._id} subject={subject} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-10">
       <ArrowLeft
          className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
          onClick={() => navigate(`/categories`)}
          />
      <h1 className="text-3xl font-bold mb-4">Subjects</h1>
      {!getSubjects?.data?.length ? (
        <p>No Subjects stored yet!</p>
      ) : (
        renderSubjects()
      )}
      {state?.user?.isAdmin && <CreateBtn saveMethod={createSubjectMutation} name="Subject"/>}
    </div>
  );
};

export default Subjects;
