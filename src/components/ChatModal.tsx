import React, { useState } from 'react';
import { X, Send, CheckCheck, Clock } from 'lucide-react';
import { KIN_PAWS_LOGO } from '../data/mockData';

interface ChatModalProps {
  onClose: () => void;
  shelterName?: string;
  initialMessage?: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  onClose,
  shelterName = 'Austin Pet Rescue',
  initialMessage = "Hi Sarah! We reviewed your yard specs and Milo is going to thrive. We're excited for Saturday's meet!",
}) => {
  const [messages, setMessages] = useState<{ sender: 'shelter' | 'user'; text: string; time: string }[]>([
    { sender: 'shelter', text: initialMessage, time: '10:42 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMsg = { sender: 'user' as const, text: userMsg, time: 'Just now' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulated warm response from shelter coordinator
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'shelter',
          text: `Thank you Sarah! We noted: "${userMsg}". We have reserved the private play yard at 11:30 AM this Saturday. Bring any questions!`,
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2421]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e8e2da] overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 bg-[#f9f3eb] border-b border-[#e8e2da] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-xs border border-[#ddc0b8]/30 flex items-center justify-center">
              <img src={KIN_PAWS_LOGO} alt="Shelter" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1d1b17]">{shelterName}</h3>
              <p className="text-xs text-[#376851] flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#376851]"></span>
                Adoption Coordinator Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#eee7e0] hover:bg-[#e8e2da] text-[#56423c] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fff8f1]">
          <div className="text-center my-1">
            <span className="text-[11px] text-[#8a726b] bg-[#f3ede5] px-2.5 py-0.5 rounded-full">
              Application Ref: #AP-MILO-892
            </span>
          </div>

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#9c3e1f] text-white rounded-br-xs'
                    : 'bg-white text-[#1d1b17] rounded-bl-xs border border-[#e8e2da] shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#8a726b] mt-1 flex items-center gap-1 px-1">
                {m.time}
                {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#376851]" />}
              </span>
            </div>
          ))}
        </div>

        {/* Reply Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#e8e2da] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to the shelter..."
            className="flex-1 bg-[#f9f3eb] text-sm text-[#1d1b17] rounded-lg px-3.5 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all placeholder-[#8a726b]"
          />
          <button
            type="submit"
            className="bg-[#9c3e1f] hover:bg-[#823217] text-white p-2.5 rounded-lg transition-colors shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
