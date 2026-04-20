import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Check, Trash2, Clock, Filter, 
  Search, Shield, AlertCircle, Info, CheckCircle2,
  RefreshCw
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const { theme } = useTheme();

    useEffect(() => {
        if (user && !authLoading) {
            fetchNotifications();
        }
    }, [user, authLoading]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('notifications/');
            setNotifications(response.data);
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`notifications/${id}/read/`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            toast.success(t('save_success'));
        } catch (error) {
            toast.error(t('error_loading'));
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('notifications/read-all/');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            toast.success(t('mark_all_read'));
        } catch (error) {
            toast.error(t('error_loading'));
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'booking': return <CheckCircle2 className="text-emerald-500" />;
            case 'payment': return <Info className="text-blue-500" />;
            default: return <AlertCircle className="text-amber-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'booking': return 'bg-emerald-50 dark:bg-emerald-500/10';
            case 'payment': return 'bg-blue-50 dark:bg-blue-500/10';
            default: return 'bg-amber-50 dark:bg-amber-500/10';
        }
    };

    return (
        <div className="space-y-12 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-1 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('communications_hub')}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">{t('admin_notifications_title')}</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{t('monitoring_alerts')}</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={markAllAsRead}
                        className="flex-grow md:flex-grow-0 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                    >
                        {t('mark_all_read')}
                    </button>
                    <button 
                        onClick={fetchNotifications}
                        className="p-5 bg-slate-900 dark:bg-brand-primary text-white rounded-[2rem] hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20"
                    >
                        <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[4rem] shadow-sm overflow-hidden min-h-[600px] flex flex-col transition-colors">
                <div className="p-10 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/20 dark:bg-white/[0.01]">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">{t('history')} ({notifications.length})</h4>
                    <Filter className="text-slate-300 dark:text-slate-700" size={20} />
                </div>

                {loading ? (
                    <div className="flex-grow flex items-center justify-center py-40">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 py-40">
                        <Bell size={64} className="mb-6 opacity-20" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">{t('no_notifications')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50 dark:divide-white/5">
                        {notifications.map((notif, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={notif.id}
                                className={`p-10 flex gap-8 items-start group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors ${!notif.is_read ? 'bg-brand-primary/[0.02] dark:bg-brand-primary/5' : ''}`}
                            >
                                <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${getBgColor(notif.notification_type)}`}>
                                    {getIcon(notif.notification_type)}
                                </div>

                                <div className="flex-grow space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h5 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase italic group-hover:text-brand-primary transition-colors">{notif.title}</h5>
                                        <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 flex items-center gap-2 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg">
                                            <Clock size={12} /> {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-4xl text-sm">{notif.message}</p>
                                    
                                    <div className="pt-6 flex items-center gap-6">
                                        {!notif.is_read ? (
                                            <button 
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-[9px] font-black text-brand-primary bg-brand-primary/10 px-6 py-2 rounded-xl hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest shadow-sm"
                                            >
                                                {t('mark_read2')}
                                            </button>
                                        ) : (
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                                <Check size={12} /> {t('read')}
                                            </span>
                                        )}
                                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest border border-slate-100 dark:border-white/5 px-4 py-1.5 rounded-xl">{t('event_id')} #{notif.id}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
