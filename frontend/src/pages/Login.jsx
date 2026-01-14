import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, ShieldCheck } from 'lucide-react';
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
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            console.error("Login error:", err);
            setError(t('login.fail', 'Invalid credentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 w-full max-w-md border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>

                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-black mb-2 text-center text-gray-900 tracking-tight">
                    {t('login.title', 'Welcome Back')}
                </h2>
                <p className="text-center text-gray-500 mb-8 font-medium">
                    {t('register.subtitle', 'Start your journey to mastery')}
                </p>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm mb-6 border border-rose-100 font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                            {t('register.username', 'Username')}
                        </label>
                        <input
                            type="text"
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 placeholder:text-gray-300 shadow-sm"
                            placeholder={t('login.username_ph', 'Your username')}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                            {t('register.password', 'Password')}
                        </label>
                        <input
                            type="password"
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 placeholder:text-gray-300 shadow-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-gray-200 hover:shadow-indigo-100 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t('login.submit', 'Log In')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 font-medium text-sm">
                    {t('login.no_account', "Don't have an account?")} {' '}
                    <Link to="/register" className="text-indigo-600 font-black hover:underline underline-offset-4 ml-1">
                        {t('login.register', 'Register')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
