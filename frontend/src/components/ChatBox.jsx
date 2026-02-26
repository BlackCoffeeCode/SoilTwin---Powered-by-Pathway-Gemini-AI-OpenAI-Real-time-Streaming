import { useState } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ text: input, language: 'en' })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const aiMessage = {
                role: 'assistant',
                content: data.answer || 'No response received.',
                cost_saving: data.cost_saving
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            setError('Failed to get response.');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I\'m having trouble connecting right now.',
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#fcfbf9] rounded-3xl relative overflow-hidden shadow-sm border border-[#e5e0d8] font-sans">
            {/* Header Area - Clean & Minimal */}
            <div className="px-6 py-4 border-b border-[#e5e0d8] bg-[#fcfbf9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_3s_infinite]"></div>
                    <h3 className="text-lg font-serif font-bold text-[#1a2e1a] tracking-tight">Field Advisor</h3>
                </div>
                <div className="text-[10px] uppercase font-bold text-[#8D6E63] tracking-widest bg-[#f4f1ea] px-2 py-1 rounded-md">
                    AI Active
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-container bg-[#fcfbf9]">
                {messages.length === 0 && (
                    <div className="text-center py-12 opacity-80 mt-8">
                        <div className="w-16 h-16 bg-[#f4f1ea] rounded-full flex items-center justify-center mx-auto mb-5 border border-[#e5e0d8]">
                            <Sparkles className="w-6 h-6 text-[#8D6E63]" />
                        </div>
                        <h3 className="text-xl font-serif text-[#1a2e1a] mb-2">Hello, Farmer</h3>
                        <p className="text-[#6D4C41] text-sm max-w-[250px] mx-auto leading-relaxed">
                            I'm your AI advisor. Ask me about soil nutrients, crop health, or weather patterns.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.4s_ease-out]`}>
                        <div className={`
                            max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                            ${msg.role === 'user'
                                ? 'bg-[#1b3216] text-white rounded-tr-sm'
                                : 'bg-[#f4f1ea] text-[#1a2e1a] rounded-tl-sm border border-[#e5e0d8]'
                            }
                            ${msg.isError ? 'bg-red-50 text-red-800 border-red-100' : ''}
                        `}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.cost_saving && (
                                <div className="mt-3 pt-2 border-t border-black/5 flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a2e1a]/70">
                                        Tip:
                                    </span>
                                    <span className="text-xs font-bold text-[#2D5016] bg-white/50 px-2 py-0.5 rounded-md">
                                        {msg.cost_saving}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-[fadeInUp_0.4s_ease-out]">
                        <div className="bg-[#f4f1ea] px-5 py-4 rounded-2xl rounded-tl-sm border border-[#e5e0d8] flex gap-2 items-center shadow-sm">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 bg-[#8D6E63] rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-[#8D6E63] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-[#8D6E63] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-700 font-medium">{error}</span>
                </div>
            )}

            {/* Input Area - Modern Pill Shape */}
            <div className="p-5 bg-[#fcfbf9] border-t border-[#e5e0d8]">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your field..."
                        className="w-full bg-white border border-[#e5e0d8] rounded-full pl-6 pr-14 py-4
                                 text-[#1a2e1a] placeholder-[#8D6E63]/40 
                                 focus:border-[#1b3216] focus:ring-1 focus:ring-[#1b3216]/10
                                 outline-none transition-all shadow-sm font-medium text-sm
                                 group-hover:border-[#d0c8bc]"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 p-2.5 bg-[#1b3216] text-white rounded-full 
                                 hover:bg-[#2D5016] hover:scale-105 active:scale-95 
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200 shadow-md flex items-center justify-center"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-[#8D6E63]/40 font-medium tracking-wide">
                        Powered by Pathway RAG Engine
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
