import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Trash2, CheckCircle2, 
  XCircle, Clock, Calendar, Car, User, 
  ArrowUpDown, ExternalLink, Phone, Hash,
  Download, FileText, MoreHorizontal
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportToCSV } from '../utils/exportCsv';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import LicensePlate from '../components/LicensePlate';

const StatusBadge = ({ status, t }) => {
  const styles = {
    active: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    completed: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    cancelled: 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };
  
  const statusLabels = {
    active: t('faol'),
    completed: t('tugallandi'),
    cancelled: t('bekor_qilindi'),
    pending: t('kutilmoqda')
  };

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${styles[status] || 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
      {statusLabels[status] || status}
    </span>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('bookings/');
      setBookings(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      toast.error(t('error_loading') || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm(t('bekor_qilindi') + "?")) return;
    
    try {
      await api.patch(`bookings/${id}/`, { status: 'cancelled' });
      toast.success(t('bekor_qilindi'));
      fetchBookings();
    } catch (error) {
      toast.error(t('error_loading'));
    }
  };

  const filteredBookings = bookings.filter(b => {
    const searchLower = search.toLowerCase();
    const title = b.user_detail?.username || '';
    const identifier = b.space_detail?.identifier || '';
    const carNumber = b.car_number || '';
    const phoneNumber = b.phone_number || '';

    const matchesSearch = 
        title.toLowerCase().includes(searchLower) || 
        identifier.toLowerCase().includes(searchLower) ||
        carNumber.toLowerCase().includes(searchLower) ||
        phoneNumber.includes(searchLower);
        
    const matchesFilter = filter === 'all' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">{t('bookings').split(' ')[0]} <span className="text-brand-primary">{t('bookings').split(' ')[1] || ''}</span></h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{t('monitoring_reservations')}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t('search')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 py-5 pl-14 pr-6 rounded-3xl text-sm text-slate-600 dark:text-white outline-none focus:border-brand-primary transition-all shadow-sm"
            />
          </div>
          <button 
            className="p-5 bg-brand-primary text-white rounded-3xl hover:opacity-90 transition-all shadow-lg shadow-brand-primary/30"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
          {['all', 'active', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-white/5 hover:bg-slate-50'}`}
              >
                  {t(tab === 'all' ? 'barchasi' : tab) || tab}
              </button>
          ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[4rem] shadow-sm overflow-hidden min-h-[500px] transition-colors">
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 dark:text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                  <th className="px-10 py-8 font-medium">{t('slot_action')}</th>
                  <th className="px-10 py-8 font-medium">{t('user_col')}</th>
                  <th className="px-10 py-8 font-medium">{t('time_col')}</th>
                  <th className="px-10 py-8 font-medium text-center">{t('status_col')}</th>
                  <th className="px-10 py-8 font-medium text-right">{t('amal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter group-hover:text-brand-primary transition-colors">
                            {booking.space_detail.identifier}
                        </div>
                        <div className="bg-slate-100 dark:bg-[#12121a] p-1 rounded-2xl relative inline-block">
                           <LicensePlate number={booking.car_number || t('na')} label="" size="sm" className="scale-90 origin-left" />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-800 dark:text-white tracking-tight">{booking.user_detail.username}</div>
                      <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 tracking-widest uppercase">{booking.phone_number || t('na')}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Clock size={14} className="text-brand-primary" />
                        {booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : ''}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">
                          {booking.created_at ? format(new Date(booking.created_at), 'dd MMM, yyyy') : ''}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <StatusBadge status={booking.status} t={t} />
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button onClick={() => cancelBooking(booking.id)} className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
