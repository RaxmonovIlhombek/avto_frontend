import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, Check, X, 
  Settings2, Tag, Info, AlertTriangle, Box,
  Building, Car, Calendar, Search, Filter, 
  ChevronRight, ArrowUpRight, LayoutGrid, List,
  Zap, ShieldAlert, Sparkles, Layers
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const SpaceSlideOver = ({ data, isOpen, onClose, onSave, lots }) => {
    const [formData, setFormData] = useState(data || { 
        identifier: '', space_type: 'regular', status: 'available', 
        price_per_hour: 5000, parking_lot: lots[0]?.id || ''
    });
    const { t } = useLanguage();

    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]" />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0f] shadow-2xl z-[101] p-10 flex flex-col transition-colors overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">{t('slot_config')}</h3>
                            <button onClick={onClose} className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-3xl hover:text-brand-primary transition-all"><X size={20}/></button>
                        </div>

                        <form onSubmit={(e) => onSave(e, formData)} className="space-y-8 flex-grow overflow-y-auto pr-4 scrollbar-hide">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('identifier')}</label>
                                <input type="text" required value={formData.identifier} onChange={(e) => setFormData({...formData, identifier: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-6 rounded-3xl font-black text-3xl text-slate-800 dark:text-white outline-none focus:border-brand-primary transition-all uppercase" placeholder="e.g. A-12" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('assigned_branch')}</label>
                                <select required value={formData.parking_lot} onChange={(e) => setFormData({...formData, parking_lot: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl font-bold text-slate-600 dark:text-slate-300 outline-none">
                                    <option value="">{t('select_location')}</option>
                                    {lots.map(lot => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('asset_class')}</label>
                                    <select value={formData.space_type} onChange={(e) => setFormData({...formData, space_type: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl font-bold text-slate-600 dark:text-slate-300 outline-none">
                                        <option value="regular">{t('regular_space')}</option>
                                        <option value="vip">{t('vip_premium')}</option>
                                        <option value="disabled">{t('accessibility')}</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('live_status')}</label>
                                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-3xl font-bold text-slate-600 dark:text-slate-300 outline-none">
                                        <option value="available">{t('status_available')}</option>
                                        <option value="occupied">{t('status_occupied')}</option>
                                        <option value="booked">{t('status_booked')}</option>
                                        <option value="maintenance">{t('status_maintenance')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('yield_per_hour')}</label>
                                <div className="relative">
                                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5" />
                                    <input type="number" required value={formData.price_per_hour} onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 py-5 pl-14 pr-6 rounded-3xl font-black text-2xl text-slate-800 dark:text-white outline-none focus:border-brand-primary transition-all" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand-primary text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-brand-primary/30 mt-6 flex items-center justify-center gap-4 active:scale-95 transition-all">
                                <Check size={24} /> {data?.id ? t('commit_btn') : t('deploy_btn')}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const KPIBadge = ({ title, value, color }) => (
    <div className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex-grow min-w-[150px]">
        <div className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1">{title}</div>
        <div className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</div>
    </div>
);

const AdminSpaces = () => {
    const [spaces, setSpaces] = useState([]);
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSpace, setEditingSpace] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedLot, setSelectedLot] = useState('all');
    const [search, setSearch] = useState('');
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [spacesRes, lotsRes] = await Promise.all([
                api.get('spaces/'),
                api.get('lots/')
            ]);
            setSpaces(spacesRes.data.sort((a, b) => a.identifier.localeCompare(b.identifier, undefined, {numeric: true})));
            setLots(lotsRes.data);
        } catch (error) {
            toast.error(t('error_loading'));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e, spaceData) => {
        e.preventDefault();
        try {
            if (spaceData.id) {
                await api.patch(`spaces/${spaceData.id}/`, spaceData);
                toast.success(t('space_updated'));
            } else {
                await api.post('spaces/', spaceData);
                toast.success(t('new_space_deployed'));
            }
            setEditingSpace(null);
            setIsAdding(false);
            fetchData();
        } catch (error) {
            toast.error(t('strategic_failure'));
        }
    };

    const deleteSpace = async (id) => {
        if (!window.confirm(t('terminate_space_prompt'))) return;
        try {
            await api.delete(`spaces/${id}/`);
            toast.success(t('space_deleted'));
            fetchData();
        } catch (error) {
            toast.error(t('delete_failed'));
        }
    };

    const filteredSpaces = spaces.filter(s => {
        const matchesLot = selectedLot === 'all' || s.parking_lot?.id?.toString() === selectedLot.toString() || s.parking_lot?.toString() === selectedLot.toString();
        const matchesSearch = s.identifier.toLowerCase().includes(search.toLowerCase());
        return matchesLot && matchesSearch;
    });

    const stats = {
        available: filteredSpaces.filter(s => s.status === 'available').length,
        occupied: filteredSpaces.filter(s => s.status === 'occupied').length,
        maintenance: filteredSpaces.filter(s => s.status === 'maintenance').length,
        total: filteredSpaces.length
    };

    const statusConfig = {
        available: { color: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        occupied: { color: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10' },
        booked: { color: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' },
        maintenance: { color: 'bg-slate-400', text: 'text-slate-400', bg: 'bg-slate-400/10' }
    };

    return (
        <div className="space-y-12 pb-20 transition-colors duration-300">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] italic">{t('tactical_mesh')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">{t('parking_matrix')}</h2>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">{t('space_management_desc')}</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="flex-grow md:flex-grow-0 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input 
                            type="text" placeholder={t('search_spaces')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-6 pl-16 pr-6 rounded-[2.5rem] font-bold text-sm outline-none focus:border-brand-primary transition-all"
                        />
                    </div>
                    <button onClick={() => setIsAdding(true)} className="flex-grow md:flex-grow-0 bg-brand-primary text-white flex items-center justify-center gap-3 px-10 py-6 rounded-[2.5rem] shadow-2xl shadow-brand-primary/30 font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                        <Plus size={24} /> {t('deploy_sector')}
                    </button>
                </div>
            </div>

            {/* Tactical Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <KPIBadge title={t('matrix_load')} value={stats.total} color="text-slate-800 dark:text-white" />
                    <KPIBadge title={t('status_available')} value={stats.available} color="text-emerald-500" />
                    <KPIBadge title={t('status_occupied')} value={stats.occupied} color="text-rose-500" />
                    <KPIBadge title={t('status_maintenance')} value={stats.maintenance} color="text-slate-400" />
                </div>
                <div className="lg:col-span-4 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('location_filtering')}</label>
                    <div className="flex bg-slate-100 dark:bg-white/5 p-2 rounded-[2rem] gap-2">
                        <button onClick={() => setSelectedLot('all')} className={`flex-grow py-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedLot === 'all' ? 'bg-white dark:bg-white/10 text-brand-primary shadow-sm' : 'text-slate-400'}`}>{t('global_filter')}</button>
                        {lots.map(lot => (
                            <button key={lot.id} onClick={() => setSelectedLot(lot.id)} className={`flex-grow py-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedLot.toString() === lot.id.toString() ? 'bg-white dark:bg-white/10 text-brand-primary shadow-sm' : 'text-slate-400'}`}>{lot.name.split(' ')[0]}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* The High-Density Matrix Grid */}
            <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 p-10 md:p-14 rounded-[4rem] shadow-sm relative overflow-hidden transition-colors min-h-[600px]">
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {filteredSpaces.map((space, idx) => (
                            <motion.button 
                                key={space.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: idx * 0.01 }}
                                onClick={() => setEditingSpace(space)}
                                className={`
                                    aspect-[4/5] rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-3 relative group transition-all transform hover:scale-110 hover:z-20 hover:shadow-2xl active:scale-95
                                    ${statusConfig[space.status].bg} ${statusConfig[space.status].color.replace('bg-', 'border-').replace('text-', 'border-')}/20 ${statusConfig[space.status].text}
                                    hover:${statusConfig[space.status].color.replace('bg-', 'border-').replace('text-', 'border-')}
                                `}
                            >
                                <div className="text-2xl font-black italic tracking-tighter uppercase leading-none group-hover:scale-110 transition-transform">{space.identifier}</div>
                                <div className="text-[7px] font-black uppercase tracking-[0.2em] opacity-50">{space.space_type}</div>
                                
                                {space.status === 'occupied' && <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}><Car size={24} className="text-rose-500"/></motion.div>}
                                {space.status === 'booked' && <Calendar size={20} className="text-amber-500"/>}
                                {space.status === 'maintenance' && <ShieldAlert size={20} className="text-slate-400"/>}
                                {space.status === 'available' && <Zap size={18} className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />}

                                {space.space_type === 'vip' && <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-[#12121a] shadow-lg shadow-amber-500/30"><Sparkles size={10} /></div>}
                                
                                <div className={`absolute bottom-3 w-1.5 h-1.5 rounded-full ${statusConfig[space.status].color} animate-pulse`} />
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {/* Quick Add Placeholder Card */}
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="aspect-[4/5] rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center justify-center gap-2 text-slate-200 dark:text-slate-800 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all transition-colors"
                    >
                        <Plus size={32} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{t('new_sector')}</span>
                    </button>
                 </div>

                 {filteredSpaces.length === 0 && (
                    <div className="h-96 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-800"><Layers size={48} /></div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">{t('null_mesh_detected')}</h4>
                            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1">{t('no_spaces_found')}</p>
                        </div>
                    </div>
                 )}

                 <Box className="absolute -bottom-20 -right-20 w-80 h-80 text-slate-50/50 dark:text-white/[0.02] -rotate-12 pointer-events-none" size={320} />
            </div>

            {/* Quick Batch Tools (Simple Simulation for Bulk Add) */}
            <div className="bg-slate-900 p-10 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden relative">
                <div className="max-w-md relative z-10">
                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter mb-2">{t('bulk_generation_terminal')}</h4>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{t('bulk_gen_desc')}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto relative z-10">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-3xl p-2 pl-6 gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('sequence_range')}</span>
                        <input type="text" placeholder={t('sequence_placeholder')} className="bg-transparent text-brand-primary font-black italic text-xl outline-none w-32 placeholder:text-white/10" />
                    </div>
                    <button className="bg-brand-primary px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-brand-primary/40 hover:scale-105 active:scale-95 transition-all">{t('execute_btn')}</button>
                </div>
                <Zap className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 group-hover:text-white/10 transition-colors" size={192} />
            </div>

            <SpaceSlideOver 
                data={editingSpace} isOpen={!!editingSpace || isAdding} 
                onClose={() => { setEditingSpace(null); setIsAdding(false); }} 
                onSave={handleSave} 
                lots={lots}
            />
        </div>
    );
};

export default AdminSpaces;
