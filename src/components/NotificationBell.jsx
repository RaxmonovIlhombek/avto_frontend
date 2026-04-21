import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // 30 seconds
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get('notifications/');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.is_read).length);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching notifications:', error);
      }
    }
  };


  const markAsRead = async (id) => {
    try {
      await api.patch(`notifications/${id}/read/`);
      fetchNotifications();
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('notifications/read-all/');
      fetchNotifications();
      toast.success('Barcha xabarlar o\'qildi');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-brand-primary dark:hover:border-brand-primary transition-all group"
      >
        <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-brand-primary animate-swing' : 'text-slate-400 dark:text-white/20 group-hover:text-brand-primary'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-lg shadow-brand-primary/30">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-96 max-h-[500px] overflow-hidden bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl z-50 flex flex-col transition-colors"
            >
              <div className="p-6 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-white/5 transition-colors">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Bildirishnomalar</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-brand-primary hover:underline uppercase"
                  >
                    Hammasini o'qish
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-grow scrollbar-hide">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center">
                    <Bell className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-4 transition-colors" />
                    <p className="text-slate-400 dark:text-slate-600 text-xs font-medium uppercase tracking-widest transition-colors">Xabarlar mavjud emas</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 dark:divide-white/5">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5 group ${!notif.is_read ? 'bg-brand-primary/5' : ''}`}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-brand-primary pulse-mini' : 'bg-transparent'}`} />
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-4 transition-colors">{notif.title}</h5>
                              <span className="text-[9px] font-bold text-slate-300 dark:text-white/20 flex items-center gap-1 uppercase transition-colors">
                                <Clock size={10} /> {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-white/40 font-medium mb-3 leading-relaxed transition-colors">{notif.message}</p>
                            {!notif.is_read && (
                              <button 
                                onClick={() => markAsRead(notif.id)}
                                className="flex items-center gap-2 text-[9px] font-black text-brand-primary uppercase tracking-widest hover:text-brand-primary/80 transition-all transition-colors"
                              >
                                <Check size={12} /> O'qildi deb belgilash
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-50 dark:border-white/5 bg-white dark:bg-[#12121a] text-center transition-colors">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-white transition-colors">Barchasini ko'rish</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
