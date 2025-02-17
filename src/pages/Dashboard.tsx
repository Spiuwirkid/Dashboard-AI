import React, { useState } from 'react';
import { Menu, X, Settings, MessageSquare, LogOut } from 'lucide-react';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import SettingsPanel from '../components/SettingsPanel';

export default function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, settings, updateSettings } = useStore();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="h-screen flex">
      {/* Hamburger Menu Button - Mobile Only */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-lg hover:bg-white/20"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Settings Sidebar - Desktop */}
      <div className="hidden md:flex md:w-80 h-full flex-col bg-white/50 backdrop-blur-sm border-r border-white/20">
        <SettingsSidebar user={user} settings={settings} updateSettings={updateSettings} onLogout={handleLogout} />
      </div>

      {/* Settings Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50">
          <div className="w-80 h-full bg-white/95 backdrop-blur-sm animate-slide-in">
            <div className="flex justify-end p-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <SettingsSidebar 
              user={user} 
              settings={settings} 
              updateSettings={updateSettings} 
              onLogout={handleLogout}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}

// Separate Settings Sidebar Component
function SettingsSidebar({ 
  user, 
  settings, 
  updateSettings, 
  onLogout,
  onClose 
}: {
  user: any;
  settings: any;
  updateSettings: any;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="p-6 space-y-6">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full rounded-full" />
          ) : (
            <span className="text-xl text-blue-500">{user?.name?.[0]}</span>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase">Settings</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Precise</span>
              <span>{settings.temperature}</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          onLogout();
          onClose?.();
        }}
        className="w-full py-2 px-4 mt-auto rounded-lg border border-gray-200 
          hover:bg-gray-100 transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}