import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useTopicQueries = (queryClient: QueryClient, subjectId: string) => {
  const {data: getTopics} = useQuery({
    queryKey: ['topics', subjectId],
    queryFn: async () => {
      const response = await fetch(`/api/entities/topics/${subjectId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Unable to fetch topics');
      }

      return response.json();
    },
  });

  const createTopicMutation = useMutation({
    mutationFn: async (data: {name: string, message?: string}) => {
      const {name} = data
      console.log(data)
      const response = await fetch(`/api/admin/topics/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, subject:subjectId }),
      });

      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics', subjectId] });
      toast.success("Topic created succesfully")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  

  // Edit a subject
  const editTopicMutation = useMutation({
    mutationFn: async (data: { topicId: string; newName: string }) => {
      const { topicId,newName } = data; // Destructure categoryId and newName from data
      const response = await fetch(`/api/admin/topics/${topicId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: newName, subjectId }),
      });
  
      const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics', subjectId] });
      toast.success("Topic edited succesfully")
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
   const deleteTopicMutation= useMutation({
      mutationFn: async (topicId: string) => {
        const response = await fetch(`/api/admin/topics/${topicId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
  
        const resData = await response.json();
      if(!response.ok) throw Error(resData.message)
      return resData
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['topics', subjectId]});
        toast.success("Topic deleted succesfully")
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  

  return { getTopics, createTopicMutation , editTopicMutation, deleteTopicMutation };
};
