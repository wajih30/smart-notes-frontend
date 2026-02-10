import React, { useState } from 'react';
import { searchApi } from '../api/search';
import { SearchBar } from '../components/search/SearchBar';
import { SearchFilters } from '../components/search/SearchFilters';
import { SearchResults } from '../components/search/SearchResults';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { SearchResult, KeywordSearchResult } from '../types';
import { toast } from '../utils/toast';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'semantic' | 'keyword'>('semantic');
  const [topK, setTopK] = useState(10);
  const [results, setResults] = useState<(SearchResult | KeywordSearchResult)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      let resultsArr: (SearchResult | KeywordSearchResult)[] = [];
      if (searchType === 'semantic') {
        const response = await searchApi.semanticSearch({
          query: query.trim(),
          top_k: topK * 2, // Fetch more to allow for deduplication
        });

        // Fail-safe: Deduplicate by note_id on frontend as well
        const scoresMap = new Map<string, SearchResult>();
        response.results.forEach(res => {
          const current = scoresMap.get(res.note_id);
          if (!current || res.relevance_score > current.relevance_score) {
            scoresMap.set(res.note_id, res);
          }
        });

        resultsArr = Array.from(scoresMap.values())
          .sort((a, b) => b.relevance_score - a.relevance_score);
      } else {
        const response = await searchApi.keywordSearch({
          keywords: query.trim(),
          top_k: topK * 2,
        });

        // Deduplicate by note_id
        const uniqueMap = new Map<string, KeywordSearchResult>();
        response.results.forEach(res => {
          if (!uniqueMap.has(res.note_id)) {
            uniqueMap.set(res.note_id, res);
          }
        });
        resultsArr = Array.from(uniqueMap.values()).slice(0, topK);
      }
      setResults(resultsArr);
    } catch (error: any) {
      toast.error('Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Notes</h1>

      <div className="card-premium p-6 mb-6">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        <div className="mt-4">
          <SearchFilters
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            topK={topK}
            onTopKChange={setTopK}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : hasSearched ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <SearchResults results={results} searchType={searchType} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Enter a search query to find notes</p>
        </div>
      )}
    </div>
  );
};
