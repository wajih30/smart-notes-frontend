import { Search, Pin, Sparkles } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export type NotesView = 'all' | 'archived' | 'trash';

interface NoteFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isPinned?: boolean;
  onPinnedChange: (value: boolean | undefined) => void;
  view: NotesView;
  onViewChange: (view: NotesView) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  useSemanticSearch: boolean;
  onSemanticSearchToggle: (enabled: boolean) => void;
}

export const NoteFilters: React.FC<NoteFiltersProps> = ({
  search,
  onSearchChange,
  isPinned,
  onPinnedChange,
  view,
  onViewChange,
  sortBy,
  onSortChange,
  useSemanticSearch,
  onSemanticSearchToggle,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder={useSemanticSearch ? "Search concepts, meaning..." : "Search notes..."}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={useSemanticSearch ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onSemanticSearchToggle(!useSemanticSearch)}
            className={cn(
              'transition-all duration-300',
              useSemanticSearch && 'bg-gradient-to-r from-purple-600 to-blue-600 border-none'
            )}
          >
            <Sparkles size={16} className="mr-1" />
            Semantic Search
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewChange('all')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm transition-colors',
              view === 'all'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            All Notes
          </button>
          <button
            onClick={() => onViewChange('archived')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm transition-colors',
              view === 'archived'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Archived
          </button>
          <button
            onClick={() => onViewChange('trash')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm transition-colors',
              view === 'trash'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Trash
          </button>
        </div>

        <div className="flex items-center gap-3">
          {view === 'all' && (
            <Button
              variant={isPinned === undefined ? 'outline' : isPinned ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPinnedChange(isPinned === true ? undefined : true)}
            >
              <Pin size={16} className="mr-1" />
              Pinned
            </Button>
          )}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={useSemanticSearch}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="created_at">Newest First</option>
            <option value="updated_at">Recently Updated</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};
