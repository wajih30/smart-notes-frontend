import React from 'react';
import { User, Sparkles, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { QAMessage } from '../../types';
import { cn } from '../../utils/cn';

interface ChatMessageProps {
  message: QAMessage;
  sourceNotes?: Array<{ note_id: string; note_title: string }>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, sourceNotes }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-4 mb-8 animate-in fade-in transition-all duration-300",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div
        className={cn(
          'w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform hover:scale-105',
          isUser ? 'bg-blue-600' : 'bg-white border border-gray-100 text-blue-600'
        )}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Sparkles size={18} />
        )}
      </div>
      <div className={cn(
        "flex-1 min-w-0 max-w-[85%]",
        isUser ? "text-right" : "text-left"
      )}>
        <div className={cn(
          'inline-block rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed',
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100'
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-gray-800 prose-p:leading-relaxed prose-strong:text-gray-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && sourceNotes && sourceNotes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-start">
            {sourceNotes.map((n) => (
              <span key={n.note_id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/80 hover:bg-gray-200/80 text-[11px] font-bold text-gray-500 rounded-full transition-colors cursor-default border border-gray-200/50">
                <FileText size={10} />
                {n.note_title}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 text-[10px] text-gray-400 font-medium">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
