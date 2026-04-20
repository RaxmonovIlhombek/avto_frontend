import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Sun, Moon, Bell, ChevronRight
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import CustomerSidebar from '../components/CustomerSidebar';
import NotificationBell from '../components/NotificationBell';

const formatDate = (date, lang) => {
  const locale = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.DateTimeFormat(locale, { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

const CustomerLayout = () => {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#08060d] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#08060d] flex text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <CustomerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-[#12121a] border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-600 dark:text-slate-400"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">
              {t('client_dashboard_title').split(' ')[0]} <span className="text-brand-primary">{t('client_dashboard_title').split(' ')[1] || ''}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-50 dark:bg-white/5 p-1 rounded-xl">
              {['uz', 'ru', 'en'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-white dark:bg-white/10 text-brand-primary shadow-sm' : 'text-slate-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-3 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-brand-primary rounded-xl transition-all"
              title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1" />
            
            <NotificationBell />
            
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{formatDate(new Date(), lang)}</span>
              <span className="text-[9px] font-bold text-slate-400 opacity-60 italic">Authorized Client View</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto p-6 md:p-10 bg-[#f8fafc] dark:bg-[#08060d] transition-colors relative">
             <div className="max-w-[1400px] mx-auto">
                <Outlet />
             </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerLayout;
