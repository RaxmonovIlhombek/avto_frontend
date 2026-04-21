import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Car, TrendingUp, DollarSign, 
  ArrowLeft, RefreshCw, Clock, Download, PieChart as PieIcon,
  BarChart as BarIcon, Calendar, Menu, X, Shield, 
  Search, ExternalLink, ArrowUpRight, Activity, Building,
  Plus, Send, Zap, Cpu, Server, Waves, ArrowUp, ArrowDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 group transition-all"
  >
    <div className={`w-14 min-h-[3.5rem] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${color}/20 group-hover:scale-110 group-active:scale-95 transition-all ${color}`}>
        <Icon size={22} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-brand-primary transition-colors text-center max-w-[80px]">
        {label}
    </span>
  </button>
);

const StatCard = ({ icon: Icon, title, value, detail, trend, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className={`flex items-center gap-1 font-black text-[10px] uppercase px-3 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'}`}>
            {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(trend)}%
        </div>
    </div>
    <div className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{title}</div>
    <div className="text-4xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-brand-primary transition-colors tracking-tighter italic">{value}</div>
    <div className="text-slate-400 dark:text-white/40 text-[10px] font-bold flex items-center gap-2 transition-colors">
        <Activity size={12} className="text-brand-primary" /> {detail}
    </div>
    {/* Animated background shape */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 dark:bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
  </motion.div>
);

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!authLoading && user) {
      fetchStats();
    }
  }, [authLoading, user]);

  const fetchStats = async () => {
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

  const exportWeeklyPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text(t('smartpark_command_audit'), 20, 30);
    doc.save(`SmartPark_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success(t('audit_report_ready'));
  };

  if (authLoading) return null;

  return (
    <div className="space-y-12 pb-20 transition-colors duration-300">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-12 h-1.5 bg-brand-primary rounded-full" />
             <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('command_center')}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">Smart<span className="text-brand-primary">Park</span></h2>
          <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('realtime_intel')}</p>
        </div>

        <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-6 md:px-10 rounded-[3rem] shadow-sm flex flex-wrap gap-8 items-center transition-colors">
            <QuickAction icon={Plus} label={t('new_slot')} color="bg-brand-primary" onClick={() => navigate('/admin/spaces')} />
            <QuickAction icon={Users} label={t('block_user')} color="bg-rose-500" onClick={() => navigate('/admin/customers')} />
            <QuickAction icon={Send} label={t('broadcast')} color="bg-indigo-500" onClick={() => navigate('/admin/notifications')} />
            <div className="h-10 w-px bg-slate-100 dark:bg-white/10 mx-2 hidden md:block" />
            <QuickAction icon={RefreshCw} label={t('sync_data')} color="bg-slate-900 dark:bg-white/10" onClick={fetchStats} />
        </div>
      </div>

      {loading && !stats ? (
        <div className="py-40 flex flex-col items-center gap-8">
          <div className="relative">
             <div className="w-20 h-20 border-8 border-brand-primary/10 rounded-full" />
             <div className="w-20 h-20 border-8 border-brand-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
             <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
          </div>
          <span className="text-slate-400 font-black uppercase tracking-[0.6em] text-[10px]">{t('initializing_neural_engine')}</span>
        </div>
      ) : stats ? (
        <div className="space-y-12">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
              icon={TrendingUp} title={t('occupancy')} value={`${stats?.occupancy_rate || 0}%`} 
              trend={12} detail={t('system_wide')} color="bg-brand-primary/10 text-brand-primary" delay={0.1}
            />
            <StatCard 
              icon={Building} title={t('parkingLots')} value={stats?.total_lots || 0} 
              trend={0} detail={t('active_branches')} color="bg-indigo-500/10 text-indigo-500" delay={0.2}
            />
            <StatCard 
              icon={DollarSign} title={t('revenue')} value={`${(stats?.total_revenue || 0).toLocaleString()}`} 
              trend={8.4} detail={t('net_total')} color="bg-emerald-500/10 text-emerald-500" delay={0.3}
            />
            <StatCard 
              icon={Car} title={t('bookings')} value={stats?.total_bookings || 0} 
              trend={-2.1} detail={t('verified_sessions')} color="bg-blue-500/10 text-blue-500" delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Area Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm min-h-[550px] flex flex-col group relative overflow-hidden transition-colors">
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">{t('finance_pulse')}</h3>
                       <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-full animate-pulse">{t('live')}</div>
                   </div>
                   <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">{t('revenue_stream')}</p>
                </div>
                <div className="flex gap-2">
                      <button onClick={exportWeeklyPDF} className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-brand-primary rounded-2xl transition-all shadow-sm"><Download size={20} /></button>
                </div>
              </div>
              
              <div className="flex-grow w-full relative z-10 pr-4">
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={stats.chart_data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="10 10" stroke={isDark ? "#ffffff05" : "#f1f5f9"} vertical={false} />
                    <XAxis dataKey="name" stroke={isDark ? "#ffffff20" : "#64748b"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                    <YAxis stroke={isDark ? "#ffffff20" : "#64748b"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dx={-15} />
                    <Tooltip 
                      contentStyle={{ background: isDark ? '#1a1a24' : '#ffffff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 25px 30px -5px rgba(0,0,0,0.2)', color: isDark ? '#fff' : '#0f172a', padding: '20px' }}
                      itemStyle={{ color: '#d946ef', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}
                      cursor={{ stroke: '#d946ef', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={6} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sidebar Activity Feed */}
            <div className="lg:col-span-4 flex flex-col gap-10">
                <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-2xl flex-grow flex flex-col relative overflow-hidden group transition-colors duration-500">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter transition-colors">Recent <span className="text-brand-primary">{t('recent_activity')}</span></h3>
                        <Activity className="text-brand-primary animate-pulse" size={20} />
                    </div>
                    <div className="space-y-6 overflow-y-auto max-h-[460px] pr-4 scrollbar-hide relative z-10">
                        {stats?.recent_bookings?.map((b, i) => (
                            <div key={b.id} className="flex items-center gap-5 p-4 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/5 group/item transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-sm group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">
                                    {b.space_detail?.identifier?.charAt(0) || '#'}
                                </div>
                                <div className="flex-grow">
                                    <div className="text-slate-800 dark:text-white text-xs font-black uppercase tracking-tight transition-colors">{b.user_detail?.username || t('guest')}</div>
                                    <div className="text-slate-400 dark:text-white/30 text-[9px] font-bold uppercase tracking-widest transition-colors">{b.car_number || 'N/A'} • {b.created_at ? format(new Date(b.created_at), 'HH:mm') : '--:--'}</div>
                                </div>
                                <ArrowUpRight className="text-slate-300 dark:text-white/20 group-hover/item:text-brand-primary group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" size={16} />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-[#12121a] to-transparent z-20 pointer-events-none transition-colors" />
                </div>

                {/* System Health Widget */}
                <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3.5rem] shadow-sm transition-colors">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
                            <Server size={22} />
                        </div>
                        <div>
                            <div className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{t('system_health')}</div>
                            <div className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">{t('cluster_ok')}</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-widest">{t('api_latency')}</span>
                            <span className="text-emerald-500">24ms</span>
                        </div>
                        <div className="w-full bg-slate-50 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-emerald-500" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 dark:text-slate-700">
                             <span>Uptime 99.9%</span>
                             <span>SSL Active</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Type Distribution Mini */}
              <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm flex flex-col transition-colors">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{t('capacity_logic')}</h3>
                  <div className="flex-grow flex items-center justify-center py-6">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'VIP', value: stats?.stats_by_type?.vip || 0 },
                              { name: 'Regular', value: stats?.stats_by_type?.regular || 0 }
                            ]}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#d946ef" />
                            <Cell fill={isDark ? "#ffffff10" : "#f1f5f9"} />
                          </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] text-center border border-transparent hover:border-brand-primary/20 transition-all">
                          <div className="text-[9px] font-black text-slate-300 uppercase mb-1">VIP</div>
                          <div className="text-2xl font-black text-brand-primary italic uppercase">{stats?.stats_by_type?.vip || 0}</div>
                      </div>
                      <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] text-center">
                          <div className="text-[9px] font-black text-slate-300 uppercase mb-1">Reg</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-white italic uppercase">{stats?.stats_by_type?.regular || 0}</div>
                      </div>
                  </div>
              </div>

              {/* Branch Heatmap Grid Preview */}
              <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm flex flex-col transition-colors">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{t('branch_metrics')}</h3>
                  <div className="space-y-6">
                      {stats.lots_occupancy.slice(0, 3).map((lot, idx) => (
                          <div key={idx} className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter italic">
                                  <span className="text-slate-800 dark:text-white">{lot.name}</span>
                                  <span className="text-brand-primary">{lot.rate}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${lot.rate}%` }} 
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className={`h-full rounded-full ${lot.rate > 80 ? 'bg-rose-500' : lot.rate > 50 ? 'bg-amber-500' : 'bg-brand-primary'}`} 
                                  />
                              </div>
                          </div>
                      ))}
                      <Link to="/admin/lots" className="block text-center py-4 bg-slate-50 dark:bg-white/5 text-slate-300 hover:text-brand-primary text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all">{t('view_all_branches')}</Link>
                  </div>
              </div>

              {/* AI Insight Card */}
              <div className="bg-brand-primary p-10 rounded-[4rem] shadow-xl shadow-brand-primary/20 flex flex-col justify-between text-white relative overflow-hidden group">
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                         <Zap size={24} />
                      </div>
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-4 leading-tight">{t('ai_insight')}</h4>
                      <p className="text-white/70 text-xs font-medium leading-relaxed">{t('ai_insight_desc')}</p>
                  </div>
                  <Waves className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:text-white/10 transition-colors" size={192} />
                  <button onClick={() => navigate('/admin/reports')} className="mt-8 py-4 bg-white text-brand-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">{t('get_analysis')}</button>
              </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
