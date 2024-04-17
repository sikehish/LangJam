import { useQuery } from '@tanstack/react-query';
import React from 'react';

// Define the Note interface
interface Note {
  id: string;
  title: string;
  description: string;
}

function Notes({ token }: { token: string }) {
  // Fetch notes data using useQuery
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 mt-8">Your Notes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {notesData?.data?.map((note: Note) => (
          <div key={note.id} className="bg-slate-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
            <p className="text-gray-700">{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
