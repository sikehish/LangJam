import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCategoryQueries = (queryClient: QueryClient, token: string) => {
  const getCategories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/entities/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to fetch categories');
      }

      return response.json();
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (newCategoryName: string) => {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        throw new Error('Unable to create category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  

  // Edit a category
  const editCategoryMutation = useMutation({
    mutationFn: async (data: { categoryId: string; newName: string }) => {
      const { categoryId, newName } = data; // Destructure categoryId and newName from data
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });
  
      if (!response.ok) {
        throw new Error('Unable to edit category');
      }
  
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
   const deleteCategoryMutation= useMutation({
      mutationFn: async (categoryId: string) => {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Unable to delete category');
        }
  
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['categories']});
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  

  return { getCategories, createCategoryMutation , editCategoryMutation, deleteCategoryMutation };
};
