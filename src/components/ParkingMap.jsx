import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Info, CheckCircle2, CreditCard, X, AlertCircle, 
  ChevronRight, Lock, Calendar, Clock, DollarSign,
  Phone, Hash, Map as MapIcon, ArrowUpCircle, Shield,
  Building2
} from 'lucide-react';
import { getSpaces, getLots, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import { format, addHours, differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';
import { IMaskInput } from 'react-imask';
import LicensePlate from './LicensePlate';

// Base64 encoded short beep sound
const BEEP_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV9vT18KZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZg==";

const ParkingMap = ({ openAuth }) => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [lots, setLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState(null);
  
  // Booking Data
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
  const [carNumber, setCarNumber] = useState(user?.profile?.car_number || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.profile?.phone_number || '');
  const [carType, setCarType] = useState('jismoniy');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (user?.profile) {
      setCarNumber(user.profile.car_number || '');
      setPhoneNumber(user.profile.phone_number || '');
    }
  }, [user]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [spacesRes, lotsRes] = await Promise.all([getSpaces(), getLots()]);
      setSpaces(spacesRes.data);
      setLots(lotsRes.data);
      if (lotsRes.data.length > 0) {
        setSelectedLotId(lotsRes.data[0].id);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Ma'lumotlarni yuklashda xatolik", { id: 'fetch-map-error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const playBeep = () => {
    try {
      const audio = new Audio(BEEP_SOUND);
      audio.volume = 0.2;
      audio.play();
    } catch (e) { console.error("Audio play failed", e); }
  };

  const calculateTotalPrice = () => {
    if (!selectedSpace) return 0;
    const hours = Math.max(1, differenceInHours(new Date(endTime), new Date(startTime)));
    return hours * parseFloat(selectedSpace.price_per_hour);
  };

  const initiateBooking = () => {
    if (!user) {
      toast.error("Iltimos, avval tizimga kiring");
      openAuth();
      return;
    }
    if (carNumber.replace(/\s/g, '').length < 8) {
      toast.error("Iltimos, moshina raqamini to'liq kiriting");
      return;
    }
    if (phoneNumber.length < 9) {
      toast.error("Iltimos, telefon raqamini kiriting");
      return;
    }
    setBookingStatus('payment');
  };

  const handleFinalBooking = async () => {
    if (!selectedSpace || !user) return;
    
    setBookingStatus('loading');
    try {
      const bookingData = {
        user: user.id, 
        space: selectedSpace.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        car_number: carNumber,
        phone_number: phoneNumber,
        status: 'active'
      };
      
      await createBooking(bookingData);
      playBeep();
      toast.success("Muvaffaqiyatli band qilindi! 5 daqiqadan so'ng tizim yangilanadi.");
      setBookingStatus('success');
      
      // Update local state
      setSpaces(prev => prev.map(s => s.id === selectedSpace.id ? {...s, status: 'booked'} : s));
      
      setTimeout(() => {
        setSelectedSpace(null);
        setBookingStatus(null);
      }, 2500);
      
    } catch (error) {
      toast.error("Bron qilishda xatolik yuz berdi");
      setBookingStatus('error');
    }
  };

  const statusColors = {
    available: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50',
    occupied: 'bg-rose-500/20 border-rose-500/50 text-rose-500 cursor-not-allowed', // Red
    booked: 'bg-orange-500/20 border-orange-500/50 text-orange-400 cursor-not-allowed', // Amber/Orange
    maintenance: 'bg-slate-500/10 border-slate-500/30 text-slate-400 cursor-not-allowed opacity-40'
  };

  const filteredSpaces = spaces.filter(s => s.parking_lot === selectedLotId);

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto" id="map">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-brand-primary rounded-full" />
            <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">Filiallarga bo'lingan xarita</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            SmartPark <span className="text-slate-400 dark:text-white/20 font-light">Filiallari</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-4 bg-slate-50 dark:bg-white/5 p-3 rounded-3xl border border-slate-200 dark:border-white/10 backdrop-blur-md">
          {Object.entries(statusColors).map(([status, style]) => (
            <div key={status} className="flex items-center gap-2 px-3">
              <div className={`w-3 h-3 rounded-full ${style.split(' ')[0]}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
                {status === 'available' ? 'Bo\'sh' : status === 'booked' ? 'Band' : status === 'occupied' ? 'Moshina bor' : 'Xizmatda'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Tabs */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-4">
        {lots.map(lot => (
          <button
            key={lot.id}
            onClick={() => setSelectedLotId(lot.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              selectedLotId === lot.id 
              ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/30' 
              : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <Building2 size={18} />
            {lot.name}
          </button>
        ))}
      </div>

      {/* 2D Map Visualization */}
      <div className="bg-slate-100/50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-[4rem] p-8 md:p-16 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-32 border-x-4 border-dashed border-slate-900 dark:border-white -translate-x-1/2" />
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {loading ? (
             Array(12).fill(0).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse" />
              ))
          ) : filteredSpaces.length > 0 ? (
            filteredSpaces.map((space, idx) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.button
                  whileHover={space.status === 'available' ? { scale: 1.05, y: -5 } : {}}
                  whileTap={space.status === 'available' ? { scale: 0.95 } : {}}
                  onClick={() => space.status === 'available' && setSelectedSpace(space)}
                  className={`w-full aspect-[2/3] rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-between py-6 relative group ${statusColors[space.status] || statusColors.available} 
                  ${selectedSpace?.id === space.id ? 'ring-4 ring-brand-primary ring-offset-4 ring-offset-[#08060d]' : ''}`}
                >
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-slate-200 dark:bg-white/10" />
                  <div className="absolute top-0 bottom-0 right-0 w-1 bg-slate-200 dark:bg-white/10" />
                  
                  <div className="text-2xl font-black italic tracking-tighter z-10 text-slate-800 dark:text-white">{space.identifier}</div>
                  
                  {space.status === 'available' ? (
                     <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <ArrowUpCircle className="text-emerald-500 w-6 h-6 animate-bounce" />
                     </div>
                  ) : (
                    <Car className={`w-14 h-14 ${space.status === 'booked' ? 'text-orange-500' : 'text-rose-500'} opacity-80`} />
                  )}

                  <div className="text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                    {space.space_type}
                  </div>
                </motion.button>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-20 text-center text-slate-400 dark:text-white/20 italic">
               Bu filialda hali turargohlar mavjud emas.
             </div>
          )}
        </div>
        
        <div className="mt-20 flex flex-col items-center">
             <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 dark:text-white/20 mb-4 italic">MAIN ENTRANCE</div>
             <div className="w-40 h-2 bg-gradient-to-r from-transparent via-brand-primary to-transparent rounded-full shadow-[0_0_20px_rgba(217,70,239,0.5)]" />
        </div>
      </div>

      <AnimatePresence>
        {selectedSpace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => bookingStatus !== 'loading' && setSelectedSpace(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            
            <motion.div
              layoutId={`space-${selectedSpace.id}`}
              className="relative w-full max-w-3xl bg-[#16161d] border border-white/10 rounded-[2rem] md:rounded-[4rem] overflow-y-auto max-h-[95vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]"
            >
              <div className="p-6 md:p-14">
                <div className="flex justify-between items-start mb-8 md:mb-12">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-brand-primary text-white border border-brand-primary/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/40">
                      {bookingStatus === 'payment' ? 'Tasdiqlash' : 'Professional Booking'}
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">
                      Slot {selectedSpace.identifier} <span className="text-white/20 font-light">Details</span>
                    </h3>
                  </div>
                  <button onClick={() => setSelectedSpace(null)} className="p-5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-3xl transition-all text-white/20 border border-white/5">
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="min-h-[450px]">
                  {bookingStatus === 'payment' ? (
                     <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 space-y-6">
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">To'lov miqdori</div>
                                <div className="text-5xl font-black text-emerald-400 italic">
                                    {calculateTotalPrice().toLocaleString()} <span className="text-sm font-normal opacity-40">so'm</span>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex items-center gap-4 text-white/40 italic">
                                    <Shield className="w-5 h-5" /> Secured by SSL 256-bit
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-6 h-6 group-focus-within:text-brand-primary transition-colors" />
                                    <input type="text" placeholder="Karta raqami" defaultValue="8600 1234 5678 9012" className="w-full bg-black/40 border border-white/5 py-6 pl-16 pr-6 rounded-3xl text-white font-bold outline-none focus:border-brand-primary transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" defaultValue="12/28" className="bg-black/40 border border-white/5 py-6 px-8 rounded-3xl text-white font-bold outline-none focus:border-brand-primary transition-all" />
                                    <input type="password" placeholder="CVV" defaultValue="123" className="bg-black/40 border border-white/5 py-6 px-8 rounded-3xl text-white font-bold outline-none focus:border-brand-primary transition-all" />
                                </div>
                            </div>
                        </div>

                        <button 
                          onClick={handleFinalBooking}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-8 rounded-[3rem] font-black text-2xl shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-6 group"
                        >
                          TO'LOVNI TASDIQLASH <CheckCircle2 size={32} className="group-hover:scale-125 transition-transform" />
                        </button>
                     </motion.div>
                  ) : bookingStatus === 'loading' ? (
                     <div className="flex flex-col items-center justify-center py-40 gap-8">
                        <div className="w-24 h-24 border-8 border-brand-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-brand-primary/20" />
                        <span className="text-white/40 font-black uppercase tracking-[0.5em] text-sm animate-pulse">Processing...</span>
                     </div>
                  ) : bookingStatus === 'success' ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-10 text-emerald-400 text-center">
                      <div className="w-40 h-40 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 size={96} />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-5xl font-black text-white italic tracking-tighter uppercase">Muvaffaqiyatli!</h4>
                        <div className="flex justify-center mt-6">
                           <LicensePlate number={carNumber} label="TASDIQLANGAN RAQAM" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="flex justify-between items-center ml-4 mb-2">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Moshina Raqami</label>
                               <div className="flex bg-white/5 p-1 rounded-lg gap-1">
                                  <button type="button" onClick={() => { setCarType('jismoniy'); setCarNumber(''); }} className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${carType === 'jismoniy' ? 'bg-brand-primary text-white shadow' : 'text-white/40 hover:text-white'}`}>Jismoniy</button>
                                  <button type="button" onClick={() => { setCarType('yuridik'); setCarNumber(''); }} className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${carType === 'yuridik' ? 'bg-brand-primary text-white shadow' : 'text-white/40 hover:text-white'}`}>Yuridik</button>
                               </div>
                             </div>
                             <div className="relative group">
                                <Car className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-6 h-6 group-focus-within:text-brand-primary transition-colors z-10" />
                                {carType === 'jismoniy' ? (
                                    <IMaskInput
                                        mask="00 a 000 aa"
                                        prepare={(str) => str.toUpperCase()}
                                        placeholder="01 A 777 AA"
                                        value={carNumber}
                                        onAccept={(v) => setCarNumber(v.toUpperCase())}
                                        className="w-full bg-white/5 border border-white/5 py-6 pl-16 pr-6 rounded-[2.5rem] text-xl font-black text-white outline-none focus:border-brand-primary focus:bg-white/10 transition-all uppercase tracking-widest font-mono"
                                    />
                                ) : (
                                    <IMaskInput
                                        mask="00 000 aaa"
                                        prepare={(str) => str.toUpperCase()}
                                        placeholder="01 777 AAA"
                                        value={carNumber}
                                        onAccept={(v) => setCarNumber(v.toUpperCase())}
                                        className="w-full bg-white/5 border border-white/5 py-6 pl-16 pr-6 rounded-[2.5rem] text-xl font-black text-white outline-none focus:border-brand-primary focus:bg-white/10 transition-all uppercase tracking-widest font-mono"
                                    />
                                )}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Telefon Raqami</label>
                             <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-6 h-6 group-focus-within:text-brand-primary transition-colors" />
                                <IMaskInput
                                    mask="+{998} (00) 000-00-00"
                                    placeholder="+998 (90) 000-00-00"
                                    value={phoneNumber}
                                    onAccept={(value) => setPhoneNumber(value)}
                                    className="w-full bg-white/5 border border-white/5 py-6 pl-16 pr-6 rounded-[2.5rem] text-xl font-black text-white outline-none focus:border-brand-primary focus:bg-white/10 transition-all"
                                />
                             </div>
                          </div>
                       </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Davomiylik</label>
                          <div className="flex gap-4 p-2 bg-white/5 rounded-[2.5rem] border border-white/5">
                             <div className="flex-grow relative">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5 pointer-events-none" />
                                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-transparent py-5 pl-14 pr-4 rounded-3xl text-sm font-bold text-white outline-none" />
                             </div>
                             <div className="flex-grow relative border-l border-white/10">
                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5 pointer-events-none" />
                                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-transparent py-5 pl-14 pr-4 rounded-3xl text-sm font-bold text-white outline-none" />
                             </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Tur</div>
                                <div className="text-2xl font-black text-white italic uppercase tracking-tighter">{selectedSpace.space_type}</div>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Narx/S</div>
                                <div className="text-2xl font-black text-emerald-400 italic">{parseInt(selectedSpace.price_per_hour).toLocaleString()}</div>
                            </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5">
                         <div className="flex justify-between items-center mb-10 bg-brand-primary/10 p-8 rounded-[3rem] border border-brand-primary/20">
                            <div>
                                <div className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Taxminiy summa:</div>
                                <div className="text-4xl font-black text-white italic tracking-tighter">
                                    {calculateTotalPrice().toLocaleString()} <span className="text-lg font-light opacity-40">so'm</span>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/10 mx-8" />
                            <div className="hidden md:block text-right">
                                <div className="text-white/20 text-[10px] mb-1 font-bold">SAVOL BORMI?</div>
                                <div className="text-brand-primary font-bold">+998 71 200 00 00</div>
                            </div>
                         </div>
                        
                        <button 
                          onClick={initiateBooking}
                          className="w-full bg-brand-primary hover:bg-white hover:text-brand-primary text-white py-8 rounded-[3rem] font-black text-2xl shadow-2xl shadow-brand-primary/30 transition-all flex items-center justify-center gap-6 group"
                        >
                          BRON QILISH <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParkingMap;
