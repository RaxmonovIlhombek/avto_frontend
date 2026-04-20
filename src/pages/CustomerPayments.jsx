import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Download, Search, 
  CreditCard, Calendar, Hash, ArrowUpRight,
  ShieldCheck, Clock3, AlertCircle, FileText
} from 'lucide-react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const CustomerPayments = () => {
    const { t } = useLanguage();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api.get('payments/');
            // Standard filtering by backend or frontend
            setPayments(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = (id) => {
        toast.success(t('download_receipt') || 'Downloading Receipt...');
        // Simulating PDF generation as we did in admin
    };

    const filteredPayments = payments.filter(p => 
        p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
        p.amount?.toString().includes(search)
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('finance_pulse') || 'Transaction Pulse'}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">{t('payment_history')}</h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('realtime_cashflow') || 'Authorized Financial Audit'}</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="flex-grow md:flex-grow-0 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input 
                            type="text" placeholder={t('search_by_id')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-6 pl-16 pr-6 rounded-[2.5rem] font-bold text-sm outline-none focus:border-brand-primary transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="space-y-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-28 bg-white dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : filteredPayments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPayments.map((payment, idx) => (
                            <motion.div 
                                key={payment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${payment.is_paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none">TRX: {payment.transaction_id || 'ID-' + payment.id}</div>
                                        <div className="text-xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase leading-none">
                                            {payment.amount?.toLocaleString()} <span className="text-xs font-normal opacity-30">UZS</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                            <Calendar size={12} /> {new Date(payment.timestamp).toLocaleDateString()}
                                            <Clock3 size={12} /> {new Date(payment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                    <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${payment.is_paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {payment.is_paid ? t('status_success') : t('kutilmoqda')}
                                    </div>
                                    <button 
                                        onClick={() => handleDownloadReceipt(payment.id)}
                                        className="p-4 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-brand-primary rounded-2xl transition-all"
                                        title={t('download_receipt')}
                                    >
                                        <FileText size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-800"><DollarSign size={48} /></div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">{t('no_payments_yet')}</h4>
                            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1">Transaction audit trail is currently empty</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Industrial Banner */}
            <div className="bg-slate-900 p-10 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden relative">
                <div className="max-w-md relative z-10">
                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter mb-2">{t('merchant_verification_node') || 'Merchant Verification'}</h4>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">All transactions are secured with 256-bit encryption protocol.</p>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-3xl">
                        <ShieldCheck className="text-emerald-500" size={32} />
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Security Status</div>
                            <div className="text-sm font-black italic tracking-tighter uppercase">Fully Encrypted</div>
                        </div>
                    </div>
                </div>
                <CreditCard className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 group-hover:text-white/10 transition-colors" size={192} />
            </div>
        </div>
    );
};

export default CustomerPayments;
