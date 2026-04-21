import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Clock, CreditCard, Star, Users, MapPin, Zap, TrendingUp, Globe } from 'lucide-react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import heroBg from '../assets/hero_bg.png';
import ParkingMap from '../components/ParkingMap';
import FeatureCard from '../components/FeatureCard';

const LandingPage = () => {
  const { setAuthOpen } = useOutletContext();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const scrollToMap = () => {
    document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (user) {
    if (user.is_staff) return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#08060d] transition-colors duration-500">
      {/* Hero Section - 100vh Immersive */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Futuristic Parking" 
            className="w-full h-full object-cover opacity-20 dark:opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 dark:from-[#08060d] via-slate-50/80 dark:via-[#08060d]/80 to-slate-50 dark:to-[#08060d]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,59,255,0.1)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Next-Gen Parking Infrastructure</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter italic text-slate-900 dark:text-white">
                ZAMONAVIY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-400 to-brand-primary bg-[length:200%_auto] animate-gradient-x">
                  SMART PARK
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-900/40 dark:text-white/40 mb-12 max-w-xl leading-relaxed">
                Toshkentning qoq markazida eng xavfsiz va aqlli avtoturargoh. Real vaqt rejimida boshqaruv va 100% kafolatlangan xizmat.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={scrollToMap}
                  className="bg-brand-primary hover:bg-slate-900 dark:hover:bg-white dark:hover:text-brand-primary text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_rgba(170,59,255,0.3)] active:scale-95 group"
                >
                  JOY BAND QILISH <ChevronRight className="group-hover:translate-x-2 transition-transform" size={28} />
                </button>
                <button 
                  onClick={scrollToMap}
                  className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-slate-800 dark:text-white px-10 py-6 rounded-[2.5rem] font-bold text-xl transition-all backdrop-blur-xl flex items-center gap-3"
                >
                  <MapPin size={24} className="text-brand-primary" /> Xaritani ochish
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-16 flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#08060d] bg-white/10" />
                  ))}
                </div>
                <div className="text-sm font-bold text-white/60">
                  <span className="text-white">2,400+</span> mamnun foydalanuvchilar
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="hidden lg:block relative perspective-1000"
            >
              {/* Floating Status Card */}
              <div className="relative z-10 glass-card p-12 rounded-[4rem] shadow-2xl animate-float">
                <div className="space-y-12">
                  <div className="flex justify-between items-center text-slate-900 dark:text-white">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Live Capacity</div>
                      <div className="text-7xl font-black italic">84<span className="text-2xl opacity-20">%</span></div>
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                      <TrendingUp className="text-brand-primary w-10 h-10" />
                    </div>
                  </div>

                  <div className="h-4 w-full bg-white/5 rounded-full p-1 border border-white/10 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '84%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-gradient-to-r from-brand-primary to-purple-400 rounded-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[3rem] border border-black/5 dark:border-white/5">
                      <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2 italic">Active Users</div>
                      <div className="text-4xl font-black text-slate-800 dark:text-white">1.8k+</div>
                    </div>
                    <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[3rem] border border-black/5 dark:border-white/5">
                      <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2 italic">Secured Ops</div>
                      <div className="text-4xl font-black text-slate-800 dark:text-white">100%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Glows */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] rotate-90 translate-y-8">Scroll</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative z-10 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
            {[
              { val: "24/7", label: "Monitoring" },
              { val: "150+", label: "Parking Slots" },
              { val: "0.5s", label: "Response" },
              { val: "99.9%", label: "Uptime" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white italic mb-2 tracking-tighter group-hover:text-brand-primary transition-colors">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/20 dark:text-white/20 italic">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-brand-primary rounded-full" />
              <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px]">Bizning tizim afzalliklari</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-slate-900 dark:text-white">
              YUQORI DARAJADAGI <br />
              <span className="text-slate-900/20 dark:text-white/20">XAVFSIZLIK VA QULAYLIK</span>
            </h2>
          </div>
          <p className="text-slate-900/40 dark:text-white/20 text-lg max-w-sm leading-relaxed italic">
            SmartPark - bu shunchaki joy emas, bu sifat va eng so'nggi texnologiyalar uyg'unligi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <FeatureCard 
            icon={Shield}
            title="Professional AI Himoyasi"
            description="Barcha sektorlar 24/7 rejimida sun'iy intellekt yordamida nazorat qilinadi. Har bir harakat tahlil ostida."
            className="md:col-span-8 md:h-[400px]"
          />
          <FeatureCard 
            icon={Zap}
            title="Ultra Tezkor Bron"
            description="Navbat kutishga vaqt sarflamang. 0.5 soniyada joyingizni band qiling."
            className="md:col-span-4"
          />
          <FeatureCard 
            icon={CreditCard}
            title="Xavfsiz To'lovlar"
            description="To'lovlar 256-bit SSL bilan himoyalangan va bir zumda amalga oshadi."
            className="md:col-span-4"
          />
          <FeatureCard 
            icon={Globe}
            title="Markazlashgan Tizim"
            description="Barcha filiallarimizni bitta profil orqali boshqaring va monitoring qiling."
            className="md:col-span-8"
          />
        </div>
      </section>

      {/* Hero-like Map Section */}
      <div className="relative group">
        <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-slate-50 dark:from-[#08060d] to-transparent z-10 pointer-events-none transition-colors" />
        <ParkingMap openAuth={() => setAuthOpen(true)} />
        <div className="absolute inset-x-0 -bottom-40 h-80 bg-gradient-to-t from-slate-50 dark:from-[#08060d] to-transparent z-10 pointer-events-none transition-colors" />
      </div>

      {/* Trust Quote / Call to Action */}
      <section className="py-60 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-full bg-[radial-gradient(circle_at_center,rgba(170,59,255,0.05)_0%,transparent_50%)]" />
        
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex gap-1 mb-6 text-brand-primary">
            {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-12 italic tracking-tighter leading-tight text-slate-900 dark:text-white">
            "SMART PARK BILAN TURARGOH TOPISH MUAMMO EMAS, BU HUZURBASH XIZMATDIR."
          </h2>
          <button 
            onClick={scrollToMap}
            className="px-16 py-8 bg-slate-900 dark:bg-white text-white dark:text-[#08060d] rounded-[3rem] font-black text-3xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl shadow-black/10 dark:shadow-white/10 active:scale-95"
          >
            HOZIROQ BOSHLANG
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
