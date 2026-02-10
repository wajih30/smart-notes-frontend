import React from 'react';
import { Plus, MessageSquare, Trash2, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { QASession } from '../../types';
import { cn } from '../../utils/cn';

interface ChatSidebarProps {
  sessions: QASession[];
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  onDelete,
  onCreateNew,
}) => {
  const { id: currentSessionId } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 mb-4">
        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-semibold hover:bg-primary-100 transition-colors border border-primary-100"
        >
          <Plus size={18} />
          <span className="text-sm">New Thread</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <p className="px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Recent Threads
        </p>

        {sessions.map((session) => {
          const isActive = session.id === currentSessionId;

          return (
            <div key={session.id} className="relative group">
              <Link
                to={`/qa/${session.id}`}
                className={cn(
                  'flex flex-col gap-1 p-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-white shadow-sm border border-gray-100'
                    : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare
                    size={14}
                    className={cn(
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    )}
                  />
                  <p className={cn(
                    'text-[13px] font-medium truncate flex-1',
                    isActive ? 'text-gray-900' : 'text-gray-600'
                  )}>
                    {session.title || 'Untitled Chat'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pl-5">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(session.updated_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(session.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-gray-400 italic">No recent threads</p>
          </div>
        )}
      </div>
    </div>
  );
};
