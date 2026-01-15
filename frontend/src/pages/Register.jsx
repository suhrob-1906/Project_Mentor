import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, UserPlus, Sparkles, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        age: 18,
        track: 'backend',
        // Backend ожидает эти поля (есть в сериалайзере), используем разумные значения по умолчанию
        primary_language: 'python',
        goal: 'job'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const resp = await api.post('/auth/register/', formData);
            if (resp.data.access) {
                localStorage.setItem('access_token', resp.data.access);
                localStorage.setItem('refresh_token', resp.data.refresh);
                // Redirect directly to course based on track
                const courseSlug = formData.track === 'backend' ? 'backend' : 'frontend';
                navigate(`/courses/${courseSlug}`);
            } else {
                navigate('/login');
            }
        } catch (err) {
            // Показываем в консоли подробный ответ бэкенда, чтобы видеть, почему 400
            console.error("Registration error:", err.response?.data || err);

            // Парсим конкретные ошибки от бэкенда
            const errors = err.response?.data;
            if (errors) {
                if (errors.username) {
                    setError(t('register.username_taken', 'This username is already taken'));
                } else if (errors.email) {
                    setError(t('register.email_taken', 'This email is already registered'));
                } else if (errors.password) {
                    setError(errors.password[0] || t('register.password_error', 'Password is too weak'));
                } else {
                    setError(t('register.fail', 'Registration failed. Please try again.'));
                }
            } else {
                setError(t('register.fail', 'Registration failed. Please try again.'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4 py-12 pattern-grid">
            <div className="bg-white p-8 md:p-10 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg relative overflow-hidden transform transition-all hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">

                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Sparkles className="w-24 h-24 text-indigo-500" />
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div className="mb-6 p-4 bg-indigo-500 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-[-6deg]">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-center text-black tracking-tight uppercase">
                        {t('register.title', 'Create Account')}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                {t('register.username', 'Username')}
                            </label>
                            <input
                                type="text"
                                className="w-full px-5 py-3 bg-white border-2 border-gray-200 focus:border-black rounded-xl transition-all outline-none font-bold text-gray-800 placeholder-gray-300"
                                placeholder="neo_coder"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                {t('register.email', 'Email')}
                            </label>
                            <input
                                type="email"
                                className="w-full px-5 py-3 bg-white border-2 border-gray-200 focus:border-black rounded-xl transition-all outline-none font-bold text-gray-800 placeholder-gray-300"
                                placeholder="hello@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
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
                        <p className="text-[10px] text-gray-400 font-bold mt-1 ml-1">Min. 8 chars, mixed case recommended.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                {t('register.age', 'Age')}
                            </label>
                            <input
                                type="number"
                                className="w-full px-5 py-3 bg-white border-2 border-gray-200 focus:border-black rounded-xl transition-all outline-none font-bold text-gray-800"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                                required
                                min="1"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                Track
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-5 py-3 bg-white border-2 border-gray-200 focus:border-black rounded-xl transition-all outline-none font-bold text-gray-800 appearance-none cursor-pointer"
                                    value={formData.track}
                                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                                >
                                    <option value="backend">Backend (Python)</option>
                                    <option value="frontend">Frontend (JS)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <Wand2 className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg border-b-[6px] border-indigo-800 hover:bg-indigo-500 hover:border-indigo-700 active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-2 mt-6 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t('register.title', 'Create Account')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400 font-bold text-sm">
                    {t('register.have_account', 'Already have an account?')} {' '}
                    <Link to="/login" className="text-indigo-600 font-black hover:underline underline-offset-4 ml-1">
                        {t('login.submit', 'Login')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
