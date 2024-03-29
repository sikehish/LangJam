import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminQuizCarousel from '@/components/AdminQuizCarousel';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/context/AuthContext';
import AdminQuiz from './admin/AdminQuiz';
import UserQuiz from './user/UserQuiz';

const Quiz: React.FC<{ token: string }> = ({ token }) => {
  const { state } = useAuthContext();
  
  return (
    <>
      {state?.user?.isAdmin ? <AdminQuiz token={token} /> : <UserQuiz token={token} />}
    </>
  );
};

export default Quiz;
