import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useSubjectQueries = (queryClient: QueryClient, categoryId: string) => {
  const {data: getSubjects} = useQuery({
    queryKey: ['subjects', categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/entities/subjects/${categoryId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Unable to fetch subjects');
      }

      return response.json();
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (data: {name: string, message?: string}) => {
      const {name} = data
      console.log(data)
      const response = await fetch(`/api/admin/subjects/${categoryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, category:categoryId }),
      });

      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', categoryId] });
      toast.success("Subject created succesfully")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  

  // Edit a subject
  const editSubjectMutation = useMutation({
    mutationFn: async (data: { subjectId: string; newName: string }) => {
      const { subjectId,newName } = data; // Destructure categoryId and newName from data
      const response = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: newName, categoryId: categoryId }),
      });
  
      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', categoryId] });
      toast.success("Subject edited succesfully")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
   const deleteSubjectMutation= useMutation({
      mutationFn: async (subjectId: string) => {
        const response = await fetch(`/api/admin/subjects/${subjectId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
  
        const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['subjects', categoryId]});
        toast.success("Subject deleted succesfully")
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  

  return { getSubjects, createSubjectMutation , editSubjectMutation, deleteSubjectMutation };
};
