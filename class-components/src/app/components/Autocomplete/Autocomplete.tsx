'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
  suggestions: string[];
  id: string;
  name: string;
  inputRef?: React.Ref<HTMLInputElement>;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Autocomplete({
  suggestions,
  id,
  name,
  inputRef,
  value,
  onChange,
}: AutocompleteProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    setInputValue(userInput);
    onChange?.(userInput);

    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange?.(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={styles.autocomplete} ref={componentRef}>
      <input
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleChange}
        ref={inputRef}
        autoComplete="off"
      />
      {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
