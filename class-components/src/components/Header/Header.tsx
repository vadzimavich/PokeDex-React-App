import Search from '../Search/Search';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

const Header = ({ onSearch, searchTerm }: HeaderProps) => {
  return (
    <header className="header">
      <Search onSearch={onSearch} initialValue={searchTerm} />
    </header>
  );
};

export default Header;
