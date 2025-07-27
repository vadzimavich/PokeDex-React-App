import Search from '../Search/Search';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  initialValue: string;
}

const Header = ({ onSearch, initialValue }: HeaderProps) => {
  return (
    <header className="header">
      <Search onSearch={onSearch} initialValue={initialValue} />
    </header>
  );
};

export default Header;
