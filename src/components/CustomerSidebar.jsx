import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, DollarSign, 
  User, LogOut, ChevronRight, Car, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const NavItem = ({ to, icon: Icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
        : 'text-white/50 hover:bg-white/5 hover:text-white'}
    `}
  >
    <Icon size={20} className="shrink-0" />
    <span className="font-bold text-sm tracking-wide">{label}</span>
    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
  </NavLink>
);

const CustomerSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-full flex flex-col p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 text-white">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/40">
            <Car className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tighter uppercase italic">SmartPark</h2>
            <p className="opacity-20 text-[10px] font-bold uppercase tracking-widest leading-none">{t('user_sidebar_tag')}</p>
          </div>
        </div>

        {/* Search Mock */}
        <div className="relative mb-8 px-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
          <input 
            type="text" 
            placeholder={t('search')} 
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-brand-primary/50 transition-all pointer-events-none"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          <NavItem to="/dashboard" end icon={LayoutDashboard} label={t('dashboard')} onClick={() => setIsOpen(false)} />
          <NavItem to="/dashboard/bookings" icon={Calendar} label={t('my_bookings')} onClick={() => setIsOpen(false)} />
          <NavItem to="/dashboard/payments" icon={DollarSign} label={t('payment_history')} onClick={() => setIsOpen(false)} />
          <NavItem to="/dashboard/profile" icon={User} label={t('profile')} onClick={() => setIsOpen(false)} />
        </nav>

        {/* User Card */}
        <div className="mt-auto border-t border-white/5 pt-6">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 group transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 uppercase font-black italic">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="flex-grow overflow-hidden text-left">
              <div className="text-white font-bold text-sm truncate">{user?.username}</div>
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Authorized</div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-white/10 hover:text-rose-400 transition-colors hover:scale-110 active:scale-90"
              title={t('logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
