import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, ShieldCheck, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';

const QRModal = ({ isOpen, onClose, booking }) => {
    const { t } = useLanguage();

    if (!booking) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-[#12121a] rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/5"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-primary/10 to-transparent" />
                        
                        <div className="relative p-10 pt-12 text-center">
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl transition-all"
                            >
                                <X size={20} />
                            </button>

                            {/* Icon */}
                            <div className="w-16 h-16 bg-brand-primary rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-brand-primary/30">
                                <QrCode size={32} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase mb-2">
                                {t('qr_code_title')}
                            </h3>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 leading-relaxed">
                                {t('qr_code_desc')}
                            </p>

                            {/* QR Container */}
                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-inner inline-block mb-10 border-4 border-slate-50 dark:border-white/5">
                                <QRCodeSVG 
                                    value={booking.qr_token || ''}
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                    className="rounded-xl"
                                />
                                {/* Corner Decorations */}
                                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-brand-primary rounded-tl-2xl" />
                                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-brand-primary rounded-tr-2xl" />
                                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-brand-primary rounded-bl-2xl" />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-brand-primary rounded-br-2xl" />
                            </div>

                            {/* UUID Display */}
                            <div className="bg-slate-50 dark:bg-white/5 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 mb-10 border border-slate-100 dark:border-white/10 group cursor-default">
                                <ShieldCheck size={16} className="text-brand-primary" />
                                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                                    TOKEN ID: {booking.qr_token}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                                    <Download size={16} />
                                    {t('saqlash')}
                                </button>
                                <button className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                                    <Share2 size={16} />
                                    {t('ulashish')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QRModal;
