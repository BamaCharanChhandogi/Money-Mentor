import React, { useState } from 'react';
import { BASE_URL } from '../../api';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Toggle for chatbox visibility

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch(`${BASE_URL}/financial-chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.response || 'Error fetching advice.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'bot', content: 'An error occurred.' }]);
    }

    setInput('');
  };

  return (
    <>
      {/* Chat Icon */}
      <div
        className="fixed bottom-5 right-5 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg z-[1000]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20h9M12 20l-3-3m3 3l3-3M15 7H9m6 4H9m6 4H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-lg border border-gray-300 rounded-lg flex flex-col z-[1000]">
          <div className="flex justify-between items-center bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-bold">Chatbot</h3>
            <button className="text-white font-bold" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <p
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-300 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
