import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  CheckCheck,
  Bot
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { soundManager } from '../../utils/audio';

export interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  customerName?: string;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  customerName = 'Customer'
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    soundManager.playNotificationChime();
  };

  const quickPrompts = [
    'How much longer in Bay 1?',
    'Please give extra attention to wheel brake dust',
    'Can I add the rain repellent treatment?',
    'I just arrived in the waiting lounge'
  ];

  return (
    <div id="messaging-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="messaging-sheet"
        className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl max-w-lg w-full h-[85vh] sm:h-[650px] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                AquaGlow Bay Concierge
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Live connection to Bay Technicians
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/60">
          {messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                    <Bot className="w-3 h-3 text-cyan-400" />
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {isCustomer ? 'You' : msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isCustomer
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-tl-xs shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 pt-2 pb-1 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to bay technician..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
