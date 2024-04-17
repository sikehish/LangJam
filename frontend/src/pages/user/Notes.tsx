import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Note {
  _id: string;
  title: string;
  description: string;
}

function Notes({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { data: notesData, isLoading, isError } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch(`/api/users/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to fetch your notes :(');
      }
      return response.json();
    },
  });

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/users/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (!response.ok) throw Error(resData.message);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted!');
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 mt-8">Your Notes</h1>
      {isError && <p className="text-red-600">Error fetching notes. Please try again later.</p>}
      {!isError && isLoading && <p>Loading...</p>}
      {!isError && !isLoading && notesData?.data?.length === 0 && (
        <p className="text-gray-600">You have no notes.</p>
      )}
      {!isError && !isLoading && notesData?.data?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {notesData?.data?.map((note: Note) => (
            <div key={note._id} className="bg-slate-100 rounded-lg shadow-md p-6">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-sm text-red-700 transition-transform transform hover:scale-110"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="text-gray-700">{note.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
