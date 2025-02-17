import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import useStore from '../store';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSettings, selectedModel, setSelectedModel } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-2.0-flash-lite-preview-02-05', name: ' Gemini 2.0 Flash-Lite' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'text-embedding-004', name: 'Penyematan Teks' }
  ];

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className="h-screen p-6">
      <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/30 rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 bg-white/50 border border-gray-200 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>{models.find(model => model.id === selectedModel)?.name}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
          {isOpen && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
              {models.map(model => (
                <li
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {model.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature ({settings.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                updateSettings({ temperature: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) =>
                updateSettings({ maxTokens: parseInt(e.target.value) })
              }
              className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}