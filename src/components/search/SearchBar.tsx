import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  isLoading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-primary-500 transition-colors">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder="Search your knowledge base..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-11"
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="px-6 h-[50px] mt-[1.5px]">
        Search
      </Button>
    </form>
  );
};
