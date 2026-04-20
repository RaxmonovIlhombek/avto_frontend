import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, MapPin, 
  Image as ImageIcon, Info, Check, X, Building, Clock,
  TrendingUp, DollarSign, Activity, ArrowUpRight,
  Phone, Mail, Zap, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const LotSlideOver = ({ data, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState(data || { 
        name: '', address: '', latitude: '', longitude: '', 
        description: '', contact_phone: '', contact_email: '', 
        working_hours: '24/7'
    });
    const [imagePreview, setImagePreview] = useState(data?.image || null);
    const { t } = useLanguage();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
                    />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#0a0a0f] shadow-2xl z-[101] p-10 flex flex-col transition-colors overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">{t('branch_protocol')}</h3>
                            <button onClick={onClose} className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-3xl hover:text-brand-primary transition-all"><X size={20}/></button>
                        </div>

                        <form onSubmit={(e) => onSave(e, formData)} className="space-y-8 flex-grow overflow-y-auto pr-4 scrollbar-hide pb-10">
                             {/* Image Section */}
                             <div className="relative group rounded-[3rem] overflow-hidden border-2 border-dashed border-slate-100 dark:border-white/5 aspect-video flex items-center justify-center bg-slate-50 dark:bg-white/[0.02]">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Preview"/>
                                ) : (
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto"><ImageIcon size={32}/></div>
                                        <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{t('architectural_viz')}</div>
                                    </div>
                                )}
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                             </div>

                             <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('entity_name')}</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl font-black text-slate-800 dark:text-white outline-none focus:border-brand-primary transition-all" placeholder="..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('operational_hours')}</label>
                                    <input type="text" value={formData.working_hours} onChange={(e) => setFormData({...formData, working_hours: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl font-black text-slate-800 dark:text-white outline-none focus:border-brand-primary transition-all" placeholder="24/7" />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('location_address')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5" />
                                    <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 py-5 pl-14 pr-6 rounded-3xl font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-brand-primary transition-all" />
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('contact_phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                        <input type="text" value={formData.contact_phone} onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 py-5 pl-14 pr-6 rounded-3xl font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-brand-primary transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('coordinates')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="text" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl text-center font-bold text-xs" placeholder="Lat"/>
                                        <input type="text" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl text-center font-bold text-xs" placeholder="Lng"/>
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('strategic_desc')}</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-6 rounded-[2.5rem] text-sm font-medium text-slate-600 dark:text-slate-300 min-h-[120px]" placeholder="..." />
                             </div>

                             <button type="submit" className="w-full bg-brand-primary text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-brand-primary/30 mt-6 flex items-center justify-center gap-4 active:scale-95 transition-all">
                                <Check size={24} /> {data?.id ? t('commit_changes') : t('deploy_branch')}
                             </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

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

const AdminParkingLots = () => {
    const [lots, setLots] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingLot, setEditingLot] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const { theme } = useTheme();

    useEffect(() => {
        if (!authLoading && user) {
            fetchData();
        }
    }, [authLoading, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [lRes, sRes] = await Promise.all([
                api.get('lots/'),
                api.get('admin/stats/')
            ]);
            setLots(lRes.data);
            setStats(sRes.data);
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e, lotData) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(lotData).forEach(key => {
            if (lotData[key] !== null && lotData[key] !== undefined) {
                if (key === 'image' && lotData[key] instanceof File) {
                    formData.append(key, lotData[key]);
                } else if (key !== 'image') {
                    formData.append(key, lotData[key]);
                }
            }
        });

        try {
            if (lotData.id) {
                await api.patch(`lots/${lotData.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success(t('branch_metrics_updated'));
            } else {
                await api.post('lots/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success(t('new_branch_deployed'));
            }
            setEditingLot(null);
            setIsAdding(false);
            fetchData();
        } catch (error) {
            toast.error(t('validation_failure'));
        }
    };

    const deleteLot = async (id) => {
        if (!window.confirm(t('terminate_branch_prompt'))) return;
        try {
            await api.delete(`lots/${id}/`);
            toast.success(t('branch_archived'));
            fetchData();
        } catch (error) {
            toast.error(t('access_denied'));
        }
    };

    // Merge logic: Combine lot data with its specific analytics from stats
    const enhancedLots = lots.map(lot => {
        const lotStats = stats?.lots_occupancy?.find(s => s.name === lot.name) || { rate: 0, occupied: 0, total: 0 };
        const lotRevenue = stats?.revenue_by_lot?.find(r => r.name === lot.name)?.revenue || 0;
        return { ...lot, ...lotStats, revenue: lotRevenue };
    });

    return (
        <div className="space-y-12 pb-20 transition-colors duration-300">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('multi_location_mesh')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">{t('branch_control')}</h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('enterprise_location_strategy')}</p>
                </div>

                <button onClick={() => setIsAdding(true)} className="bg-brand-primary text-white flex items-center gap-3 px-10 py-6 rounded-[2.5rem] shadow-2xl shadow-brand-primary/30 font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    <Plus size={24} /> {t('deploy_new_location')}
                </button>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <KPICard title={t('operational_nodes')} value={enhancedLots.length} icon={Building} color="bg-slate-900 text-white border border-white/10" delay={0.1} />
                <KPICard title={t('aggregate_capacity')} value={enhancedLots.reduce((acc, l) => acc + (l.total || 0), 0)} icon={Activity} color="bg-indigo-500/10 text-indigo-500" delay={0.2} />
                <KPICard title={t('total_yield')} value={`${(stats?.total_revenue || 0).toLocaleString()}`} icon={DollarSign} color="bg-emerald-500/10 text-emerald-500" delay={0.3} />
            </div>

            {/* Enhanced Branch Mesh */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {enhancedLots.map((lot, idx) => (
                    <motion.div 
                        key={lot.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[4rem] p-10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-10 relative z-10">
                            {/* Visual Engine */}
                            <div className="shrink-0 w-full md:w-56 h-56 bg-slate-50 dark:bg-white/5 rounded-[3.5rem] border border-slate-100 dark:border-white/5 overflow-hidden flex items-center justify-center relative shadow-inner group-hover:border-brand-primary/20 transition-all">
                                {lot.image ? (
                                    <img src={lot.image} alt={lot.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                ) : (
                                    <div className="text-center space-y-2 opacity-30 group-hover:opacity-100 transition-all">
                                        <Building size={64} className="text-slate-300 dark:text-slate-600 mx-auto" />
                                        <div className="text-[8px] font-black uppercase tracking-tighter">{t('no_asset_visual')}</div>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest">{t('active_node')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Data Layer */}
                            <div className="flex-grow flex flex-col justify-between py-2">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter group-hover:text-brand-primary transition-colors leading-none">{lot.name}</h3>
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 font-bold text-[10px] mt-2 italic">
                                                <MapPin size={12} className="text-brand-primary" /> {lot.address}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-brand-primary italic leading-none">{lot.revenue?.toLocaleString()}</div>
                                            <div className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{t('accumulated_uzs')}</div>
                                        </div>
                                    </div>

                                    {/* Occupancy Engine */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('realtime_load')}</span>
                                            <span className="text-xs font-black text-slate-800 dark:text-white italic">{lot.occupied} <span className="opacity-30">/</span> {lot.total} <span className="text-[10px] opacity-40 uppercase font-normal ml-1">{t('spaces')}</span></span>
                                        </div>
                                        <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-slate-100 dark:border-white/10">
                                             <motion.div 
                                                initial={{ width: 0 }} animate={{ width: `${lot.rate || 0}%` }} transition={{ duration: 1.5, delay: 0.5 }}
                                                className={`h-full rounded-full flex items-center justify-end pr-2 transition-all ${lot.rate > 80 ? 'bg-rose-500' : lot.rate > 50 ? 'bg-amber-500' : 'bg-brand-primary shadow-lg shadow-brand-primary/30'}`}
                                             >
                                                 <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
                                             </motion.div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button onClick={() => setEditingLot(lot)} className="flex-grow bg-slate-900 dark:bg-white/5 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-brand-primary hover:shadow-xl hover:shadow-brand-primary/20 group/btn border border-transparent hover:border-white/10">
                                        <Edit3 size={16} className="group-hover/btn:scale-110 transition-transform"/> {t('manage_branch')}
                                    </button>
                                    <button onClick={() => deleteLot(lot.id)} className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl transition-all hover:bg-rose-500 hover:text-white border border-transparent hover:border-rose-500/20 active:scale-90">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Building className="absolute -bottom-16 -right-16 w-64 h-64 text-slate-50/50 dark:text-white/[0.02] group-hover:text-brand-primary/5 transition-all duration-1000 -rotate-12 z-0" size={320} />
                    </motion.div>
                ))}
            </div>

            <LotSlideOver 
                data={editingLot} isOpen={!!editingLot || isAdding} 
                onClose={() => { setEditingLot(null); setIsAdding(false); }} 
                onSave={handleSave} 
            />
        </div>
    );
};

export default AdminParkingLots;
