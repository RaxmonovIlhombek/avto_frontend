import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, Activity, DollarSign, Award,
  Car, Calendar, TrendingUp, Zap
} from 'lucide-react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import ParkingMap from '../components/ParkingMap';

const KPICard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3.5rem] shadow-sm relative overflow-hidden group transition-colors"
    >
        <div className="flex justify-between items-center relative z-10">
            <div>
                <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-1">{title}</div>
                <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic">{value}</div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${color}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    </motion.div>
);

const CustomerDashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        total_bookings: 0,
        active_bookings: 0,
        total_spent: 0,
        loyalty_level: 'Member'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('customer/stats/');
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching customer stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('strategic_mesh') || 'Personal Command'}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">{t('client_dashboard_title')}</h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('active_zone') || 'Authorized Secure Session'}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KPICard 
                    title={t('active_missions')} 
                    value={stats.active_bookings} 
                    icon={Zap} 
                    color="bg-emerald-500/10 text-emerald-500" 
                    delay={0.1} 
                />
                <KPICard 
                    title={t('total_bookings')} 
                    value={stats.total_bookings} 
                    icon={History} 
                    color="bg-indigo-500/10 text-indigo-500" 
                    delay={0.2} 
                />
                <KPICard 
                    title={t('total_contribution')} 
                    value={stats.total_spent.toLocaleString()} 
                    icon={DollarSign} 
                    color="bg-brand-primary/10 text-brand-primary" 
                    delay={0.3} 
                />
                <KPICard 
                    title={t('loyalty_level')} 
                    value={stats.loyalty_level} 
                    icon={Award} 
                    color="bg-amber-500/10 text-amber-500" 
                    delay={0.4} 
                />
            </div>

            {/* Interactive Map Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 px-4">
                    <TrendingUp className="text-brand-primary" size={20} />
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">{t('book_space')}</h3>
                </div>
                <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[4rem] overflow-hidden shadow-sm">
                    <ParkingMap />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
