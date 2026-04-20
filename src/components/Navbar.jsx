import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Menu, X, MapPin, LogOut, User, LayoutDashboard, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationBell from './NotificationBell';


const Navbar = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed w-full z-50 px-6 py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[2.5rem] pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Car className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white italic uppercase">SmartPark</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link to="/" className="text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-[0.3em]">Asosiy</Link>
            <a 
              href="#map" 
              className="text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-[0.3em]"
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
                  <div className="text-xs font-black text-white">{user.username}</div>
                  <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Premium User</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
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
        </div>

        <button onClick={toggleMenu} className="lg:hidden text-white p-3 bg-white/5 rounded-2xl border border-white/10">
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
              className="fixed right-0 top-[73px] bottom-0 w-[80%] max-w-sm bg-[#16161d] p-8 flex flex-col gap-6 z-50 lg:hidden border-l border-white/10 shadow-2xl pointer-events-auto"
            >
              <div className="flex flex-col gap-4">
                <Link to="/" onClick={toggleMenu} className="flex items-center gap-4 text-lg font-bold text-white/80 p-4 bg-white/5 rounded-2xl border border-white/5">
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
                  className="flex items-center gap-4 text-lg font-bold text-white/80 p-4 bg-white/5 rounded-2xl border border-white/5"
                >
                  <MapPin size={20} className="text-brand-primary" /> Xaritani ko'rish
                </a>
              </div>

              <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                {user ? (
                  <>
                    <Link to="/profile" onClick={toggleMenu} className="flex items-center justify-between p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center"><User size={20} /></div>
                        <span className="font-bold">{user.username}</span>
                      </div>
                      <History size={20} className="opacity-40" />
                    </Link>
                    {user.is_staff ? (
                      <Link to="/admin" onClick={toggleMenu} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <LayoutDashboard size={20} className="text-brand-primary" /> {t('dashboard')}
                      </Link>
                    ) : (
                      <Link to="/dashboard" onClick={toggleMenu} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <LayoutDashboard size={20} className="text-brand-primary" /> {t('dashboard')}
                      </Link>
                    )}
                    <button 
                      onClick={() => { logout(); toggleMenu(); }}
                      className="w-full flex items-center gap-4 p-4 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/10 font-bold"
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
