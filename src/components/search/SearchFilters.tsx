import React from 'react';
import { Button } from '../ui/Button';

interface SearchFiltersProps {
  searchType: 'semantic' | 'keyword';
  onSearchTypeChange: (type: 'semantic' | 'keyword') => void;
  topK: number;
  onTopKChange: (value: number) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchType,
  onSearchTypeChange,
  topK,
  onTopKChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div className="flex gap-2">
        <Button
          variant={searchType === 'semantic' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSearchTypeChange('semantic')}
          className="flex-1 sm:flex-none"
        >
          Semantic
        </Button>
        <Button
          variant={searchType === 'keyword' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSearchTypeChange('keyword')}
          className="flex-1 sm:flex-none"
        >
          Keyword
        </Button>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 self-start sm:self-auto">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Results:</label>
        <select
          value={topK}
          onChange={(e) => onTopKChange(Number(e.target.value))}
          className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};
