import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getFinancialAdvice(userContext, userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an AI financial advisor. Use the following user context to provide personalized financial advice:

${JSON.stringify(userContext, null, 2)}

User question: ${userMessage}

Provide a concise, helpful response addressing the user's question and considering their financial situation. 
If the question is not related to finance, politely redirect the conversation to financial topics.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};