import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useQuizQueries = (queryClient: QueryClient, topicId: string) => {
  const {data: getQuizzes} = useQuery({
    queryKey: ['quizzes', topicId],
    queryFn: async () => {
      const response = await fetch(`/api/entities/quizzes/${topicId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Unable to fetch quizzes');
      }

      return response.json();
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: async (data: {title: string, message?: string}) => {
      const {title} = data
      console.log(data)
      const response = await fetch(`/api/admin/quizzes/${topicId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, topic:topicId }),
      });

      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', topicId] });
      toast.success("Quiz created succesfully")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  

  // Edit a topic
  const editQuizMutation = useMutation({
    mutationFn: async (data: { quizId: string; newTitle: string }) => {
      const { quizId,newTitle } = data; // Destructure quizId and newTitle from data
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle, topicId }),
      });
  
      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', topicId] });
      toast.success("Quiz edited succesfully")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
   const deleteQuizMutation= useMutation({
      mutationFn: async (quizId: string) => {
        const response = await fetch(`/api/admin/quizzes/${quizId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
  
        const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['quizzes', topicId]});
        toast.success("Quiz deleted succesfully")
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  

  return { getQuizzes, createQuizMutation , editQuizMutation, deleteQuizMutation };
};
