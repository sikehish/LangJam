// Categories.tsx

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {useCategoryQueries} from "../../hooks/useCategoryQueries"
import Category from "../../components/Category"
import { CreateBtn } from '@/components/buttons/CreateBtn';

const Categories: React.FC<{ token: string }> = ({ token }) => {
  const queryClient = useQueryClient();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [deletingCategoryId, setDeletingCategoryId] = useState('');
  const { getCategories, createCategoryMutation } = useCategoryQueries(queryClient, token)
  console.log(getCategories)
  return (
    <div>
      <h1>Categories</h1>
        {!getCategories?.data?.length && <p>No categories stored yet!</p>}
      <ul>
        {getCategories?.data?.length && getCategories?.data?.map((category: {name: string, _id: string}) => (
          <li key={category._id}>
            <Category category={category} token={token} />
          </li>
        ))}
      </ul>
      <CreateBtn saveMethod={createCategoryMutation} name={"Category"} />
    </div>
  );
};

export default Categories;
