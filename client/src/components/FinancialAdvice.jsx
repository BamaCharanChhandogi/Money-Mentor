import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api';

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
    // Basic replacements for bold, italic and line breaks
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') // Italic text
      .replace(/\n/g, '<br/>'); // Line breaks
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">AI-Generated Financial Advice</h1>
      {loading ? (
        <p>Loading advice...</p>
      ) : (
        <div
          className="text-gray-700 space-y-4"
          dangerouslySetInnerHTML={{ __html: formatAdvice(advice) }}
        ></div>
      )}
    </div>
  );
};

export default FinancialAdvice;
