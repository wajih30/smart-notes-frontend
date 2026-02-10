import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { notesApi } from '../../api/notes';
import type { Note } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { cn } from '../../utils/cn';

interface NoteSelectorProps {
  selectedNoteIds: string[];
  onSelectionChange: (noteIds: string[]) => void;
  maxSelection?: number;
}

export const NoteSelector: React.FC<NoteSelectorProps> = ({
  selectedNoteIds,
  onSelectionChange,
  maxSelection = 5,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const response = await notesApi.listNotes({ limit: 100 });
      setNotes(response.items.filter((n) => !n.is_archived && !n.is_deleted));
    } catch (error) {
      console.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNote = (noteId: string) => {
    if (selectedNoteIds.includes(noteId)) {
      onSelectionChange(selectedNoteIds.filter((id) => id !== noteId));
    } else {
      if (selectedNoteIds.length < maxSelection) {
        onSelectionChange([...selectedNoteIds, noteId]);
      }
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
        <p className="mt-2 text-sm text-gray-600">
          Select {maxSelection} note{maxSelection !== 1 ? 's' : ''} (selected:{' '}
          {selectedNoteIds.length}/{maxSelection})
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No notes found</p>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNoteIds.includes(note.id);
              const canSelect = selectedNoteIds.length < maxSelection || isSelected;

              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleNote(note.id);
                  }}
                  disabled={!canSelect}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300',
                    !canSelect && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{note.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {note.summary || note.content}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      )}
                    >
                      {isSelected && <Check size={16} className="text-white" />}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {selectedNoteIds.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Notes:</p>
          <div className="flex flex-wrap gap-2">
            {selectedNoteIds.map((noteId) => {
              const note = notes.find((n) => n.id === noteId);
              if (!note) return null;
              return (
                <span
                  key={noteId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {note.title}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleNote(noteId);
                    }}
                    className="hover:text-primary-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
