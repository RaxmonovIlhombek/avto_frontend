import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? 'auth/login/' : 'auth/register/';
      const response = await api.post(endpoint, formData);
      
      if (response.data.token) {
        const userData = response.data.user;
        login(response.data.token, userData);
        onClose();
        
        // Redirection logic
        if (userData.is_staff) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.error || "Ma'lumotlar noto'g'ri kiritildi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#16161d] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-white">
                  {isLogin ? 'Xush kelibsiz' : 'Ro\'yxatdan o\'tish'}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400 mb-6 text-sm"
                >
                  <AlertCircle className="shrink-0 w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Foydalanuvchi nomi"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/5 focus:border-brand-primary outline-none py-4 pl-12 pr-4 rounded-2xl text-white transition-all placeholder:text-white/20"
                  />
                </div>

                {!isLogin && (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email manzilingiz"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/5 focus:border-brand-primary outline-none py-4 pl-12 pr-4 rounded-2xl text-white transition-all placeholder:text-white/20"
                    />
                  </div>
                )}

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Parol"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/5 focus:border-brand-primary outline-none py-4 pl-12 pr-12 rounded-2xl text-white transition-all placeholder:text-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/30 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                >
                  {loading ? 'Kirish...' : isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  {isLogin ? 'Sizda akkaunt yo\'qmi? Ro\'yxatdan o\'ting' : 'Akkauntingiz bormi? Tizimga kiring'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
