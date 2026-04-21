import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Globe, DollarSign, 
  Clock, Bell, Shield, Wallet, 
  ChevronRight, Info, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'SmartPark CRM',
    currency: 'UZS',
    hourlyRate: '5000',
    workHours: '24/7',
    paymentSim: true,
    notifications: true,
    auditLogs: true
  });

  const handleSave = () => {
    // Simulating save
    toast.success('Sozlamalar saqlandi');
  };

  const SettingSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm transition-colors duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 transition-colors">
           <Icon size={24} />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter transition-colors">{title}</h3>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl transition-colors">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">{label}</span>
      <button 
        onClick={() => onChange(!enabled)}
        className={`w-14 h-8 rounded-full transition-all relative ${enabled ? 'bg-brand-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
      >
        <motion.div 
          animate={{ x: enabled ? 26 : 4 }}
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase transition-colors">Tizim <span className="text-brand-primary">Sozlamalari</span></h2>
          <p className="text-slate-400 dark:text-slate-600 text-sm font-medium transition-colors">Loyiha parametrlarini global boshqarish paneli</p>
        </div>
        <button 
            onClick={handleSave}
            className="bg-slate-900 dark:bg-brand-primary text-white flex items-center gap-3 px-10 py-5 rounded-[2.5rem] shadow-xl shadow-slate-900/20 font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all group"
        >
          <Save size={20} className="group-hover:rotate-12 transition-transform" /> O'zgarishlarni Saqlash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <SettingSection icon={Globe} title="Asosiy Ma'lumotlar">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest ml-1">Loyiha Nomi</label>
              <input 
                type="text" 
                value={settings.siteName || ''}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:border-brand-primary transition-all transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest ml-1">Valyuta</label>
                    <select 
                        value={settings.currency || 'UZS'}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-2xl font-bold text-slate-800 dark:text-white outline-none transition-colors"
                    >
                        <option value="UZS">UZS (So'm)</option>
                        <option value="USD">USD ($)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest ml-1">Ish vaqti</label>
                    <select 
                        value={settings.workHours || '24/7'}
                        onChange={(e) => setSettings({...settings, workHours: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-2xl font-bold text-slate-800 dark:text-white outline-none transition-colors"
                    >
                        <option value="24/7">24 / 7 Rejim</option>
                        <option value="09:00-18:00">09:00 - 18:00</option>
                    </select>
                </div>
            </div>
        </SettingSection>

        <SettingSection icon={Wallet} title="Moliya va To'lov">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Standart soatlik narx</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input 
                  type="number" 
                  value={settings.hourlyRate}
                  onChange={(e) => setSettings({...settings, hourlyRate: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 py-5 pl-14 pr-6 rounded-2xl font-black text-xl text-brand-primary outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>
            <Toggle 
                label="To'lov simulyatsiyasi" 
                enabled={settings.paymentSim} 
                onChange={(v) => setSettings({...settings, paymentSim: v})} 
            />
            <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                <Info className="text-amber-500 shrink-0" size={20} />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">Hozirgi vaqtda barcha to'lovlar test rejimida amalga oshirilmoqda. Real API ulash uchun Admin bilan bog'laning.</p>
            </div>
        </SettingSection>

        <SettingSection icon={Bell} title="Bildirishnomalar">
            <Toggle 
                label="Tizim bildirishnomalari" 
                enabled={settings.notifications} 
                onChange={(v) => setSettings({...settings, notifications: v})} 
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Admin Xabarnomasi (Test)</label>
              <textarea 
                placeholder="Barcha foydalanuvchilarga xabar yuborish..."
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-medium text-slate-600 outline-none focus:border-brand-primary transition-all h-32 resize-none"
              />
              <button 
                  onClick={() => toast.success('Xabar navbatga qo\'shildi')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                  Xabarni Tarqatish
              </button>
            </div>
        </SettingSection>

        <SettingSection icon={Shield} title="Xavfsizlik va Loglar">
            <Toggle 
                label="Audit Loglarni yozish" 
                enabled={settings.auditLogs} 
                onChange={(v) => setSettings({...settings, auditLogs: v})} 
            />
            <div className="p-6 bg-slate-900 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-brand-primary transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                        <Clock size={18} />
                    </div>
                    <div>
                        <div className="text-white text-xs font-black uppercase tracking-widest italic tracking-tighter">Audit Loglarini Ko'rish</div>
                        <div className="text-white/30 text-[9px] uppercase font-bold">Oxirgi harakatlar: 148 ta</div>
                    </div>
                </div>
                <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
            </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default AdminSettings;
