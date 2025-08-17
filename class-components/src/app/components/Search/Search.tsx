import { useState } from 'react';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  initialValue: string;
}

const Search = ({ onSearch, initialValue }: SearchProps) => {
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
        placeholder="Search..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="search-button" onClick={handleSearchClick}>
        Search
      </button>
    </div>
  );
};

export default Search;
