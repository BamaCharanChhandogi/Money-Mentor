import React, { useState, useRef, useEffect } from 'react';
import { BASE_URL } from '../../api';
import { 
  MessageCircle, 
  Send, 
  X, 
  ArrowDown, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m your financial assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
      const botMessage = { 
        role: 'bot', 
        content: data.response || 'I apologize, but I couldn\'t process your request.',
        type: data.type || 'default'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Oops! There was a network error. Please try again.',
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const renderMessageIcon = (type) => {
    switch(type) {
      case 'advice':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'warning':
        return <RefreshCw className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
          AI
        </span>
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-lg font-bold">AI Financial Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] px-4 py-3 rounded-2xl 
                    ${msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800 shadow-sm'}
                  `}
                >
                  <div className="flex items-start space-x-2">
                    {msg.role === 'bot' && renderMessageIcon(msg.type)}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about finances..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`
                bg-gradient-to-br from-indigo-500 to-purple-600 text-white 
                rounded-full p-2 hover:opacity-90 transition-all
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;