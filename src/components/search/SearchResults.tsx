import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp } from 'lucide-react';
import type { SearchResult, KeywordSearchResult } from '../../types';
import { cn } from '../../utils/cn';

interface SearchResultsProps {
  results: (SearchResult | KeywordSearchResult)[];
  searchType: 'semantic' | 'keyword';
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, searchType }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => {
        const isSemantic = 'relevance_score' in result;
        const noteId = result.note_id;

        return (
          <Link
            key={`${noteId}-${index}`}
            to={`/notes/${noteId}`}
            className="block card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-primary-600" />
                <h3 className="font-semibold text-gray-900">{result.note_title}</h3>
              </div>
              {isSemantic && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <TrendingUp size={16} />
                  <span>{(result.relevance_score * 100).toFixed(0)}% match</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">{result.chunk_text}</p>
            {isSemantic && (
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  Semantic Search
                </span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};
