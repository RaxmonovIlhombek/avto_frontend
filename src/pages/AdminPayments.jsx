import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Search, Filter, Download, 
  CheckCircle2, XCircle, Clock, Calendar,
  ArrowUpRight, FileText, TrendingUp,
  X, Shield, Eye, CreditCard, Wallet, Landmark,
  ChevronDown, ArrowRight, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import api from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportToCSV } from '../utils/exportCsv';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const TransactionDetail = ({ transaction, isOpen, onClose }) => {
    const { t } = useLanguage();
    if (!transaction) return null;
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0f] shadow-2xl z-[101] p-10 flex flex-col transition-colors"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">{t('transact_audit')}</h3>
                            <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl hover:text-brand-primary transition-all"><X size={20}/></button>
                        </div>

                        <div className="space-y-8 flex-grow overflow-y-auto pr-2 scrollbar-hide">
                            <div className="p-8 bg-slate-50 dark:bg-white/[0.03] rounded-[2.5rem] border border-slate-100 dark:border-white/5 text-center relative overflow-hidden group">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{t('transaction_amount')}</div>
                                <div className="text-4xl font-black text-slate-800 dark:text-white italic group-hover:scale-110 transition-transform tracking-tighter">
                                    {parseInt(transaction.amount).toLocaleString()} <span className="text-sm font-normal text-slate-300">UZS</span>
                                </div>
                                <div className={`mt-6 inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${transaction.is_paid ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'}`}>
                                    {transaction.is_paid ? t('verified_final') : t('pending_auth')}
                                </div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl" />
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 pb-2">{t('technical_registry')}</h4>
                                <div className="grid grid-cols-1 gap-4">
                                     <div className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl flex justify-between items-center">
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">{t('registry_id')}</span>
                                         <span className="text-xs font-black text-slate-700 dark:text-white tracking-widest">#{transaction.id}</span>
                                     </div>
                                     <div className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl flex justify-between items-center">
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">{t('booking_link')}</span>
                                         <span className="text-xs font-black text-brand-primary tracking-widest italic">REF-{transaction.booking}</span>
                                     </div>
                                     <div className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl flex justify-between items-center">
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">{t('timestamp')}</span>
                                         <span className="text-xs font-black text-slate-700 dark:text-white">{format(new Date(transaction.timestamp), 'dd MMM yyyy, HH:mm:ss')}</span>
                                     </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 pb-2">{t('payment_meta')}</h4>
                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                     <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white"><CreditCard size={20}/></div>
                                     <div>
                                         <div className="text-[9px] font-black text-indigo-400 uppercase">{t('method')}</div>
                                         <div className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{t('electronic_terminal')}</div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-white/5 grid grid-cols-2 gap-4">
                             <button onClick={() => {
                                 const content = `${t('transact_audit')}\n\n${t('registry_id')}: #${transaction.id}\n${t('booking_link')}: REF-${transaction.booking}\n${t('transaction_amount')}: ${transaction.amount} UZS\n${t('status_matrix')}: ${transaction.is_paid ? t('verified_final') : t('pending_auth')}\n${t('timestamp')}: ${new Date(transaction.timestamp).toLocaleString()}\n${t('method')}: ${t('electronic_terminal')}\n\nGenerated by SmartPark ERP v2.0`;
                                 const blob = new Blob([content], { type: 'text/plain' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `Audit_TXN_${transaction.id}.txt`;
                                 document.body.appendChild(a);
                                 a.click();
                                 document.body.removeChild(a);
                                 toast.success(t('audit_saved'));
                             }} className="py-4 bg-slate-50 dark:bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-brand-primary transition-all">{t('audit_text')}</button>
                             
                             <button onClick={() => {
                                 toast.success(t('printing_ticket'));
                                 setTimeout(() => window.print(), 500);
                             }} className="py-4 bg-slate-900 dark:bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20">{t('print_ticket')}</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const RevenueCard = ({ title, value, subtext, icon: Icon, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3.5rem] shadow-sm relative overflow-hidden group transition-colors"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${color}`}>
                <Icon size={24} />
            </div>
            <div className="flex flex-col items-end">
                <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-1">{title}</div>
                <div className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic group-hover:text-brand-primary transition-colors">{value} <span className="text-xs font-normal text-slate-300">UZS</span></div>
            </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50 dark:border-white/5">
             <TrendingUp size={12} className="text-emerald-500" /> {subtext}
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    </motion.div>
);

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, sRes] = await Promise.all([
                api.get('payments/'),
                api.get('admin/stats/')
            ]);
            setPayments(pRes.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            setStats(sRes.data);
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type) => {
        if (type === 'pdf') {
            const doc = new jsPDF();
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, 50, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(26);
            doc.text('SmartPark Financial Audit', 20, 30);
            const tableData = filteredPayments.map(p => [
                `#${p.id}`, p.booking, `${parseInt(p.amount).toLocaleString()} UZS`,
                format(new Date(p.timestamp), 'dd.MM.yyyy HH:mm'), p.is_paid ? 'PAID' : 'PENDING'
            ]);
            doc.autoTable({
                startY: 60,
                head: [['ID', 'Booking', 'Amount', 'Timestamp', 'Status']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });
            doc.save('SmartPark_Financial_Audit.pdf');
        } else {
            const data = payments.map(p => ({
                'ID': p.id, 'Booking': p.booking, 'Amount': p.amount,
                'Time': p.timestamp ? format(new Date(p.timestamp), 'yyyy-MM-dd HH:mm') : '',
                'Status': p.is_paid ? 'Paid' : 'Pending'
            }));
            exportToCSV(data, 'SmartPark_Financial_Grid');
        }
        toast.success(t('export_ok'));
    };

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.booking?.toString().includes(search);
        const matchesFilter = filter === 'all' || (filter === 'paid' ? p.is_paid : !p.is_paid);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-12 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('revenue_monitoring_v3')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">{t('finance_command')}</h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('transaction_audit_cashflow')}</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                        <input 
                            type="text" placeholder={t('search_by_id')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 py-5 pl-14 pr-6 rounded-3xl text-sm font-black text-slate-600 dark:text-white outline-none focus:border-brand-primary transition-all shadow-sm italic"
                        />
                    </div>
                    <button onClick={() => handleExport('excel')} className="p-5 bg-emerald-500 text-white rounded-3xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"><Landmark size={22} /></button>
                    <button onClick={() => handleExport('pdf')} className="p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 rounded-3xl hover:text-brand-primary transition-all group shadow-sm"><FileText size={22} /></button>
                </div>
            </div>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <RevenueCard 
                    title={t('gross_harvest')} value={(stats?.total_revenue || 0).toLocaleString()} 
                    subtext={t('all_time_net_income')} icon={DollarSign} color="bg-slate-900 border border-white/10 text-white" delay={0.1}
                />
                <RevenueCard 
                    title={t('mission_focus_month')} value={(stats?.month_revenue || 0).toLocaleString()} 
                    subtext={t('current_month_projection')} icon={Wallet} color="bg-indigo-500/10 text-indigo-500" delay={0.2}
                />
                <RevenueCard 
                    title={t('todays_velocity')} value={(stats?.today_revenue || 0).toLocaleString()} 
                    subtext={t('realtime_cashflow')} icon={Zap} color="bg-emerald-500/10 text-emerald-500" delay={0.3}
                />
            </div>

            {/* Flow Trends */}
            <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 rounded-[4rem] shadow-sm group relative overflow-hidden transition-colors">
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">{t('financial_dynamics')}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('seven_day_trajectory')}</p>
                    </div>
                    <div className="flex gap-2 p-1 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        {['all', 'paid', 'pending'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:text-brand-primary'}`}>
                                {f === 'all' ? t('filter_all') : f === 'paid' ? t('filter_paid') : t('filter_pending')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[250px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.chart_data || []}>
                            <defs>
                                <linearGradient id="finCommand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="10 10" stroke={isDark ? "#ffffff05" : "#f1f5f9"} vertical={false} />
                            <XAxis dataKey="name" stroke={isDark ? "#ffffff20" : "#cbd5e1"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ 
                                    background: isDark ? '#1a1a24' : '#fff', 
                                    border: 'none', 
                                    borderRadius: '1.5rem', 
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                                    padding: '1.5rem'
                                }}
                                itemStyle={{ color: '#d946ef', fontWeight: '900', textTransform: 'uppercase', fontSize: '12px' }}
                                labelStyle={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontWeight: '900', marginBottom: '0.5rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey={filter === 'all' ? 'all_revenue' : filter === 'paid' ? 'revenue' : 'pending_revenue'} 
                                stroke="#d946ef" 
                                strokeWidth={5} 
                                fill="url(#finCommand)" 
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transaction Grid */}
            <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[4rem] shadow-sm overflow-hidden min-h-[500px] transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                                <th className="px-12 py-10">{t('transaction_entity')}</th>
                                <th className="px-12 py-10">{t('monetary_value')}</th>
                                <th className="px-12 py-10">{t('temporal_record')}</th>
                                <th className="px-12 py-10">{t('status_matrix')}</th>
                                <th className="px-12 py-10 text-right">{t('verification')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {filteredPayments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedTransaction(p)}>
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-700 font-black text-sm group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all italic">#{p.id}</div>
                                            <div>
                                                <div className="font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">Ref:{p.booking}</div>
                                                <div className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{t('digital_merchant_trace')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="text-xl font-black text-slate-800 dark:text-white italic group-hover:text-brand-primary transition-colors tracking-tighter">
                                            {parseInt(p.amount).toLocaleString()} <span className="text-[10px] text-slate-300 dark:text-slate-600 uppercase font-normal ml-1">UZS</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="flex flex-col">
                                            <div className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{format(new Date(p.timestamp), 'dd MMMM, yyyy')}</div>
                                            <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{format(new Date(p.timestamp), 'HH:mm')} {t('system_time')}</div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${p.is_paid ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.is_paid ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {p.is_paid ? t('status_success') : t('status_pending_matrix')}
                                        </span>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <button className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-primary/10 border border-transparent group-hover:border-brand-primary/20 rounded-2xl transition-all shadow-sm"><Eye size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionDetail 
                transaction={selectedTransaction} isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} 
            />
        </div>
    );
};

export default AdminPayments;
