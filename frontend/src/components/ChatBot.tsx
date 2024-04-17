import React, { useState } from 'react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages(prevMessages => [...prevMessages, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-16 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-72 max-h-80 overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-300">
        <h3 className="text-lg font-semibold">Chatbot</h3>
      </div>
      <div className="p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <p className="bg-gray-100 px-3 py-2 rounded-lg inline-block">{message}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
