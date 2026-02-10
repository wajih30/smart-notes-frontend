import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col gap-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100 focus-within:border-primary-500/30 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all duration-300">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your notes..."
          rows={1}
          className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 resize-none text-[15px] placeholder:text-gray-400 scrollbar-hide min-h-[52px]"
          disabled={disabled || isLoading}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
          }}
        />
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="text-[10px] text-gray-400 font-medium px-2">
            AI will use your private notes as context.
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center",
              !message.trim() || isLoading || disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary-600 text-white shadow-md shadow-primary-200 hover:bg-primary-700 active:scale-95"
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
