import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Car, Menu, X, MapPin, LogOut, User, LayoutDashboard, History, Sun, Moon } from 'lucide-react';
import NotificationBell from './NotificationBell';


const Navbar = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed w-full z-50 px-6 py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/20 dark:bg-black/40 backdrop-blur-2xl border border-black/5 dark:border-white/10 px-8 py-4 rounded-[2.5rem] pointer-events-auto shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Car className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white italic uppercase">SmartPark</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link to="/" className="text-[10px] font-black text-slate-900/40 dark:text-white/40 hover:text-brand-primary dark:hover:text-white transition-all uppercase tracking-[0.3em]">Asosiy</Link>
            <a 
              href="#map" 
              className="text-[10px] font-black text-slate-900/40 dark:text-white/40 hover:text-brand-primary dark:hover:text-white transition-all uppercase tracking-[0.3em]"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setTimeout(() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
            >
              Xaritani ko'rish
            </a>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <NotificationBell />
              <div className="w-px h-8 bg-white/10" />
              
              <Link 
                to={user.is_staff ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all duration-300"
              >
                <LayoutDashboard size={14} /> {t('dashboard')}
              </Link>

              <Link to="/profile" className="flex items-center gap-4 group">
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900 dark:text-white">{user.username}</div>
                  <div className="text-[8px] font-bold text-slate-900/20 dark:text-white/20 uppercase tracking-widest">Premium User</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
                  <User size={20} />
                </div>
              </Link>

              <button 
                onClick={logout}
                className="p-3.5 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/10 transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="bg-brand-primary hover:bg-white hover:text-brand-primary text-white px-10 py-4 rounded-[1.5rem] text-[10px] font-black transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-[0.2em]"
            >
              Tizimga Kirish
            </button>
          )}
          
          <div className="w-px h-8 bg-black/5 dark:bg-white/10" />
          
          {/* Language Switcher */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl">
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

          <button 
            onClick={toggleTheme}
            className="p-3.5 bg-black/5 dark:bg-white/5 text-slate-400 hover:text-brand-primary rounded-2xl border border-black/5 dark:border-white/10 transition-all font-black text-[10px]"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <button onClick={toggleMenu} className="lg:hidden text-slate-900 dark:text-white p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 top-[73px] bg-black/60 backdrop-blur-sm z-40 lg:hidden pointer-events-auto"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[73px] bottom-0 w-[80%] max-w-sm bg-white dark:bg-[#16161d] p-8 flex flex-col gap-6 z-50 lg:hidden border-l border-slate-200 dark:border-white/10 shadow-2xl pointer-events-auto transition-colors duration-500"
            >
              <div className="flex flex-col gap-4">
                <Link to="/" onClick={toggleMenu} className="flex items-center gap-4 text-lg font-bold text-slate-800 dark:text-white/80 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
                  <Menu size={20} className="text-brand-primary" /> Asosiy
                </Link>
                <a 
                  href="#map" 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu();
                    navigate('/');
                    setTimeout(() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }} 
                  className="flex items-center gap-4 text-lg font-bold text-slate-800 dark:text-white/80 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors"
                >
                  <MapPin size={20} className="text-brand-primary" /> Xaritani ko'rish
                </a>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-200 dark:border-white/10 space-y-4">
                {user ? (
                  <>
                    <Link to="/profile" onClick={toggleMenu} className="flex items-center justify-between p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center"><User size={20} className="text-white" /></div>
                        <span className="font-bold text-slate-900 dark:text-white">{user.username}</span>
                      </div>
                      <History size={20} className="text-slate-400 dark:opacity-40" />
                    </Link>
                    {user.is_staff ? (
                      <Link to="/admin" onClick={toggleMenu} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white transition-colors">
                        <LayoutDashboard size={20} className="text-brand-primary" /> {t('dashboard')}
                      </Link>
                    ) : (
                      <Link to="/dashboard" onClick={toggleMenu} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white transition-colors">
                        <LayoutDashboard size={20} className="text-brand-primary" /> {t('dashboard')}
                      </Link>
                    )}
                    <button 
                      onClick={() => { logout(); toggleMenu(); }}
                      className="w-full flex items-center gap-4 p-4 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-2xl border border-rose-500/10 font-bold transition-colors"
                    >
                      <LogOut size={20} /> Chiqish
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { onOpenAuth(); toggleMenu(); }}
                    className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-brand-primary/40"
                  >
                    KIRISH
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
