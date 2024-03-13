// components/Categories.tsx

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { deleteCategory, editCategory, createCategory, getCategories } from '../../api/categoryApi';

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  // Query to fetch categories
  const { data: categories, refetch } = useQuery<Category[]>('categories', getCategories);

  // Mutation to delete a category
  const deleteCategoryMutation = useMutation(deleteCategory, {
    onSuccess: () => refetch(),
  });

  // Mutation to edit a category
  const editCategoryMutation = useMutation(editCategory, {
    onSuccess: () => {
      setEditCategoryId(null);
      refetch();
    },
  });

  // Mutation to create a new category
  const createCategoryMutation = useMutation(createCategory, {
    onSuccess: () => {
      setNewCategoryName('');
      refetch();
    },
  });

  const handleEditCategory = (id: number) => {
    setEditCategoryId(id);
    // Fetch the category details if needed
  };

  const handleSaveEdit = () => {
    if (editCategoryId !== null) {
      editCategoryMutation.mutate({ id: editCategoryId, name: newCategoryName });
    }
  };

  const handleCreateCategory = () => {
    createCategoryMutation.mutate({ name: newCategoryName });
  };

  return (
    <div>
      {/* Create Category Button */}
      <button onClick={() => handleCreateCategory()}>Create New Category</button>

      {/* Categories List */}
      {categories?.map((category) => (
        <div key={category.id}>
          {/* Category Card */}
          <div className="border p-4 mb-4">
            {editCategoryId === category.id ? (
              // Edit Mode
              <div>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit()}>Save</button>
              </div>
            ) : (
              // Display Mode
              <div>
                <p>{category.name}</p>
                <button onClick={() => handleEditCategory(category.id)}>Edit</button>
                <button onClick={() => deleteCategoryMutation.mutate(category.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
