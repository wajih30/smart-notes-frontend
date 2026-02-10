import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Trash2 } from 'lucide-react';
import type { QASession } from '../../types';
import { cn } from '../../utils/cn';

interface SessionCardProps {
  session: QASession;
  onDelete: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const messageCount = session.messages?.length || 0;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Link
          to={`/qa/${session.id}`}
          className="flex-1 hover:text-primary-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {session.title || 'Untitled Session'}
          </h3>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(session.id);
          }}
          className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <MessageSquare size={16} />
          <span>{messageCount} messages</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{formatDate(session.updated_at)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">
          {session.note_ids.length} note{session.note_ids.length !== 1 ? 's' : ''} selected
        </span>
      </div>
    </div>
  );
};
