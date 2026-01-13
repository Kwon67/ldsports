'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  placeholder?: string;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  team?: string;
}

export default function SearchBar({
  onSearch,
  onFilterChange,
  placeholder = 'Buscar camisas...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const applyFilters = () => {
    onFilterChange?.({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    onFilterChange?.({});
    setShowFilters(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 border rounded-lg transition-colors ${showFilters ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <h4 className="font-bold text-sm uppercase mb-3">Filtros de Preço</h4>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Mínimo</label>
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="R$ 0"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Máximo</label>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="R$ 500"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="flex-1 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100"
            >
              Limpar
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-2 bg-black text-white rounded text-sm font-medium hover:opacity-90"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
