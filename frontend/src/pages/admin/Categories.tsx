// Categories.tsx

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {useCategoryQueries} from "../../hooks/useCategoryQueries"

const Categories: React.FC<{ token: string }> = ({ token }) => {
  const queryClient = useQueryClient();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [deletingCategoryId, setDeletingCategoryId] = useState('');
  const { getCategories, createCategoryMutation , editCategoryMutation, deleteCategoryMutation } = useCategoryQueries(queryClient, token)

  const handleCreateCategory = async () => {
     const{mutate, isSuccess, isError, isPending}=createCategory(newCategoryName, token, queryClient)
     mutate()
    if(isSuccess) setNewCategoryName('');
  };

  const handleEditCategory = async (categoryId: string) => {
    const{mutate, isSuccess, isError, isPending}=editCategory(categoryId, editedCategoryName, token, queryClient);
    mutate()
    if(isSuccess){
      setEditingCategoryId('');
      setEditedCategoryName('');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const{mutate, isSuccess, isError, isPending}=deleteCategory(categoryId, token, queryClient);
    mutate()
    if(isSuccess){
      setDeletingCategoryId('');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !categories) {
    return <div>Error fetching categories</div>;
  }

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.length && categories.map((category: any) => (
          <li key={category._id}>
            {category.name}
            <button onClick={() => setEditingCategoryId(category._id)}>Edit</button>
            <button onClick={() => setDeletingCategoryId(category._id)}>Delete</button>
            {editingCategoryId === category._id && (
              <div>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
                <button onClick={() => handleEditCategory(category._id)}>Save</button>
              </div>
            )}
            {deletingCategoryId === category._id && (
              <div>
                Are you sure you want to delete this category?
                <button onClick={() => handleDeleteCategory(category._id)}>Confirm</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Create Category</button>
      </div>
    </div>
  );
};

export default Categories;
