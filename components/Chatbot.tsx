import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

// Simplified markdown to HTML conversion
const markdownToHtml = (text: string) => {
    // Bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italics *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code `text`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    // Lists (simple)
    text = text.replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>');
    text = text.replace(/<\/ul><ul>/g, '');
    return text;
}


const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

  useEffect(() => {
    if (!chat) {
        try {
            if (!API_KEY) {
                console.warn("Gemini API key is missing in environment variables (process.env.API_KEY). Chatbot will be disabled.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a friendly and helpful student guidance counselor AI. Your name is Guidance AI. You assist students with questions about career paths, college selection, study tips, and personal development. Keep your answers concise, encouraging, and easy to understand.',
                },
            });
            setChat(newChat);
             setMessages([
                { role: 'model', content: 'Hello! I am Guidance AI. How can I help you today? Feel free to ask me about careers, colleges, or study advice.' }
            ]);
        } catch (error) {
            console.error("Failed to initialize Gemini Chat:", error);
            setMessages([{ role: 'model', content: 'Sorry, I am having trouble connecting. Please try again later.' }]);
        }
    }
  }, [chat, API_KEY]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const currentInput = input;
    // Add user message and a loading placeholder for the model in one go
    setMessages(prev => [...prev, userMessage, { role: 'model', content: '' }]);
    setInput('');
    setIsLoading(true);
    
    try {
        const responseStream = await chat.sendMessageStream({ message: currentInput });
        
        let fullResponse = "";
        for await (const chunk of responseStream) {
            fullResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                // Update the content of the last message (the placeholder)
                if (newMessages.length > 0) {
                   newMessages[newMessages.length - 1].content = fullResponse;
                }
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        const errorText = String(error);
        let errorMessage = 'Sorry, I encountered an error. Please try again.';
        if (errorText.includes("RESOURCE_EXHAUSTED") || errorText.includes("429")) {
            errorMessage = "I've hit my request limit for now. Please try again in a little while.";
        }

        setMessages(prev => {
            const newMessages = [...prev];
            // Replace the loading placeholder with the error message
            if (newMessages.length > 0) {
               newMessages[newMessages.length - 1].content = errorMessage;
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (!API_KEY) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-110 z-50"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          <header className="bg-neutral text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Guidance AI Chat</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-neutral-800 rounded-bl-none'
                    }`}
                  >
                     {msg.content === '' ? (
                       <div className="flex items-center space-x-2">
                           <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                     ) : (
                        <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }}></div>
                     )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                type="submit"
                className="bg-primary text-white p-3 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;