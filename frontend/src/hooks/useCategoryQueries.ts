import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCategoryQueries = (queryClient: QueryClient, token: string | null) => {
  const {data: getCategories} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/entities/categories');
      if (!response.ok) {
        throw new Error('Unable to fetch categories');
      }

      return response.json();
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: {name: string, message?: string}) => {
      const {name} = data
      console.log(data)
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category created succesfully")
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
  
      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category edited succesfully")
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
  
        const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['categories']});
        toast.success("Category deleted succesfully")
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  

  return { getCategories, createCategoryMutation , editCategoryMutation, deleteCategoryMutation };
};
