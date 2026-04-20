import React from 'react';
import { Car } from 'lucide-react';
import { motion } from 'framer-motion';

const LicensePlate = ({ number, label = "MOSHINA RAQAMI", className = "", size = "md" }) => {
  if (!number) return null;

  const sizes = {
    sm: { box: "px-4 py-2 gap-3", text: "text-xs", icon: "w-4 h-4", label: "text-[7px]" },
    md: { box: "px-8 py-5 gap-6", text: "text-2xl md:text-3xl", icon: "w-8 h-8", label: "text-[10px]" },
    lg: { box: "px-10 py-6 gap-8", text: "text-4xl md:text-5xl", icon: "w-10 h-10", label: "text-[12px]" }
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      {label && (
        <span className={`${s.label} font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] ml-4 italic`}>
          {label}
        </span>
      )}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center ${s.box} bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl border-2 border-brand-primary rounded-full shadow-[0_0_30px_rgba(217,70,239,0.1)] group hover:shadow-[0_0_40px_rgba(217,70,239,0.2)] transition-all`}
      >
        <Car className={`text-brand-primary ${s.icon} group-hover:scale-110 transition-transform`} />
        <span className={`${s.text} font-black text-white tracking-widest uppercase font-mono leading-none`}>
          {number}
        </span>
      </motion.div>
    </div>
  );
};

export default LicensePlate;
