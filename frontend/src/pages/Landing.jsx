import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Terminal, Code, Cpu, ArrowRight, Sparkles, Languages } from 'lucide-react';

export default function Landing() {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                    <span className="text-2xl font-black tracking-tight text-gray-900">
                        Mentor<span className="text-indigo-600">AI</span>
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={toggleLanguage} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 flex items-center gap-2 font-bold text-sm">
                        <Languages className="w-4 h-4" />
                        {i18n.language.toUpperCase()}
                    </button>
                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">{t('landing.login')}</Link>
                    <Link to="/register" className="px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition font-black text-sm shadow-xl shadow-gray-200">
                        {t('landing.get_started')}
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-40 overflow-hidden">
                <div className="absolute inset-0 bg-[#fafafa]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-6 relative text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black tracking-widest uppercase mb-8 border border-indigo-100/50 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        {t('landing.features.analysis')}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[0.9]">
                        {t('landing.title')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600">
                            {t('landing.subtitle')}
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        {t('landing.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="group px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-gray-800 transition shadow-2xl hover:shadow-gray-300 flex items-center justify-center gap-3">
                            {t('landing.get_started')}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Code className="w-10 h-10 text-indigo-600" />,
                                title: t('landing.features.analysis'),
                                color: "bg-indigo-50"
                            },
                            {
                                icon: <Terminal className="w-10 h-10 text-violet-600" />,
                                title: t('landing.features.roadmap'),
                                color: "bg-violet-50"
                            },
                            {
                                icon: <Cpu className="w-10 h-10 text-pink-600" />,
                                title: t('landing.features.projects'),
                                color: "bg-pink-50"
                            }
                        ].map((f, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-[#fafafa] border border-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500">
                                <div className={`w-20 h-20 rounded-3xl ${f.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-gray-900 tracking-tight">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
