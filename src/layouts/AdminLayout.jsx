import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Car, Calendar, 
  Settings, LogOut, Search, Menu, X, 
  ChevronRight, Box, Bell, User as UserIcon, Building, DollarSign,
  FileBarChart
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import { Sun, Moon, Globe } from 'lucide-react';


const formatDate = (date, lang) => {
  const locale = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.DateTimeFormat(locale, { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

const NavItem = ({ to, icon: Icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
        : 'text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
    `}
  >
    <Icon size={20} className="shrink-0" />
    <span className="font-bold text-sm tracking-wide">{label}</span>
    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
  </NavLink>
);

const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.is_staff) {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#08060d] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !user.is_staff) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#08060d] flex text-slate-900 dark:text-slate-100 font-sans transition-all duration-500">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2 text-slate-800 dark:text-white transition-colors">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/40">
              <Car className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tighter uppercase italic">SmartPark</h2>
              <p className="text-slate-400 dark:text-white/20 text-[10px] font-bold uppercase tracking-widest leading-none">Enterprise CRM</p>
            </div>
          </div>

          {/* Search Mock */}
          <div className="relative mb-8 px-2 transition-colors">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t('search')} 
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 outline-none focus:border-brand-primary/50 transition-all pointer-events-none"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-grow space-y-2">
            <NavItem to="/admin" end icon={LayoutDashboard} label={t('dashboard')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/reports" icon={FileBarChart} label={t('reports')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/notifications" icon={Bell} label={t('notifications')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/lots" icon={Building} label={t('parkingLots')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/payments" icon={DollarSign} label={t('payments')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/bookings" icon={Calendar} label={t('bookings')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/spaces" icon={Box} label={t('spaces')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/admin/customers" icon={Users} label={t('customers')} onClick={() => setIsSidebarOpen(false)} />
          </nav>

          {/* User Profile Card */}
          <div className="mt-auto border-t border-slate-200 dark:border-white/5 pt-6">
            <NavLink 
              to="/profile"
              className={({ isActive }) => `
               relative bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 group
               hover:bg-slate-100 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-brand-primary/5
               ${isActive ? 'ring-1 ring-brand-primary/50 bg-slate-100 dark:bg-white/[0.08]' : 'border border-slate-100 dark:border-transparent'}
             `}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <UserIcon size={20} />
              </div>
              <div className="flex-grow overflow-hidden text-left">
                <div className="text-slate-900 dark:text-white font-bold text-sm truncate group-hover:text-brand-primary transition-colors">{user.username}</div>
                <div className="text-slate-400 dark:text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  Admin <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }}
                className="p-2 text-slate-300 dark:text-white/10 hover:text-rose-400 transition-colors relative z-10 hover:scale-110 active:scale-90"
                title={t('logout')}
              >
                <LogOut size={18} />
              </button>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
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
              {t('dashboard').split(' ')[0]} <span className="text-brand-primary">{t('dashboard').split(' ')[1] || ''}</span>
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

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1" />

            {/* Back to Home / Exit Admin */}
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all ml-1"
              title={t('home') || "Asosiy sahifaga qaytish"}
            >
              <Globe size={18} />
            </button>
            
            <div className="hidden sm:flex flex-col items-end ml-4">
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{formatDate(new Date(), lang)}</span>
              <span className="text-[9px] font-bold text-slate-400 opacity-60">SmartPark ERP v2.0</span>
            </div>
          </div>
        </header>

        {/* Content Buffer */}
        <main className="flex-grow overflow-y-auto p-6 md:p-10 bg-[#f8fafc] dark:bg-[#08060d] transition-colors">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden"
        />
      )}
    </div>
  );
};
export default AdminLayout;
