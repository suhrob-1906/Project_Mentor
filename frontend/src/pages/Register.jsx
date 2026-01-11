import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        age: 18
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register/', formData);
            navigate('/login');
        } catch (err) {
            const detail = err.response?.data;
            let msg = 'Registration failed';
            if (detail) {
                msg = typeof detail === 'string' ? detail : JSON.stringify(detail);
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-lg border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>
                <h2 className="text-3xl font-black mb-2 text-center text-gray-900 tracking-tight">{t('landing.get_started')}</h2>
                <p className="text-center text-gray-500 mb-8 font-medium">Start your journey to mastery</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">{t('register.username') || 'Username'}</label>
                            <input
                                type="text"
                                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">{t('register.password') || 'Password'}</label>
                        <input
                            type="password"
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">{t('register.age') || 'Age'}</label>
                        <input
                            type="number"
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                            min="1"
                            max="100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-gray-200"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t('landing.get_started')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 font-medium text-sm">
                    {t('register.have_account') || 'Already have an account?'} {' '}
                    <Link to="/login" className="text-indigo-600 font-black hover:underline ml-1">
                        {t('landing.login')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
