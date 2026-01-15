import { useState } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const isRu = (i18n.language || 'en').startsWith('ru');

    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: text }]);
        setLoading(true);

        try {
            const res = await api.post('/api/mentor/chat/', {
                message: text
            });
            setMessages((prev) => [...prev, { role: 'mentor', content: res.data.response }]);
        } catch (err) {
            console.error('Chat error', err);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'mentor',
                    content: isRu
                        ? 'Извини, я временно не могу ответить. Попробуй позже! 🛠️'
                        : "Sorry, I can't answer right now. Please try again later! 🛠️"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <header className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isRu ? 'Назад' : 'Back'}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-600 text-white">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-widest text-gray-900">
                                {isRu ? 'Чат с наставником' : 'AI Mentor Chat'}
                            </h1>
                            <p className="text-[11px] text-gray-500 font-bold">
                                {isRu
                                    ? 'Спроси совета по обучению, карьере или коду'
                                    : 'Ask anything about learning, career or your code'}
                            </p>
                        </div>
                    </div>
                    <div className="w-10" />
                </div>
            </header>

            <main className="flex-1 flex justify-center px-4 py-6">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50/60">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <Bot className="w-12 h-12 text-indigo-400 mb-4 opacity-70" />
                                <p className="text-sm font-bold text-gray-500 mb-2">
                                    {isRu
                                        ? 'Просто напиши вопрос — про Python, фронтенд, карьеру или учебный план.'
                                        : 'Ask any question — about Python, frontend, career or your learning path.'}
                                </p>
                                <p className="text-xs text-gray-400 font-medium">
                                    {isRu
                                        ? 'Я не привязан к уроку — можно общаться свободно.'
                                        : "This chat isn't tied to a specific lesson — it's free-form help."}
                                </p>
                            </div>
                        )}

                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm flex items-start gap-2
                                        ${
                                            m.role === 'user'
                                                ? 'bg-gray-900 text-white rounded-tr-none'
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    <div className="mt-0.5">
                                        {m.role === 'user' ? (
                                            <User className="w-3.5 h-3.5 opacity-60" />
                                        ) : (
                                            <Bot className="w-3.5 h-3.5 text-indigo-500 opacity-80" />
                                        )}
                                    </div>
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-2xl rounded-tl-none border bg-white flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                    {isRu ? 'Думаю...' : 'Thinking...'}
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="border-t border-gray-100 bg-white px-4 py-3">
                        <div className="flex items-center gap-2 max-w-3xl mx-auto">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    isRu
                                        ? 'Напиши вопрос... (например: с чего начать фронтенд?)'
                                        : 'Type your question... (e.g. how to start with frontend?)'
                                }
                                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-800"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isRu ? 'Отправить' : 'Send'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

