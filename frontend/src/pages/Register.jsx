import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        age: 18,
        track: 'backend'
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
                navigate('/courses');
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(t('register.fail', 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/50 w-full max-w-lg border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-50 rounded-full -ml-24 -mt-24 blur-3xl opacity-50"></div>

                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-black mb-2 text-center text-gray-900 tracking-tight">
                    {t('register.title', 'Create Account')}
                </h2>
                <p className="text-center text-gray-500 mb-10 font-medium">
                    {t('register.subtitle', 'Start your journey to mastery')}
                </p>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm mb-6 border border-rose-100 font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                {t('register.username', 'Username')}
                            </label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 shadow-sm"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                {t('register.email', 'Email')}
                            </label>
                            <input
                                type="email"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 shadow-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            {t('register.password', 'Password')}
                        </label>
                        <input
                            type="password"
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 shadow-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                {t('register.age', 'Age')}
                            </label>
                            <input
                                type="number"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 shadow-sm"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                                min="1"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Track
                            </label>
                            <select
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 shadow-sm appearance-none"
                                value={formData.track}
                                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                            >
                                <option value="backend">Backend (Python)</option>
                                <option value="frontend">Frontend (JS)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-gray-200 hover:shadow-indigo-100 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t('register.title', 'Create Account')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 font-medium text-sm">
                    {t('register.have_account', 'Already have an account?')} {' '}
                    <Link to="/login" className="text-indigo-600 font-black hover:underline underline-offset-4 ml-1">
                        {t('login.submit', 'Login')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
