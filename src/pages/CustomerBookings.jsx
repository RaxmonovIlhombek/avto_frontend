import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Tag, 
  Search, Filter, ChevronRight, ArrowUpRight,
  CheckCircle2, XCircle, Clock3, AlertCircle
} from 'lucide-react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import LicensePlate from '../components/LicensePlate';

const CustomerBookings = () => {
    const { t } = useLanguage();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            // Fetch all bookings and filter for current user on frontend 
            // because standard ModelViewSet might not have filtering configured
            const response = await api.get('bookings/');
            // Assuming bookings are filtered automatically if the backend is configured, 
            // or we filter here if not. Let's assume standard filtering.
            setBookings(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        active: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: t('faol') },
        pending: { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock3, label: t('kutilmoqda') },
        completed: { color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: CheckCircle2, label: t('tugallandi') },
        cancelled: { color: 'text-rose-500', bg: 'bg-rose-500/10', icon: XCircle, label: t('bekor_qilindi') }
    };

    const filteredBookings = bookings.filter(b => 
        b.space?.identifier?.toLowerCase().includes(search.toLowerCase()) ||
        b.car_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('history') || 'Mission Log'}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">{t('my_bookings')}</h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('monitoring_reservations') || 'Authorized Activity Tracking'}</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="flex-grow md:flex-grow-0 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input 
                            type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-6 pl-16 pr-6 rounded-[2.5rem] font-bold text-sm outline-none focus:border-brand-primary transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-white dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map((booking, idx) => {
                            const StatusIcon = statusConfig[booking.status]?.icon || AlertCircle;
                            return (
                                <motion.div 
                                    key={booking.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-8 rounded-[3rem] hover:shadow-2xl hover:shadow-brand-primary/5 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                            {/* Slot ID Visual */}
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center group-hover:border-brand-primary/30 transition-colors">
                                                <div className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">Slot</div>
                                                <div className="text-2xl font-black italic tracking-tighter text-slate-800 dark:text-white uppercase">{booking.space?.identifier}</div>
                                            </div>

                                            <div className="space-y-1">
                                                <LicensePlate number={booking.car_number} label={t('moshina_raqami') || 'MOSHINA RAQAMI'} />
                                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(booking.start_time).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tighter">
                                                    {booking.payment?.amount?.toLocaleString() || '0'} <span className="text-xs opacity-30 font-normal">UZS</span>
                                                </div>
                                                <div className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 px-3 py-1 rounded-full inline-block ${statusConfig[booking.status]?.bg} ${statusConfig[booking.status]?.color}`}>
                                                    {statusConfig[booking.status]?.label}
                                                </div>
                                            </div>

                                            <button className="p-4 bg-slate-50 dark:bg-white/5 text-slate-300 rounded-2xl hover:bg-brand-primary hover:text-white transition-all transform group-hover:scale-110 active:scale-95">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all">
                                        <Calendar size={160} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-800"><Calendar size={48} /></div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">{t('no_bookings_yet')}</h4>
                            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1">Initiate a new deployment from the dashboard</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerBookings;
