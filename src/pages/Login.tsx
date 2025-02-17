import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import useStore from '../store';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleGuestLogin = () => {
    setUser({
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
      isGuest: true,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-lg border border-white/20">
        <div className="text-center mb-8">
          <UserCircle2 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to Chat Dashboard</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 bg-white/80 hover:bg-white/90 transition rounded-lg flex items-center justify-center space-x-2 text-gray-700 font-medium border border-gray-200"
          >
            <UserCircle2 className="w-5 h-5" />
            <span>Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}