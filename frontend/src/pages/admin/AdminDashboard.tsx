import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { useQuery } from "@tanstack/react-query";
  import React, { ReactNode } from "react";
  import Categories from './Categories';
  import { Button } from "@/components/ui/button";
  import { useNavigate } from "react-router-dom";
  
  const AdminDashboard: React.FC<{ token: string }> = ({ token }) => {
    const navigate = useNavigate();
    const { data: gatheredData, isLoading, isError } = useQuery({
      queryKey: ["adminStats"],
      queryFn: async () => {
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.json();
      },
    });
  
    if (isLoading) {
      return <div>Loading...</div>;
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
                <CardContent>{value as ReactNode}</CardContent>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-16 mb-8">
          <Button className="px-8 py-6" onClick={() => { navigate("/admin/categories") }}>View Categories</Button>
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
  