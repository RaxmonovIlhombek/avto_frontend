import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, className = "" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`glass-card glass-card-hover p-10 rounded-[3rem] cursor-default flex flex-col justify-between group ${className}`}
  >
    <div>
      <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-primary/20 transition-colors">
        <Icon className="text-brand-primary w-8 h-8" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">{title}</h3>
      <p className="text-slate-900/40 dark:text-white/40 leading-relaxed text-base transition-colors">
        {description}
      </p>
    </div>
    
    <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-brand-primary font-bold text-sm">
      Batafsil ma'lumot <ChevronRight size={16} />
    </div>
  </motion.div>
);

export default FeatureCard;
