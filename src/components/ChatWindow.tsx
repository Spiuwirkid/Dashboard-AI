import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import useStore from '../store';
import { generateResponse } from '../services/ai';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import type { Message, Conversation, Attachment } from '../types';
import FileUploader from './FileUploader';

const messageStyles = {
  container: `max-w-[80%] rounded-lg p-6`,
  assistant: `bg-white/50 text-gray-800`,
  user: `bg-blue-500/90 text-white`,
  content: `prose prose-sm max-w-none
    prose-p:my-2
    prose-p:leading-relaxed
    prose-strong:font-semibold
    prose-strong:text-inherit`,
  attachment: `mt-2 p-2 rounded bg-white/10 text-sm flex items-center gap-2`,
};

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings, tokenUsage, updateTokenUsage, addConversation } = useStore();
  const [currentConversation, setCurrentConversation] = useState<Conversation>({
    id: Date.now().toString(),
    title: 'New Chat',
    messages: [],
    timestamp: Date.now(),
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [currentConversation.messages]);

  const formatAIResponse = (text: string) => {
    // Bersihkan teks dari karakter khusus dan normalisasi spasi dasar
    const cleanText = text
      .replace(/\*/g, '')
      .trim();

    // Pisahkan teks menjadi paragraf
    const paragraphs = cleanText.split(/\n\s*\n/);

    return paragraphs.map(paragraph => {
      // Cek apakah ini adalah langkah bernomor
      if (/^\d+\./.test(paragraph)) {
        // Coba ekstrak format "nomor. judul: konten"
        const match = paragraph.match(/^(\d+\.) ([^:]+):(.+)$/);
        
        if (match) {
          const [_, number, title, content] = match;
          return `
            <div class="mb-4">
              <div class="flex items-baseline">
                <strong class="mr-2">${number}</strong>
                <strong>${title.trim()}</strong>
              </div>
              <div class="mt-1 ml-6">
                ${content.trim()}
              </div>
            </div>
          `;
        }

        // Format untuk langkah bernomor tanpa judul khusus
        const [number, ...contentParts] = paragraph.split(/(?<=^\d+\.)\s/);
        const content = contentParts.join(' ').trim();
        
        return `
          <div class="mb-4">
            <div class="flex items-baseline">
              <strong class="mr-2">${number}</strong>
              <span>${content}</span>
            </div>
          </div>
        `;
      }

      // Cek apakah ini adalah list item dengan bullet point
      if (paragraph.trim().startsWith('•')) {
        return `
          <div class="ml-6 mb-2">
            <span class="mr-2">•</span>
            <span>${paragraph.replace('•', '').trim()}</span>
          </div>
        `;
      }

      // Paragraf biasa
      return `<p class="mb-4 leading-relaxed">${paragraph.trim()}</p>`;
    }).join('');
  };

  // Update messageStyles
  const messageStyles = {
    container: `max-w-[80%] rounded-lg p-6`,
    assistant: `bg-white/50 text-gray-800`,
    user: `bg-blue-500/90 text-white`,
    content: `prose prose-sm max-w-none
      prose-p:my-2
      prose-p:leading-relaxed
      prose-strong:font-semibold
      prose-strong:text-inherit`,
    input: `
      w-full py-3 px-4 rounded-xl
      bg-white/50 backdrop-blur-sm
      border border-gray-200/20
      focus:outline-none focus:ring-2 focus:ring-blue-500/50
      transition-all duration-200
      placeholder:text-gray-400
    `,
    button: `
      p-3 rounded-xl
      bg-blue-500 text-white
      hover:bg-blue-600
      active:scale-95
      disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed
      transition-all duration-200
    `,
    iconButton: `
      p-3 rounded-xl
      hover:bg-white/20
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200
    `,
    attachment: `mt-2 p-2 rounded bg-white/10 text-sm flex items-center gap-2`,
  };

  const handleFileSelect = async (files: File[]) => {
    const newAttachments: Attachment[] = [];

    for (const file of files) {
      // Baca konten file
      const content = await readFileContent(file);
      
      newAttachments.push({
        id: Date.now().toString() + Math.random(),
        file,
        type: file.type,
        name: file.name,
        size: file.size,
        content
      });
    }

    setAttachments([...attachments, ...newAttachments]);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };

      if (file.type.includes('text')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    
    if (tokenUsage.remaining <= 0) {
      const timeSinceReset = Date.now() - tokenUsage.lastReset;
      if (timeSinceReset < 600000) { // 10 minutes
        toast.error('Token limit reached. Please wait before sending more messages.');
        return;
      }
      updateTokenUsage({ remaining: 100000, lastReset: Date.now() });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setCurrentConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    setMessage('');
    setAttachments([]);
    setLoading(true);

    try {
      // Modifikasi prompt untuk menyertakan konten file
      let fullPrompt = message;
      if (attachments.length > 0) {
        fullPrompt += '\n\nAttached files content:\n';
        attachments.forEach(att => {
          fullPrompt += `\nFile: ${att.name}\nContent: ${att.content}\n`;
        });
      }

      const response = await generateResponse(
        fullPrompt,
        settings.temperature
      );

      const formattedResponse = formatAIResponse(response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedResponse,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setCurrentConversation(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));

      // Simulate token usage
      updateTokenUsage({
        remaining: Math.max(0, tokenUsage.remaining - 1000),
      });

      addConversation({ id: Date.now().toString(), content: formattedResponse, role: 'assistant', timestamp: Date.now() });

      // Reset attachments after sending
      setAttachments([]);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="p-4 backdrop-blur-md bg-white/30 border-b border-white/20">
        <h1 className="text-xl font-semibold text-gray-800">Chat Dashboard</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentConversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`${messageStyles.container} ${
                msg.role === 'user' 
                  ? messageStyles.user 
                  : messageStyles.assistant
              }`}
            >
              <div 
                className={messageStyles.content}
                dangerouslySetInnerHTML={{ __html: msg.content }} 
              />
              
              {/* Tampilkan attachments jika ada */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.attachments.map(att => (
                    <div 
                      key={att.id} 
                      className={messageStyles.attachment}
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>{att.name}</span>
                      <span className="text-xs opacity-70">
                        ({Math.round(att.size / 1024)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs mt-2 opacity-70">
                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className={`${messageStyles.container} ${messageStyles.assistant}`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 backdrop-blur-lg bg-white/30 border-t border-white/20">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map(att => (
              <div key={att.id} className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-1">
                <span className="text-sm">{att.name}</span>
                <button
                  onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <FileUploader 
            onFileSelect={handleFileSelect}
            disabled={loading}
          />
          <button 
            className={messageStyles.iconButton}
            disabled={loading}
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder={loading ? 'Generating response...' : 'Type your message...'}
            disabled={loading}
            className={messageStyles.input}
          />
          <button
            onClick={handleSend}
            disabled={loading || (!message.trim() && !attachments.length)}
            className={messageStyles.button}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Tokens remaining: {tokenUsage.remaining.toLocaleString()}
        </div>
      </div>
    </div>
  );
}