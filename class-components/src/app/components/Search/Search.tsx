'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  initialValue: string;
}

export default function Search({ onSearch, initialValue }: SearchProps) {
  const t = useTranslations('Search');
  const [inputValue, setInputValue] = useState(initialValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(inputValue.trim());
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder={t('placeholder')}
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="search-button" onClick={handleSearchClick}>
        {t('button')}
      </button>
    </div>
  );
}
