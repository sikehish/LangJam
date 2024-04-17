import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/context/AuthContext';
import AdminQuiz from './admin/AdminQuiz';
import UserQuiz from './user/UserQuiz';
import { Bot, X } from 'lucide-react';
import Chatbot from '@/components/ChatBot';

const Quiz: React.FC<{ token: string }> = ({ token }) => {
  const { state } = useAuthContext();
  const [showChatbot, setShowChatbot] = useState(false);
  
  return (
    <>
      {state?.user?.isAdmin ? <AdminQuiz token={token} /> : <UserQuiz token={token} />}
      {showChatbot && <Chatbot />} 
      <button className='bg-blue-800 p-3 rounded-full text-white fixed bottom-4 right-4' onClick={()=>{
        setShowChatbot(prevState => !prevState);
      }}>
        {showChatbot ? <X /> : <Bot />} 
      </button>
    </>
  );
};

export default Quiz;
