import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Upload, Code, Loader2, Play } from 'lucide-react';

export default function Dashboard() {
    const [codeText, setCodeText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!codeText.trim()) return;
        setLoading(true);
        try {
            const res = await api.post('/api/analyze/', { code_text: codeText });
            // Clear loading state BEFORE navigation to avoid unmounted component update
            setLoading(false);
            navigate('/results', { state: { data: res.data } });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Analysis failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">MentorAI Dashboard</h1>
                <button onClick={() => { localStorage.clear(); navigate('/login') }} className="text-gray-500 hover:text-red-500 text-sm">Logout</button>
            </nav>

            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <Code className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">New Analysis</h2>
                            <p className="text-gray-500 text-sm">Paste your code below to check your level.</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <textarea
                            className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="// Paste your Python code here..."
                            value={codeText}
                            onChange={(e) => setCodeText(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition">
                            <Upload className="w-5 h-5" />
                            <span className="text-sm font-medium">Upload File (Optional)</span>
                        </button>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !codeText}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Play className="w-5 h-5" /> Run Analysis</>}
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-8 text-center">
                    <p className="text-gray-400 text-sm">Supported: Python (Full Analysis), JavaScript (Beta)</p>
                </div>
            </div>
        </div>
    );
}
