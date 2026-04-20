import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import { Car } from 'lucide-react';

const MainLayout = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08060d] text-white selection:bg-brand-primary/30 relative overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-brand-primary/5 blur-[100px] rounded-full animate-float" />
      </div>

      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      
      <main className="relative z-10">
        <Outlet context={{ setAuthOpen }} />
      </main>

      <footer className="py-20 border-t border-white/5 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Car className="text-brand-primary w-8 h-8" />
              <span className="text-2xl font-black tracking-tight text-white uppercase">SmartPark</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">
              Toshkent shahridagi eng zamonaviy avtoturargoh tarmog'i. Xavfsizlik va qulaylik - bizning ustuvor vazifamizdir.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Sayt</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li><Link to="/">Asosiy</Link></li>
                <li><a href="#map">Xarita</a></li>
                <li><Link to="/profile">Profil</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Bog'lanish</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li>+998 90 123 45 67</li>
                <li>info@smartpark.uz</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
          © 2026 SmartPark Enterprise. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
