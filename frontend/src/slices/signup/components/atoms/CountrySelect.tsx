'use client';
/**
 * CountrySelect component for selecting country of origin
 */
import React, { useState, useRef, useEffect } from 'react';
import { Country, countries, getCountryByCode } from '../../data/countries';
import { ChevronDown, Search } from 'lucide-react';

interface CountrySelectProps {
  value: string; // Country code (e.g., "CO")
  onChange: (country: Country) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  'data-testid'?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = "Selecciona tu país",
  label = "País",
  error,
  required = false,
  'data-testid': testId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = getCountryByCode(value);

  // Filter countries based on search term
  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleCountrySelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className="space-y-2" data-testid={testId}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown container */}
      <div className="relative" ref={dropdownRef}>
        {/* Select button */}
        <button
          type="button"
          onClick={toggleDropdown}
          className={`
            relative w-full bg-white border rounded-lg px-3 py-3 text-left cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-400'}
          `}
          data-testid={`${testId}-button`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedCountry ? (
                <>
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="text-gray-900">{selectedCountry.name}</span>
                </>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <ChevronDown
              className={`size-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar país..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  data-testid={`${testId}-search`}
                />
              </div>
            </div>

            {/* Countries list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`
                      w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-3
                      ${value === country.code ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                    `}
                    data-testid={`${testId}-option-${country.code}`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                    {value === country.code && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-center">
                  No se encontraron países
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};