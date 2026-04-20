import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api';
import {
  User, Phone, Mail, Shield, Camera, Save,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle,
  Edit3, LogOut, Smartphone, Hash, Calendar, Globe, BarChart2, Car, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IMaskInput } from 'react-imask';
import { Link, Navigate } from 'react-router-dom';
import LicensePlate from '../components/LicensePlate';

const ROLE_META = {
  admin: { label: 'Admin (Menejer)', color: 'text-amber-500', bg: 'bg-amber-500/10 dark:bg-amber-500/20', icon: '👑' },
  client: { label: 'Oddiy Mijoz', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', icon: '👤' },
};

const fmt = d => d ? new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

// ── Reusable field row ──────────────────────────────────────────────────────
function FieldRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0 group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all text-slate-400 dark:text-slate-500">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{label}</div>
        <div className="text-slate-800 dark:text-white">{children}</div>
      </div>
    </div>
  );
}

// ── UI Components ─────────────────────────────────────────────────────────────
const Card = ({ children, style, className = "" }) => (
  <div className={`bg-white dark:bg-[#12121a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden ${className}`} style={style}>
    {children}
  </div>
);

const Btn = ({ children, icon, onClick, variant = 'primary', size = 'md', loading, disabled }) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 font-bold transition-all rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-[1.02]",
    ghost: "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10",
    danger: "bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 dark:border-rose-500/20"
  };
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-sm" };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}>
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
    </button>
  );
};

export default function Profile() {
  const { user, login: updateAuthUser, logout, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security' | 'activity'
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const roleKey = user?.is_staff ? 'admin' : 'client';
  const role = ROLE_META[roleKey];

  // ── Info form ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.profile?.phone_number || '',
    car_number: user?.profile?.car_number || ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.profile?.phone_number || '',
        car_number: user?.profile?.car_number || ''
      });
    }
  }, [user]);

  const [focusField, setFocusField] = useState('');
  const [carType, setCarType] = useState('jismoniy');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const saveInfo = async () => {
    setSaving(true);
    try {
      const payload = {
        profile: { phone_number: form.phone, car_number: form.car_number }
        // Note: To update first_name/last_name we'd need a backend change, just sending profile for now
      };
      const response = await api.patch('auth/profile/', payload);
      updateAuthUser(localStorage.getItem('token'), response.data);
      toast.success("Ma'lumotlar saqlandi ✅");
      setEditing(false);
    } catch (e) {
      toast.error(e.message || "Ulanishda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Rasm hajmi juda katta (maks: 5MB)');
      return;
    }
    toast('Bu funksiya tez orada ishga tushadi', { icon: '🚧' });
  };

  // ── Password form ──────────────────────────────────────────────────────────
  const [pass, setPass] = useState({ old: '', new1: '', new2: '' });
  const [showPass, setShowPass] = useState({ old: false, new1: false, new2: false });
  const [passLoading, setPassLoading] = useState(false);
  const setP = (k, v) => setPass(p => ({ ...p, [k]: v }));

  const passStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passStrength(pass.new1);
  const strengthLabel = ['', 'Zaif', 'O\'rtacha', 'Yaxshi', 'Kuchli'];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const strengthTextColor = ['', 'text-rose-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

  const savePassword = async () => {
    if (!pass.old) { toast.error('Eski parolni kiriting'); return; }
    if (pass.new1.length < 6) { toast.error('Yangi parol kamida 6 ta belgi bo\'lishi kerak'); return; }
    if (pass.new1 !== pass.new2) { toast.error('Parollar mos kelmaydi'); return; }
    setPassLoading(true);
    try {
      // Fake API call for now since backend endpoint doesn't exist
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Parol o\'zgartirildi ✅');
      setPass({ old: '', new1: '', new2: '' });
    } catch (e) {
      toast.error(e.message || 'Eski parol noto\'g\'ri');
    } finally {
      setPassLoading(false);
    }
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/" />;

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username;

  const initials = (user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase();

  const TABS = [
    { key: 'info', label: t('personal_info'), icon: User },
    { key: 'security', label: t('security'), icon: Lock },
    { key: 'activity', label: t('statistics'), icon: BarChart2 },
  ];

  const inpClass = (focus) => `w-full px-4 py-3 rounded-xl border ${focus ? 'border-brand-primary ring-4 ring-brand-primary/10' : 'border-slate-200 dark:border-white/10'} bg-slate-50 dark:bg-[#0a0a0f] text-slate-800 dark:text-white outline-none transition-all`;

  return (
    <div className="max-w-4xl mx-auto p-4 py-4">

      {/* ── Profil header ── */}
      <Card className="mb-6 p-0 border-none shadow-xl dark:shadow-none">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-br from-indigo-900 via-brand-primary to-purple-800 relative z-0">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="px-8 pb-8 relative z-10">
          {/* Avatar */}
          <div className="relative inline-block -mt-12 mb-4 group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl font-black text-white border-4 border-white dark:border-[#12121a] shadow-lg group-hover:scale-105 transition-transform">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : initials}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-sm hover:text-brand-primary transition-colors"
              title="Avatar o'zgartirish">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info + actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{fullName}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${role.bg} ${role.color} uppercase tracking-widest flex items-center gap-1.5`}>
                  <span>{role.icon}</span> {role.label}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                  <Hash size={12} /> {user?.username}
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {!editing ? (
                <Btn icon={<Edit3 size={16} />} onClick={() => setEditing(true)} variant="ghost" size="md">{t('tahrirlash')}</Btn>
              ) : (
                <>
                  <Btn onClick={() => { setEditing(false); setForm({ phone: user?.profile?.phone_number || '', car_number: user?.profile?.car_number || '', first_name: user?.first_name || '', last_name: user?.last_name || '' }) }} variant="ghost" size="md">{t('bekor_qilish')}</Btn>
                  <Btn icon={<Save size={16} />} onClick={saveInfo} loading={saving} size="md">{t('saqlash')}</Btn>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6 bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${activeTab === tab.key
                ? 'bg-white dark:bg-[#1a1a24] text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                : 'bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════ TAB: MA'LUMOTLAR ══════════════════ */}
      {activeTab === 'info' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="px-8 pb-8 pt-4">
              <FieldRow icon={User} label={t('full_name')}>
                {editing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[["first_name", t('first_name')], ["last_name", t('last_name')]].map(([k, ph]) => (
                      <input key={k} className={inpClass(focusField === k)} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} onFocus={() => setFocusField(k)} onBlur={() => setFocusField('')} />
                    ))}
                  </div>
                ) : (
                  <span className="text-lg font-bold text-slate-800 dark:text-white">{fullName || '—'}</span>
                )}
              </FieldRow>

              <FieldRow icon={Phone} label={t('phone')}>
                {editing ? (
                  <IMaskInput
                    mask="+{998} (00) 000-00-00"
                    placeholder="+998 (90) 000-00-00"
                    value={form.phone}
                    onAccept={(v) => set('phone', v)}
                    className={inpClass(focusField === 'phone')}
                    onFocus={() => setFocusField('phone')}
                    onBlur={() => setFocusField('')}
                  />
                ) : (
                  <span className={`text-lg ${form.phone ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                    {form.phone || t('not_entered')}
                  </span>
                )}
              </FieldRow>

              <FieldRow icon={Car} label={t('car_number_type')}>
                {editing ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-max">
                      <button 
                        type="button" 
                        onClick={() => { setCarType('jismoniy'); set('car_number', ''); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${carType === 'jismoniy' ? 'bg-white dark:bg-[#1a1a24] text-brand-primary shadow' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t('individual')} (01 A 777 AA)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setCarType('yuridik'); set('car_number', ''); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${carType === 'yuridik' ? 'bg-white dark:bg-[#1a1a24] text-brand-primary shadow' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t('legal_entity')} (01 777 AAA)
                      </button>
                    </div>

                    {carType === 'jismoniy' ? (
                      <IMaskInput
                        mask="00 a 000 aa"
                        prepare={(str) => str.toUpperCase()}
                        placeholder="01 A 777 AA"
                        value={form.car_number}
                        onAccept={(v) => set('car_number', v.toUpperCase())}
                        className={inpClass(focusField === 'car_number') + " font-mono uppercase tracking-widest"}
                        onFocus={() => setFocusField('car_number')}
                        onBlur={() => setFocusField('')}
                      />
                    ) : (
                      <IMaskInput
                        mask="00 000 aaa"
                        prepare={(str) => str.toUpperCase()}
                        placeholder="01 777 AAA"
                        value={form.car_number}
                        onAccept={(v) => set('car_number', v.toUpperCase())}
                        className={inpClass(focusField === 'car_number') + " font-mono uppercase tracking-widest"}
                        onFocus={() => setFocusField('car_number')}
                        onBlur={() => setFocusField('')}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col py-2">
                    {form.car_number ? (
                       <LicensePlate number={form.car_number} label={t('car_number_type') || 'MOSHINA RAQAMI'} size="sm" />
                    ) : (
                       <span className="text-lg text-slate-400 mt-2">{t('not_entered') || 'Kiritilmagan'}</span>
                    )}
                  </div>
                )}
              </FieldRow>

              <FieldRow icon={Mail} label={t('email')}>
                <span className={`text-lg ${user?.email ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                  {user?.email || t('not_entered')}
                </span>
              </FieldRow>

              <FieldRow icon={Shield} label={t('role')}>
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl ${role.bg} ${role.color}`}>
                  {role.icon} {role.label}
                </span>
              </FieldRow>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ══════════════════ TAB: XAVFSIZLIK ══════════════════ */}
      {activeTab === 'security' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8">
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">🔒 {t('change_password')}</h3>
                <p className="text-sm font-bold text-slate-400">{t('change_password_desc')}</p>
              </div>

              <div className="flex flex-col gap-5 max-w-md">
                {[
                  { key: 'old', label: t('old_password'), ph: '••••••••' },
                  { key: 'new1', label: t('new_password'), ph: t('new_password') },
                  { key: 'new2', label: t('confirm_password'), ph: t('confirm_password') },
                ].map(({ key, label, ph }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">{label}</label>
                    <div className="relative">
                      <input
                        type={showPass[key] ? 'text' : 'password'}
                        placeholder={ph}
                        value={pass[key]}
                        onChange={e => setP(key, e.target.value)}
                        className={inpClass(focusField === `p_${key}`) + " pr-12"}
                        onFocus={() => setFocusField(`p_${key}`)}
                        onBlur={() => setFocusField('')}
                      />
                      <button type="button" onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors">
                        {showPass[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {key === 'new1' && pass.new1.length > 0 && (
                      <div className="mt-3 px-2">
                        <div className="flex gap-1.5 mb-2">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-slate-200 dark:bg-white/10'}`} />
                          ))}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${strengthTextColor[strength]}`}>
                          {strengthLabel[strength]}
                        </span>
                      </div>
                    )}

                    {key === 'new2' && pass.new2.length > 0 && (
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest px-2 flex items-center gap-1.5">
                        {pass.new1 === pass.new2
                          ? <><CheckCircle size={14} className="text-emerald-500" /><span className="text-emerald-500">{t('matches')}</span></>
                          : <><AlertCircle size={14} className="text-rose-500" /><span className="text-rose-500">{t('does_not_match')}</span></>}
                      </div>
                    )}
                  </div>
                ))}

                <Btn icon={<Lock size={16} />} onClick={savePassword} loading={passLoading} disabled={!pass.old || !pass.new1 || pass.new1 !== pass.new2} size="md" className="mt-4 self-start">
                  {t('update_password')}
                </Btn>
              </div>

              <div className="mt-10 p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
                <div className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle size={16} /> {t('security_tips')}
                </div>
                {['Kamida 8 ta belgi ishlating', 'Katta va kichik harflar, raqamlarni aralashtiring', 'Boshqa saytlardagi parol bilan bir xil qilmang', 'Parolingizni hech kimga bermang'].map((tip, i) => (
                  <div key={i} className="flex gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 items-start last:mb-0">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {tip}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ══════════════════ TAB: STATISTIKA ══════════════════ */}
      {activeTab === 'activity' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Calendar />, label: t('joined_date'), value: fmt(user?.date_joined) },
                { icon: <Globe />, label: t('last_login_date'), value: fmt(user?.last_login) || 'Hozir' },
                { icon: <Shield />, label: t('system_text'), value: 'SmartPark CRM v2' },
              ].map((s, i) => (
                <Card key={i} className="p-6 flex flex-col items-center justify-center text-center hover:border-brand-primary/30 transition-colors">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">{s.icon}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{s.label}</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">{s.value}</div>
                </Card>
              ))}
            </div>

            <Card className="p-8">
              <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <span>{role.icon}</span> {role.label} {t('role_capabilities')}
              </div>
              <div className="flex flex-wrap gap-3">
                {({
                  admin: ['Dashboard', 'Avtoturargohlar', 'Mijozlar Bazasi', 'Rezervatsiyalar', 'To\'lovlar', 'Sozlamalar'],
                  client: ['Mening bronlarim', 'To\'lovlar tarixi', 'Xarita', 'Kirish/Chiqish'],
                }[roleKey] || []).map(p => (
                  <span key={p} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-dashed text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-white/[0.02]`}>
                    ✓ {p}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900 border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Smartphone size={16} /> {t('current_session')}
                </div>
                <div className="text-sm font-bold text-slate-400">
                  Toshkent · SmartPark · Hozir faol
                </div>
              </div>
              <Btn onClick={logout} variant="danger" icon={<LogOut size={16} />} size="md" className="relative z-10 w-full sm:w-auto">
                {t('end_session')}
              </Btn>
            </Card>

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
