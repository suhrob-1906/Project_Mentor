import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
    Code2, Terminal, Cpu, Globe, ArrowRight,
    BookOpen, Sparkles, Check, Code, Rocket,
    Lock, Star, Play, Award, Zap, AlertCircle, ChevronLeft, Send
} from 'lucide-react';

export default function Homework() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [homeworks, setHomeworks] = useState([]);
    const [selectedHw, setSelectedHw] = useState(null);
    const [submission, setSubmission] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [language] = useState(state?.language || 'python');

    useEffect(() => {
        fetchHomeworks();
    }, [language]);

    const fetchHomeworks = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`http://127.0.0.1:8000/api/mentor/homework/?language=${language}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHomeworks(res.data);
            if (res.data.length > 0 && !selectedHw) {
                setSelectedHw(res.data[0]);
                setSubmission(res.data[0].submission || '');
            }
        } catch (err) {
            console.error("Failed to fetch homeworks", err);
        }
    };

    const submitHomework = async () => {
        if (!selectedHw || !submission) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.post(`http://127.0.0.1:8000/api/mentor/homework/`, {
                id: selectedHw.id,
                submission: submission
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResult(res.data);
            fetchHomeworks();
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans flex flex-col">
            {/* Header */}
            <nav className="bg-[#1E293B] border-b border-gray-800 px-8 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                        <span className="font-bold uppercase tracking-widest text-xs">{t('common.back', 'Back to Roadmap')}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                            <Code className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase italic">Homework Lab</span>
                    </div>
                    <div className="w-24"></div> {/* Spacer */}
                </div>
            </nav>

            <div className="flex-grow container mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Tasks List */}
                <div className="lg:col-span-4 space-y-4">
                    <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        {t('homework.your_tasks', 'Active Assignments')}
                    </h2>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {homeworks.map((hw) => (
                            <button
                                key={hw.id}
                                onClick={() => {
                                    setSelectedHw(hw);
                                    setSubmission(hw.submission || '');
                                    setResult(null);
                                }}
                                className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex flex-col gap-3 group relative overflow-hidden ${selectedHw?.id === hw.id
                                    ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                                    : 'bg-[#1E293B] border-transparent hover:border-indigo-500/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${hw.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                                        hw.status === 'failed' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white/60'
                                        }`}>
                                        {hw.category}
                                    </span>
                                    {hw.status === 'passed' && <Check className="w-4 h-4 text-emerald-400" />}
                                </div>
                                <p className={`font-bold line-clamp-2 ${selectedHw?.id === hw.id ? 'text-white' : 'text-gray-300'}`}>
                                    {hw.task.substring(0, 60)}...
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content: Code Editor View */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {selectedHw ? (
                        <>
                            {/* Task Description Card */}
                            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                                    {t('homework.mentor_task', 'AI Mentor Challenge')}
                                </h3>
                                <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-line font-medium border-l-4 border-indigo-500 pl-6 py-2">
                                    {selectedHw.task}
                                </div>
                            </div>

                            {/* Editor Section */}
                            <div className="flex-grow flex flex-col bg-[#1E293B] rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden min-h-[400px]">
                                <div className="bg-[#0F172A]/50 px-8 py-3 flex justify-between items-center border-b border-gray-800">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{language} editor</span>
                                </div>
                                <textarea
                                    value={submission}
                                    onChange={(e) => setSubmission(e.target.value)}
                                    placeholder={t('homework.placeholder', '// Write your code here...')}
                                    className="flex-grow bg-transparent p-8 font-mono text-indigo-300 text-lg outline-none resize-none placeholder-gray-700"
                                />
                                <div className="p-6 bg-[#0F172A]/30 border-t border-gray-800 flex justify-end gap-4">
                                    <button
                                        onClick={submitHomework}
                                        disabled={loading || !submission.trim()}
                                        className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-3 active:scale-95"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {t('homework.submit', 'Check with Mentor')}
                                    </button>
                                </div>
                            </div>

                            {/* Result/Feedback Section */}
                            {(result || selectedHw.feedback) && (
                                <div className="space-y-6">
                                    <div className={`p-8 rounded-[2.5rem] border-2 animate-in slide-in-from-bottom-4 duration-500 ${(result?.passed || selectedHw.status === 'passed') ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                                        }`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${(result?.passed || selectedHw.status === 'passed') ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                                    }`}>
                                                    {(result?.passed || selectedHw.status === 'passed') ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black uppercase tracking-tight">
                                                        {(result?.passed || selectedHw.status === 'passed') ? t('homework.passed', 'Challenge Passed!') : t('homework.failed', 'Needs Improvement')}
                                                    </h4>
                                                    <span className="text-xs font-bold opacity-60">AI Mentor Feedback</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mr-2">{t('homework.attempts', 'Attempts')}:</span>
                                                <span className="font-mono font-bold text-indigo-400">{result?.attempts || selectedHw.attempts || 0} / 3</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed font-medium whitespace-pre-line">
                                            {result?.feedback || selectedHw.feedback}
                                        </p>
                                    </div>

                                    {/* Master Solution (Visible after 3 attempts or if already generated) */}
                                    {(result?.correct_solution || selectedHw.correct_solution) && (
                                        <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-8 rounded-[2.5rem] animate-in zoom-in-95 duration-700">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-indigo-500 p-2 rounded-lg">
                                                    <Award className="w-6 h-6 text-white" />
                                                </div>
                                                <h4 className="text-xl font-black uppercase tracking-tight text-white">
                                                    {t('homework.master_solution', 'Master Solution & Deep Explanation')}
                                                </h4>
                                            </div>
                                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed font-medium whitespace-pre-line bg-black/30 p-6 rounded-2xl border border-white/5">
                                                {result?.correct_solution || selectedHw.correct_solution}
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-bold italic">
                                                <Zap className="w-4 h-4" />
                                                <span>{t('homework.note', 'Note: Use this solution to understand the concepts and move forward!')}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                            <Rocket className="w-20 h-20 mb-6 text-indigo-400 animate-bounce-slow" />
                            <h3 className="text-2xl font-black uppercase tracking-widest">{t('homework.empty', 'No Task Selected')}</h3>
                            <p className="font-medium max-w-sm mt-2">{t('homework.empty_desc', 'Pass a level test to receive your first practical mission!')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
