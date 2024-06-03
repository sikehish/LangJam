import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCategoryQueries } from "../hooks/useCategoryQueries";
import Category from "../components/Category";
import { CreateBtn } from '@/components/buttons/CreateBtn';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import Loader from '@/components/Loader';

const Categories: React.FC= () => {
  const queryClient = useQueryClient();
  const {state}=useAuthContext()
  const navigate=useNavigate()
  const { getCategories, createCategoryMutation } = useCategoryQueries(queryClient);
  const { data: getData, isLoading} =getCategories;

  const renderCategories = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {getData?.data?.map((category: { name: string; _id: string }) => (
          <Category key={category._id} category={category}/>
        ))}
      </div>
    );
  };

  if(isLoading){
    return (
     <Loader />
    )
  }

  return (
    <div className="container mx-auto pt-10">
      <ArrowLeft
          className="cursor-pointer ml-2 mb-3 transition-transform transform hover:scale-110"
          onClick={() => navigate(`/admin`)}
          />
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      {!getData?.data?.length ? (
        <p>No categories stored yet!</p>
      ) : (
        renderCategories()
      )}
     {state?.user?.isAdmin && <CreateBtn saveMethod={createCategoryMutation} name="Category" />}
    </div>
  );
};

export default Categories;

