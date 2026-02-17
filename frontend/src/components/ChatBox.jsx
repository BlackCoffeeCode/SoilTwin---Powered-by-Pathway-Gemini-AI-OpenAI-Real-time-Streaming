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
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ text: input, language: 'en' })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = {
                role: 'assistant',
                content: data.answer || 'No response received.',
                cost_saving: data.cost_saving
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            setError('Failed to get response. The AI service may be temporarily unavailable.');
            // Add fallback response
            const fallbackMessage = {
                role: 'assistant',
                content: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again in a moment.',
                isError: true
            };
            setMessages(prev => [...prev, fallbackMessage]);
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
        <div className="flex flex-col h-full bg-[#FBF8F3]/50 rounded-xl relative overflow-hidden">
            {/* Thread Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#2D5016 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container relative z-10">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#7CB342] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7CB342]/20">
                            <Sparkles className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <h3 className="text-xl font-serif text-[#2D5016] mb-2">Soil Health Assistant</h3>
                        <p className="text-[#6D4C41]/70 text-sm max-w-[200px] mx-auto">
                            Ask me about nutrient management, crop rotation, or disease prevention.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'} ${msg.isError ? 'border-red-500/50 bg-red-50' : ''} fade-in-up`}>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold mb-1 opacity-70">
                                {msg.role === 'user' ? 'You' : 'Field Advisor'}
                            </span>
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {msg.cost_saving && (
                                <div className="mt-3 pt-2 border-t border-black/5 flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-600 bg-amber-100/50 px-2 py-1 rounded-full border border-amber-200">
                                        💰 Saving Opportunity
                                    </span>
                                    <span className="text-sm font-medium text-[#2D5016]">
                                        {msg.cost_saving}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat-message ai fade-in-up w-fit">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5 py-1">
                                <span className="w-2 h-2 bg-[#7CB342] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-[#7CB342] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-[#7CB342] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <span className="text-xs text-[#6D4C41]/60">Analyzing soil data...</span>
                        </div>
                    </div>
                )}

                {/* Scroll anchor */}
                <div id="end-of-chat"></div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white/60 backdrop-blur-md border-t border-[#6D4C41]/10">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about NPK levels, irrigation..."
                        className="flex-1 bg-white border border-[#6D4C41]/20 rounded-xl px-4 py-3 
                                 text-[#2D5016] placeholder-[#6D4C41]/40 
                                 focus:border-[#7CB342] focus:ring-2 focus:ring-[#7CB342]/20 
                                 outline-none transition-all shadow-inner"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-gradient-to-br from-[#2D5016] to-[#7CB342] 
                                 text-white rounded-xl shadow-lg shadow-[#7CB342]/30 
                                 hover:shadow-[#7CB342]/50 hover:scale-105 active:scale-95 
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none 
                                 transition-all duration-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-[#6D4C41]/40 font-medium tracking-wide uppercase">
                        Powered by OpenAI • Pathway RAG Engine
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
