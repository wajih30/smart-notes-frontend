import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notesApi } from '../api/notes';
import { searchApi } from '../api/search';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteFilters, type NotesView } from '../components/notes/NoteFilters';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Note } from '../types';
import { toast } from '../utils/toast';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [view, setView] = useState<NotesView>('all');
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [searchScores, setSearchScores] = useState<Map<string, number>>(new Map());
  const [filters, setFilters] = useState({
    search: '',
    is_pinned: undefined as boolean | undefined,
    sort_by: 'created_at',
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      let response;
      if (useSemanticSearch && debouncedSearch.trim()) {
        const searchRes = await searchApi.semanticSearch({
          query: debouncedSearch,
          top_k: 50, // Get enough to allow for deduplication
        });

        if (searchRes.results.length === 0) {
          setNotes([]);
          setTotal(0);
          setSearchScores(new Map());
        } else {
          const scoresMap = new Map<string, number>();
          searchRes.results.forEach((res: any) => {
            // Use a more reasonable threshold (40% for semantic matches)
            if (res.relevance_score < 0.40) return;

            const currentScore = scoresMap.get(res.note_id) || 0;
            if (res.relevance_score > currentScore) {
              scoresMap.set(res.note_id, res.relevance_score);
            }
          });

          const uniqueNoteIds = Array.from(scoresMap.keys());
          const notesRes = await notesApi.listNotes({
            note_ids: uniqueNoteIds.join(','),
            limit: 50, // Get all valid notes for these IDs
          });

          // Sort final notes by the best score they achieved
          const sortedNotes = notesRes.items.sort((a, b) => {
            const scoreB = scoresMap.get(b.id) || 0;
            const scoreA = scoresMap.get(a.id) || 0;
            return scoreB - scoreA;
          });

          setNotes(sortedNotes);
          setTotal(sortedNotes.length);
          setSearchScores(scoresMap);
        }
      } else if (view === 'trash') {
        response = await notesApi.getTrash({
          skip: (page - 1) * pageSize,
          limit: pageSize,
        });
        setNotes(response.items);
        setTotal(response.total);
        setSearchScores(new Map());
      } else {
        response = await notesApi.listNotes({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          search: debouncedSearch,
          is_pinned: filters.is_pinned,
          is_archived: view === 'archived',
          sort_by: filters.sort_by,
        });
        setNotes(response.items);
        setTotal(response.total);
        setSearchScores(new Map());
      }
    } catch (error: any) {
      console.error('Failed to load notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [page, debouncedSearch, view, useSemanticSearch, filters.is_pinned, filters.sort_by]);

  const handlePin = async (id: string) => {
    try {
      await notesApi.togglePin(id);
      toast.success('Note updated');
      loadNotes();
    } catch (error: any) {
      toast.error('Failed to update note');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await notesApi.toggleArchive(id);
      toast.success('Note updated');
      loadNotes();
    } catch (error: any) {
      toast.error('Failed to update note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      await notesApi.deleteNote(id);
      toast.success('Note moved to trash');
      loadNotes();
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await notesApi.restoreNote(id);
      toast.success('Note restored');
      loadNotes();
    } catch (error: any) {
      toast.error('Failed to restore note');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm('This action cannot be undone. Are you sure you want to delete this note permanently?')) {
      return;
    }
    try {
      await notesApi.permanentlyDelete(id);
      toast.success('Note permanently deleted');
      loadNotes();
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {view === 'all' ? 'My Notes' : view === 'archived' ? 'Archived Notes' : 'Trash'}
        </h1>
        <Link to="/notes/new">
          <Button>
            <Plus size={20} className="mr-2" />
            New Note
          </Button>
        </Link>
      </div>

      <NoteFilters
        search={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        isPinned={filters.is_pinned}
        onPinnedChange={(value) => setFilters({ ...filters, is_pinned: value })}
        view={view}
        onViewChange={setView}
        sortBy={filters.sort_by}
        onSortChange={(value) => setFilters({ ...filters, sort_by: value })}
        useSemanticSearch={useSemanticSearch}
        onSemanticSearchToggle={setUseSemanticSearch}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No notes found</p>
          {view === 'all' && !filters.search && (
            <Link to="/notes/new">
              <Button>Create Your First Note</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={view === 'all' ? handlePin : undefined}
                onArchive={view !== 'trash' ? handleArchive : undefined}
                onDelete={view === 'trash' ? handlePermanentDelete : handleDelete}
                onRestore={view === 'trash' ? handleRestore : undefined}
                isInTrash={view === 'trash'}
                relevanceScore={useSemanticSearch ? searchScores.get(note.id) : undefined}
              />
            ))}
          </div>

          {totalPages > 1 && !useSemanticSearch && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
