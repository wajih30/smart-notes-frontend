import React from 'react';
import { Link } from 'react-router-dom';
import { Pin, Archive, Trash2, Clock, RotateCcw, Sparkles, FileText } from 'lucide-react';
import type { Note } from '../../types';
import { cn } from '../../utils/cn';

interface NoteCardProps {
  note: Note;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  isInTrash?: boolean;
  relevanceScore?: number;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPin,
  onArchive,
  onDelete,
  onRestore,
  isInTrash = false,
  relevanceScore,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card-premium group p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/notes/${note.id}`}
            className="group/title block"
          >
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[17px] font-bold text-gray-900 group-hover/title:text-primary-600 transition-colors line-clamp-1 leading-tight">
                {note.title}
              </h3>
              {note.is_pinned && (
                <Pin size={14} className="text-primary-500 fill-primary-500" />
              )}
            </div>

            {relevanceScore !== undefined && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 mb-2 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <Sparkles size={10} />
                {(relevanceScore * 100).toFixed(0)}% MATCH
              </div>
            )}
          </Link>
        </div>

        {/* Hover-only Action Bar */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          {!isInTrash ? (
            <>
              {onPin && (
                <button
                  onClick={() => onPin(note.id)}
                  className={cn(
                    'p-2 rounded-lg hover:bg-primary-50 transition-colors',
                    note.is_pinned ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'
                  )}
                  title={note.is_pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin size={16} fill={note.is_pinned ? 'currentColor' : 'none'} />
                </button>
              )}
              {onArchive && (
                <button
                  onClick={() => onArchive(note.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title={note.is_archived ? 'Unarchive' : 'Archive'}
                >
                  <Archive size={16} />
                </button>
              )}
            </>
          ) : (
            onRestore && (
              <button
                onClick={() => onRestore(note.id)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-500 transition-colors"
                title="Restore"
              >
                <RotateCcw size={16} />
              </button>
            )
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title={isInTrash ? 'Delete Permanently' : 'Delete'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-[13px] leading-relaxed mb-6 line-clamp-3 flex-1 font-medium">
        {note.summary || note.content}
      </p>

      <div className="mt-auto space-y-4">
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-md border border-gray-100 uppercase tracking-tighter"
              >
                {tag.name}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="text-[10px] text-gray-400 font-bold px-1">+ {note.tags.length - 2}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
            <Clock size={12} className="text-gray-300" />
            {formatDate(note.updated_at)}
          </div>

          {note.source_type === 'file' && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-500 rounded border border-slate-100">
              <FileText size={10} />
              {note.original_filename?.split('.').pop()?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
