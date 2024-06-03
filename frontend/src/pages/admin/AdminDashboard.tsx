import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader';

const AdminDashboard: React.FC= () => {
  const navigate = useNavigate();
  const { data: gatheredData, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      return response.json();
    },
  });

  if (isLoading) {
    return<Loader />
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const { stats } = gatheredData;

  return (
    <div className="container mx-auto pt-12">
      <h1 className="text-3xl font-semibold mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center lg:mx-20">
        {Object.entries(stats).map(([key, value], index) => (
          <Card key={index} className="my-2 bg-blue-100 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{convertCamelCaseToSpacedString(key)}</CardTitle>
              <CardContent className="text-lg font-bold text-blue-900">{value as React.ReactNode}</CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-16 mb-8">
        <Button className="px-8 py-6 mx-4" onClick={() => { navigate('/categories') }}>View Categories</Button>
        <Button className="px-8 py-6 mx-4" onClick={() => { navigate('/admin/new-quiz') }}>New Quiz</Button>
      </div>
    </div>
  );
};

const convertCamelCaseToSpacedString = (str: string) => {
  const words = str.replace(/([a-z])([A-Z])/g, '$1 $2').split(/(?=[A-Z])/);
  const spacedString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return spacedString;
};

export default AdminDashboard;
