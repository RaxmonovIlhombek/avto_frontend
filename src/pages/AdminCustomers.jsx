import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, UserCheck, Shield, 
  Mail, Calendar, MoreVertical, Edit,
  Phone, Hash, ArrowUpRight, Lock, Unlock,
  X, Info, Clock, Check, Download,
  TrendingUp, Award, Zap, Package, 
  ShieldCheck, AlertCircle, ChevronRight, Activity,
  Car, DollarSign
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { exportToCSV } from '../utils/exportCsv';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const CustomerIntelligenceSlideOver = ({ user, isOpen, onClose, onToggleStatus, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ phone_number: '', car_number: '' });
    const { t } = useLanguage();

    useEffect(() => {
        if (user) {
            setEditData({ 
                phone_number: user.profile?.phone_number || '', 
                car_number: user.profile?.car_number || '' 
            });
            setIsEditing(false);
        }
    }, [user]);

    if (!user) return null;

    const isVIP = (user.booking_count || 0) >= 10;
    const isLoyal = (user.booking_count || 0) >= 5;

    const handleSaveProfile = async () => {
        await onUpdateProfile(user.id, editData);
        setIsEditing(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]" />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#0a0a0f] shadow-2xl z-[101] p-10 flex flex-col transition-colors overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">Customer <span className="text-brand-primary">{t('customer_intel')}</span></h3>
                            <button onClick={onClose} className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-3xl hover:text-brand-primary transition-all"><X size={20}/></button>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-4 scrollbar-hide space-y-10 pb-10">
                             {/* Profile Header */}
                             <div className="flex items-center gap-8">
                                <div className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center text-5xl font-black shadow-inner relative
                                    ${user.is_staff ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-50 dark:bg-white/5 text-slate-300 dark:text-slate-700'}`}>
                                    {user.username.charAt(0).toUpperCase()}
                                    {isVIP && <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white border-8 border-white dark:border-[#0a0a0f] shadow-xl"><Award size={16}/></div>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-4xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter leading-none">{user.username}</h4>
                                        {user.is_staff && <ShieldCheck className="text-brand-primary" size={24}/>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {user.is_active ? t('account_active') : t('account_suspended')}
                                        </span>
                                    </div>
                                </div>
                             </div>

                             {/* Tactical Metrics Grid */}
                             <div className="grid grid-cols-2 gap-6">
                                <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('engagement')}</div>
                                    <div className="text-4xl font-black text-slate-800 dark:text-white relative z-10 italic">{user.booking_count || 0} <span className="text-sm opacity-30 uppercase font-black tracking-normal">{t('engagement')}</span></div>
                                    <Activity className="absolute -bottom-6 -right-6 w-24 h-24 text-slate-200/20 dark:text-white/[0.02] group-hover:text-brand-primary/5 transition-colors" />
                                </div>
                                <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10 font-black">{t('contribution')}</div>
                                    <div className="text-4xl font-black text-brand-primary relative z-10 italic">{(user.total_spent || 0).toLocaleString()} <span className="text-[10px] opacity-30 uppercase font-black tracking-normal italic">UZS</span></div>
                                    <DollarSign className="absolute -bottom-6 -right-6 w-24 h-24 text-slate-200/20 dark:text-white/[0.02] group-hover:text-emerald-500/5 transition-colors" />
                                </div>
                             </div>

                             {/* Specialized Assets & Edit */}
                             <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('asset_params')}</label>
                                    <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">{isEditing ? t('cancel_edit') : t('edit_assets')}</button>
                                </div>
                                
                                {isEditing ? (
                                    <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[3rem] space-y-6 border border-brand-primary/20">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('mobile_link')}</label>
                                            <input type="text" value={editData.phone_number} onChange={(e) => setEditData({...editData, phone_number: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('plate_id')}</label>
                                            <input type="text" maxLength={10} value={editData.car_number} onChange={(e) => setEditData({...editData, car_number: e.target.value.toUpperCase().replace(/\s/g, '')})} className="w-full bg-slate-900 border border-white/10 p-4 rounded-2xl text-white font-black uppercase italic tracking-[0.2em] font-mono" />
                                        </div>
                                        <button onClick={handleSaveProfile} className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-primary/20">{t('update_assets')}</button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex justify-between items-center group overflow-hidden relative border border-white/5">
                                        <div>
                                            <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">{t('prime_plate')}</div>
                                            <div className="text-3xl font-black italic tracking-[0.2em] group-hover:text-brand-primary transition-colors">{user.profile?.car_number || t('unknown_asset')}</div>
                                            <div className="text-[10px] text-white/30 font-bold mt-1 italic">{user.profile?.phone_number || t('no_mobile')}</div>
                                        </div>
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                                            <Car size={32} />
                                        </div>
                                    </div>
                                )}
                             </div>

                             {/* Access Control Trigger */}
                             <div className="pt-6">
                                <button 
                                    onClick={() => onToggleStatus(user.id)}
                                    className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95
                                    ${user.is_active 
                                        ? 'bg-rose-500 text-white shadow-rose-500/30' 
                                        : 'bg-emerald-500 text-white shadow-emerald-500/30'}`}
                                >
                                    {user.is_active ? <Lock size={20} /> : <Unlock size={20} />}
                                    {user.is_active ? t('quarantine') : t('restore_access')}
                                </button>
                             </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const KPICard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3.5rem] shadow-sm relative overflow-hidden group transition-colors flex-grow"
    >
        <div className="flex justify-between items-center relative z-10">
            <div>
                <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-1">{title}</div>
                <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic leading-none">{value}</div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${color}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    </motion.div>
);

const AdminCustomers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const { theme } = useTheme();

    useEffect(() => {
        if (!authLoading && user) {
            fetchUsers();
        }
    }, [authLoading, user]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('admin/users/');
            setUsers(response.data);
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId) => {
        try {
            const response = await api.post(`admin/users/${userId}/toggle/`);
            const usersUpdated = users.map(u => u.id === userId ? { ...u, is_active: response.data.is_active } : u);
            setUsers(usersUpdated);
            if (selectedUser?.id === userId) setSelectedUser({...selectedUser, is_active: response.data.is_active});
            toast.success(response.data.is_active ? t('access_restored') : t('user_quarantined'));
        } catch (error) {
            toast.error(t('error_loading'));
        }
    };

    const updateProfile = async (userId, profileData) => {
        try {
            const response = await api.patch(`admin/users/${userId}/`, profileData);
            setUsers(users.map(u => u.id === userId ? response.data : u));
            setSelectedUser(response.data);
            toast.success(t('update_success'));
        } catch (error) {
            toast.error(t('update_failed'));
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.profile?.car_number?.toLowerCase().includes(search.toLowerCase()) ||
        u.profile?.phone_number?.includes(search)
    );

    const exportCSV = () => {
        const data = users.map(u => ({
            'ID': u.id,
            'User': u.username,
            'Email': u.email,
            'Phone': u.profile?.phone_number || '-',
            'Missions': u.booking_count || 0,
            'Spend': u.total_spent || 0,
            'Status': u.is_active ? 'Active' : 'Blocked'
        }));
        exportToCSV(data, 'SmartPark_CustomerIntelligence');
        toast.success(t('intel_exported'));
    };

    return (
        <div className="space-y-12 pb-20 transition-colors duration-300">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('loyalty_mesh')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">Customer <span className="text-brand-primary">{t('customer_base')}</span></h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('crm_desc')}</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="flex-grow md:flex-grow-0 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input 
                            type="text" placeholder={t('search_profiles')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-6 pl-16 pr-6 rounded-[2.5rem] font-bold text-sm outline-none focus:border-brand-primary transition-all"
                        />
                    </div>
                    <button onClick={exportCSV} className="p-6 bg-slate-900 dark:bg-brand-primary text-white rounded-[2rem] hover:scale-110 active:scale-95 transition-all shadow-xl shadow-brand-primary/20">
                        <Download size={24} />
                    </button>
                </div>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <KPICard title={t('total_assets')} value={users.length} icon={Users} color="bg-slate-900 border border-white/10 text-white" delay={0.1} />
                <KPICard title={t('verified_loyalty')} value={users.filter(u => u.is_active && (u.booking_count || 0) >= 1).length} icon={ShieldCheck} color="bg-emerald-500/10 text-emerald-500" delay={0.2} />
                <KPICard title={t('strategic_vips')} value={users.filter(u => (u.booking_count || 0) >= 10).length} icon={Award} color="bg-amber-500/10 text-amber-500" delay={0.3} />
            </div>

            {/* Intelligence Table Mesh */}
            <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[4rem] shadow-sm overflow-hidden min-h-[500px] transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                                <th className="px-12 py-10 font-black">{t('authorized_identity')}</th>
                                <th className="px-12 py-10 font-black">{t('prime_asset')}</th>
                                <th className="px-12 py-10 font-black">{t('loyalty_status')}</th>
                                <th className="px-12 py-10 font-black">{t('yield_col')}</th>
                                <th className="px-12 py-10 text-right font-black">{t('protocol_col')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="py-40 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.5em]">{t('mesh_loading')}</td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedUser(u)}>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-inner group-hover:scale-110 transition-transform
                                                ${u.is_staff 
                                                    ? 'bg-brand-primary/10 text-brand-primary' 
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-700'}`}>
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 dark:text-white text-lg tracking-tight flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                                                    {u.username}
                                                    {u.is_staff && <Shield size={14} className="text-brand-primary" />}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="bg-slate-900 dark:bg-brand-primary/10 text-white px-5 py-3 rounded-2xl font-black tracking-[0.2em] text-[10px] italic border border-white/5 text-center w-fit shadow-lg shadow-black/10">
                                            {u.profile?.car_number || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${u.is_active ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                                                {u.is_active ? t('status_active') : t('status_blocked')}
                                            </span>
                                            {u.booking_count >= 10 && <span className="bg-amber-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">{t('vip_node')}</span>}
                                            {u.booking_count >= 5 && u.booking_count < 10 && <span className="bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">{t('loyal_node')}</span>}
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="font-black text-slate-800 dark:text-white text-lg italic tracking-tighter">{(u.total_spent || 0).toLocaleString()} <span className="text-[10px] opacity-30 uppercase font-bold tracking-normal">UZS</span></div>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }} className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-brand-primary rounded-2xl transition-all border border-transparent hover:border-brand-primary/20"><ArrowUpRight size={18} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); toggleUserStatus(u.id); }} className={`p-4 rounded-2xl transition-all ${u.is_active ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                                                {u.is_active ? <Lock size={18} /> : <Unlock size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CustomerIntelligenceSlideOver 
                user={selectedUser} 
                isOpen={!!selectedUser} 
                onClose={() => setSelectedUser(null)} 
                onToggleStatus={toggleUserStatus}
                onUpdateProfile={updateProfile}
            />
        </div>
    );
};

export default AdminCustomers;
