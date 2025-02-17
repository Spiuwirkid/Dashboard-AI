import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAdmin } from '../services/admin';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  console.log('AdminLogin component rendered');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateTokenUsage } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await verifyAdmin(username, password);

      if (isValid) {
        updateTokenUsage({ 
          remaining: Infinity,
          lastReset: Date.now()
        });
        toast.success('Login berhasil!');
        navigate('/');
      } else {
        toast.error('Username atau password salah!');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleLogin}
          className="backdrop-blur-lg bg-white/30 rounded-2xl p-8 shadow-sm border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-blue-500 text-white
                hover:bg-blue-600 active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 