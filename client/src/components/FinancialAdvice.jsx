import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api';
import { Loader } from 'lucide-react';

const FinancialAdvice = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/financial-advice/ai-advice`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error('Error fetching advice:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  // Helper function to format the advice string
  const formatAdvice = (text) => {
    // Basic replacements for bold, italic, and line breaks
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-green-600">$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>') // Italic
      .replace(/\n/g, '<br/>'); // Line breaks
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-3xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          AI-Generated Financial Advice
        </h1>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-16 h-16 text-green-500 animate-spin" />
          </div>
        ) : (
          <div
            className="text-gray-700 text-lg leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: formatAdvice(advice) }}
          ></div>
        )}
        <button
          onClick={fetchAdvice}
          className="block mt-10 mx-auto bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-green-600 hover:to-blue-700 transition"
        >
          Refresh Advice
        </button>
      </div>
    </div>
  );
};

export default FinancialAdvice;
