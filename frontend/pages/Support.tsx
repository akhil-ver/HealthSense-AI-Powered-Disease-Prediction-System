import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const Support = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AI wellness coach. Ask me anything about your current health status or how to improve your lifestyle.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/chat', { message: userMessage });
      setMessages(prev => [...prev, { text: res.data.text, sender: 'ai' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my medical database. Please try again.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Support Coach</h1>
        <p className="text-slate-500 dark:text-slate-400">Chat with your personalized AI health assistant.</p>
      </div>

      <div className="flex-1 glass dark:glass-dark rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex flex-shrink-0 items-center justify-center text-white shadow-md">
                  <Bot size={20} />
                </div>
              )}
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-200 dark:shadow-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex flex-shrink-0 items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-none flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Coach is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your diet, sleep, or symptoms..."
              className="w-full p-4 pr-14 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;
