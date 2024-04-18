import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send } from 'lucide-react';

const Chatbot: React.FC<{ token: string }> = ({ token }) => {
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages(prevMessages => [...prevMessages, { text: inputValue, isBot: false }]);
      setInputValue('');
      sendPrompt({ message: inputValue.trim() });
    } else toast.error('Your prompt cannot be empty!');
  };

  const { mutate: sendPrompt, isPending } = useMutation({
    mutationFn: async (variables: { message: string }) => {
      const response = await fetch('/api/users/chat-with-ai', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: variables.message }),
      });

      const data = await response.json();
      if (!response.ok || data?.status == 'error' || data?.status == 'fail') throw Error(data?.message);
      return data?.data;
    },
    onSuccess: (data: string) => {
      setMessages(prevMessages => [...prevMessages, { text: data, isBot: true }]);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while sending the message.');
    },
  });

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-72 max-h-80 overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-300">
        <h3 className="text-lg font-semibold">LangBot</h3>
      </div>
      {messages.length > 0 && (
  <div className="p-4">
    {messages.map((message, index) => (
      <div key={index} className={`mb-2 text-${message.isBot ? 'left' : 'right'}`}>
        <ReactMarkdown className={`bg-${message.isBot ? 'blue' : 'gray'}-100 px-3 py-2 rounded-lg inline-block`} children={message.text} />
      </div>
    ))}
  </div>
)}


    <div className="p-4 border-t border-gray-300 flex justify-around">
  <textarea
  rows={1}
    value={inputValue}
    onChange={handleInputChange}
    placeholder="Type your message..."
    className="flex-grow border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
  />
  <button
    onClick={handleSendMessage}
    className={`${isPending ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold px-2 py-2 mx-1 rounded-lg disabled:opacity-50`}
    disabled={isPending}
  >
    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className='w-4 h-4' />}
  </button>
</div>


    </div>
  );
};

export default Chatbot;
