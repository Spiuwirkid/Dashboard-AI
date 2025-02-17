import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFileSelect(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".txt,.pdf,.doc,.docx"
      />
      <button 
        onClick={handleClick}
        disabled={disabled}
        className="p-2 rounded-lg hover:bg-white/50 transition disabled:opacity-50"
        title="Upload file"
      >
        <Paperclip className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
} 