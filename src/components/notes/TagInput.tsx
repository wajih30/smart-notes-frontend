import React, { useState, KeyboardEvent } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  onAddSuggestion?: (tag: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  suggestions = [],
  onAddSuggestion,
}) => {
  const [inputValue, setInputValue] = useState('');

  // Safe-guard: ensure suggestions is an array
  const validSuggestions = Array.isArray(suggestions) ? suggestions : [];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const addSuggestion = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onChange([...tags, suggestion]);
      if (onAddSuggestion) {
        onAddSuggestion(suggestion);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
          >
            <TagIcon size={14} />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-primary-900"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>
      {validSuggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {validSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addSuggestion(suggestion)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
