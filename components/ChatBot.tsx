import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, ChatIcon, LoaderIcon, CloseIcon } from './Icons';
import { ChatMessage, PlantInfo } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface ChatBotProps {
  plant: PlantInfo;
}

const ChatBot: React.FC<ChatBotProps> = ({ plant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session when plant changes
    if (plant) {
      chatSessionRef.current = createChatSession(plant);
      setMessages([{
        id: 'init',
        role: 'model',
        text: `Hi! I see you're interested in ${plant.commonName}. Ask me anything about taking care of it!`,
        timestamp: Date.now()
      }]);
    }
  }, [plant]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text;

      if (responseText) {
          setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              timestamp: Date.now()
          }]);
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the garden right now. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {isOpen ? (
          <CloseIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatIcon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-40 bg-white shadow-2xl transition-all duration-300 ease-in-out border border-slate-200 rounded-2xl overflow-hidden flex flex-col
          ${isOpen 
            ? 'bottom-24 right-4 w-[90vw] h-[60vh] md:right-6 md:w-96 md:h-[600px] opacity-100 translate-y-0' 
            : 'bottom-0 right-6 w-96 h-0 opacity-0 translate-y-10 pointer-events-none'
          }`}
      >
        {/* Header */}
        <div className="bg-emerald-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <ChatIcon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-white">Garden Assistant</h3>
                <p className="text-emerald-100 text-xs">Ask about {plant.commonName}</p>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;