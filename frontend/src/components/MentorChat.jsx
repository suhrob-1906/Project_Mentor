import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, X, MessageSquare, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import api from '../api';

export default function MentorChat({ lessonSlug, userCode, isChild }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen, lessonSlug]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isMinimized]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/api/mentor/chat/?lesson_slug=${lessonSlug}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await api.post('/api/mentor/chat/', {
                lesson_slug: lessonSlug,
                message: userMsg,
                code: userCode
            });
            setMessages(prev => [...prev, { role: 'mentor', content: res.data.response }]);
        } catch (err) {
            console.error("Chat error", err);
            setMessages(prev => [...prev, {
                role: 'mentor',
                content: "Извини, я временно не могу ответить. Попробуй позже! 🛠️"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 z-50 group
                    ${isChild ? 'bg-yellow-400 border-4 border-black' : 'bg-indigo-600 text-white'}`}
            >
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    AI
                </div>
                <MessageSquare className={`w-8 h-8 ${isChild ? 'text-black' : 'text-white'}`} />
            </button>
        );
    }

    const containerClasses = isMinimized
        ? "h-14 w-72"
        : "h-[500px] w-[350px] md:w-[400px]";

    return (
        <div className={`fixed bottom-6 right-6 flex flex-col shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 z-50 border-4 border-opacity-20
            ${containerClasses}
            ${isChild ? 'bg-white border-black font-["Outfit"] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-indigo-100 font-sans'}`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-3 cursor-pointer
                ${isChild ? 'bg-yellow-400 border-b-4 border-black' : 'bg-indigo-600 text-white'}`}
                onClick={() => isMinimized && setIsMinimized(false)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-xl ${isChild ? 'bg-white' : 'bg-white/20'}`}>
                        <Bot className={`w-5 h-5 ${isChild ? 'text-black' : 'text-white'}`} />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">
                        {isChild ? 'Smart Mentor' : 'AI Mentor Pro'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:opacity-75">
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:opacity-75">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
                    >
                        {messages.length === 0 && (
                            <div className="text-center py-10 px-6">
                                <Bot className={`w-12 h-12 mx-auto mb-4 opacity-20 ${isChild ? 'text-indigo-500' : 'text-gray-400'}`} />
                                <p className={`text-sm font-bold opacity-40 italic ${isChild ? 'text-indigo-900' : 'text-gray-500'}`}>
                                    {isChild ? "Привет, маленький гений! Задай мне любой вопрос по уроку! 🚀" : "Welcome. I'm here to help with your code and concepts. What's on your mind?"}
                                </p>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${m.role === 'user'
                                        ? (isChild ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-gray-800 text-white rounded-tr-none')
                                        : (isChild ? 'bg-white border-2 border-gray-100 text-gray-800 rounded-tl-none' : 'bg-white border text-gray-700 rounded-tl-none')
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className={`px-4 py-3 rounded-2xl rounded-tl-none border flex items-center gap-2 bg-white`}>
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                    <span className="text-xs font-bold text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className={`p-4 bg-white border-t ${isChild ? 'border-black/5' : ''}`}>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isChild ? "Напиши вопрос..." : "Ask your mentor..."}
                                className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm
                                    ${isChild ? 'border-2 border-black focus:ring-yellow-400' : 'focus:ring-indigo-500'}`}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={`p-2.5 rounded-xl transition-all
                                    ${isChild
                                        ? 'bg-indigo-500 text-white border-2 border-black disabled:opacity-50'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-200'}`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
