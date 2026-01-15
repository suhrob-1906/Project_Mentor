import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login/', formData);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);

            // Fetch user profile to get their track
            try {
                const profileRes = await api.get('/auth/profile/');
                const track = profileRes.data.track || 'backend';
                const courseSlug = track === 'backend' ? 'backend' : 'frontend';
                navigate(`/courses/${courseSlug}`);
            } catch {
                // Fallback to dashboard if profile fetch fails
                navigate('/dashboard');
            }

            window.location.reload();
        } catch (err) {
            console.error("Login error:", err);
            setError(t('login.fail', 'Invalid credentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4 pattern-grid">
            <div className="bg-white p-8 md:p-10 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative overflow-hidden transform transition-all hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">

                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Sparkles className="w-24 h-24 text-indigo-500" />
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div className="mb-6 p-4 bg-indigo-500 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-[6deg]">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-center text-black tracking-tight uppercase">
                        {t('login.title', 'Welcome Back')}
                    </h2>
                    <p className="text-center text-gray-500 font-bold mt-2">
                        {t('register.subtitle', 'Start your journey to mastery')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-4 rounded-xl border-2 border-black text-sm mb-6 font-bold animate-shake flex items-center gap-2">
                        <span className="text-xl">🚨</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            {t('register.username', 'Username')}
                        </label>
                        <input
                            type="text"
                            className="w-full px-5 py-3 bg-white border-2 border-gray-200 focus:border-black rounded-xl transition-all outline-none font-bold text-gray-800 placeholder-gray-300"
                            placeholder={t('login.username_ph', 'Your username')}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            {t('register.password', 'Password')}
                        </label>
                        <input
                            type="password"
                            className="w-full px-5 py-3 bg-white border-2 border-gray-200 focus:border-black rounded-xl transition-all outline-none font-bold text-gray-800 placeholder-gray-300"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg border-b-[6px] border-indigo-800 hover:bg-indigo-500 hover:border-indigo-700 active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-2 mt-6 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t('login.submit', 'Log In')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400 font-bold text-sm">
                    {t('login.no_account', "Don't have an account?")} {' '}
                    <Link to="/register" className="text-indigo-600 font-black hover:underline underline-offset-4 ml-1">
                        {t('login.register', 'Register')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
