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
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2" style={{ maxHeight: '400px' }}>
                {messages.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                        <p className="text-sm">Ask me anything about your soil health!</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : msg.isError
                                ? 'bg-red-900/20 border border-red-500/30 text-red-200'
                                : 'bg-slate-800 text-slate-100'
                            }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.cost_saving && (
                                <p className="text-xs text-emerald-400 mt-1">💰 {msg.cost_saving}</p>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 rounded-xl px-4 py-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-xs">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200">{error}</p>
                </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about fertilizers, NPK levels..."
                    className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500/50 outline-none"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                    <Send className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
