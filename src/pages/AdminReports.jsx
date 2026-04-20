import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileBarChart, Calendar, RefreshCw, 
  TrendingUp, DollarSign, Car, PieChart as PieIcon,
  ChevronRight, Filter, FileText, Layout, Building,
  Clock, Zap, Activity, ArrowUpRight, Target
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line
} from 'recharts';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const KPICard = ({ icon: Icon, title, value, subtext, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3.5rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${color}`}>
            <Icon size={24} />
        </div>
        <div className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{title}</div>
        <div className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter italic whitespace-nowrap">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-t border-slate-50 dark:border-white/5 pt-4">
            <Activity size={12} className="text-brand-primary" /> {subtext}
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    </motion.div>
);

const AdminReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { user, loading: authLoading } = useAuth();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (user && !authLoading) {
            fetchReports();
        }
    }, [user, authLoading]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await api.get('admin/stats/');
            setStats(response.data);
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type) => {
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}admin/export/${type}/`;
        const token = localStorage.getItem('token');
        toast.loading(`${type.toUpperCase()} Generating...`, { duration: 2000 });
        
        fetch(url, { headers: { 'Authorization': `Token ${token}` } })
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `SmartPark_BI_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
            link.click();
            toast.success('Report Ready');
        });
    };

    if (loading && !stats) return (
        <div className="py-40 flex flex-col items-center gap-8">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-primary/10 rounded-full" />
                <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin absolute top-0" />
            </div>
            <span className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px]">{t('bi_engine')}...</span>
        </div>
    );

    const COLORS = ['#d946ef', '#6366f1', '#10b981', '#f59e0b', '#0ea5e9'];

    return (
        <div className="space-y-12 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('bi_engine')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">BI <span className="text-brand-primary">{t('reports')}</span></h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('decision_support')}</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <button onClick={() => handleExport('excel')} className="flex-grow md:flex-grow-0 flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm">
                        <FileText size={18} /> {t('excel_grid')}
                    </button>
                    <button onClick={() => handleExport('pdf')} className="flex-grow md:flex-grow-0 flex items-center justify-center gap-3 bg-slate-900 dark:bg-brand-primary text-white px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20">
                        <FileBarChart size={18} /> {t('full_exec_pdf')}
                    </button>
                </div>
            </div>

            {/* KPI RIBBON */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KPICard 
                    icon={TrendingUp} title={t('occupancy')} value={`${stats?.occupancy_rate || 0}%`} 
                    subtext={t('realtime_load')} color="bg-brand-primary/10 text-brand-primary" delay={0.1} 
                />
                <KPICard 
                    icon={DollarSign} title={t('revenue')} value={`${stats?.total_revenue?.toLocaleString() || 0}`} 
                    subtext={t('gross_total')} color="bg-emerald-500/10 text-emerald-500" delay={0.2} 
                />
                <KPICard 
                    icon={Target} title={t('avg_ticket')} value={`${stats?.avg_payment?.toLocaleString() || 0}`} 
                    subtext={t('per_booking')} color="bg-indigo-500/10 text-indigo-500" delay={0.3} 
                />
                <KPICard 
                    icon={Clock} title={t('peak_hour')} value={`${stats?.hourly_trends?.reduce((max, h) => h.count > max.count ? h : max, stats?.hourly_trends[0] || {hour:0, count:0})?.hour || 0}:00`} 
                    subtext={t('highest_activity')} color="bg-amber-500/10 text-amber-500" delay={0.4} 
                />
            </div>

            {/* MAIN ANALYTICS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Hourly Peak Chart */}
                <div className="lg:col-span-8 bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm flex flex-col min-h-[500px]">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">Peak <span className="text-brand-primary">{t('peak_hour_analyzer')}</span></h3>
                            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{t('arrival_dist')}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="flex-grow w-full">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats?.hourly_trends || []}>
                                <CartesianGrid strokeDasharray="10 10" stroke={isDark ? "#ffffff05" : "#f1f5f9"} vertical={false} />
                                <XAxis dataKey="hour" stroke={isDark ? "#ffffff20" : "#cbd5e1"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={10} tickFormatter={(v) => `${v}:00`} />
                                <YAxis stroke={isDark ? "#ffffff20" : "#cbd5e1"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ background: isDark ? '#1a1a24' : '#0f172a', border: 'none', borderRadius: '1.5rem', color: '#fff' }}
                                    cursor={{ fill: isDark ? '#ffffff05' : '#f8fafc' }}
                                />
                                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={20}>
                                    {(stats?.hourly_trends || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.count === Math.max(...(stats?.hourly_trends || []).map(h => h.count), 0) ? "#d946ef" : isDark ? "#ffffff10" : "#f1f5f9"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Day of Week Weight */}
                <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[4rem] text-white flex flex-col items-center justify-between relative overflow-hidden group">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-10 w-full text-left">{t('activity_by_day')}</h3>
                    <div className="flex-grow w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.daily_trends}>
                                <PolarGrid stroke="#ffffff10" />
                                <PolarAngleAxis dataKey="name" stroke="#ffffff40" fontSize={10} fontWeight="900" />
                                <Radar
                                    name="Bookings"
                                    dataKey="count"
                                    stroke="#d946ef"
                                    fill="#d946ef"
                                    fillOpacity={0.6}
                                />
                                <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '1rem' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 text-center relative z-10 w-full">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{t('top_performance')}</div>
                        <div className="text-3xl font-black italic tracking-tighter text-brand-primary uppercase">
                            {stats?.daily_trends?.reduce((max, d) => d.count > max.count ? d : max, stats?.daily_trends[0] || {name: 'N/A', count: 0})?.name || 'N/A'}
                        </div>
                    </div>
                    <Zap className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:text-white/10 transition-colors" size={192} />
                </div>
            </div>

            {/* SECONDARY INSIGHTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Lot Revenue Compare */}
                <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm transition-colors">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <Building size={22} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">Branch <span className="text-brand-primary">{t('branch_economics')}</span></h4>
                            <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{t('revenue_by_branch')}</p>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.chart_data || []}>
                                <defs>
                                    <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" stroke={isDark ? "#ffffff05" : "#f1f5f9"} vertical={false} />
                                <XAxis dataKey="name" stroke={isDark ? "#ffffff20" : "#cbd5e1"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                                <YAxis stroke={isDark ? "#ffffff20" : "#cbd5e1"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: isDark ? '#1a1a24' : '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
                                />
                                <Area type="stepAfter" dataKey="revenue" stroke="#d946ef" strokeWidth={5} fill="url(#finGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Occupancy Heatmap Bars */}
                <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm transition-colors">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">{t('occupancy_hub')}</h3>
                    <div className="space-y-10">
                         {(stats?.lots_occupancy || []).map((lot, idx) => (
                           <div key={idx} className="group cursor-pointer">
                             <div className="flex justify-between items-end mb-3">
                               <div>
                                 <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter italic text-lg group-hover:text-brand-primary transition-colors">{lot.name}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lot.occupied} / {lot.total} slots occupied</p>
                               </div>
                               <div className="text-right">
                                    <div className="text-2xl font-black italic text-brand-primary">{lot.rate}%</div>
                                    <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{lot.rate > 80 ? 'CRITICAL LOAD' : 'OPTIONAL LOAD'}</div>
                               </div>
                             </div>
                             <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden p-1 shadow-inner">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${lot.rate || 0}%` }}
                                 transition={{ duration: 1.5, delay: idx * 0.15 }}
                                 className={`h-full rounded-full flex items-center justify-end pr-2 transition-all ${lot.rate > 80 ? 'bg-rose-500' : lot.rate > 50 ? 'bg-amber-500' : 'bg-brand-primary'}`}
                               >
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                               </motion.div>
                             </div>
                           </div>
                         ))}
                    </div>
                    <div className="mt-12 p-6 bg-slate-50 dark:bg-white/[0.03] rounded-[2.5rem] flex items-center gap-6 group hover:translate-x-2 transition-transform">
                        <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white">
                            <ArrowUpRight size={24} />
                        </div>
                        <div>
                             <div className="text-slate-800 dark:text-white font-black text-sm uppercase italic">{t('expand_view')}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('connect_master')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
