import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useSearchStore } from '../../app/store/searchStore';
import Search from '../Search/Search';
import ThemeSwitcher from '../ThemeSwitch/ThemeSwitch';
import RefreshButton from '../RefreshButton/RefreshButton';
import styles from './Header.module.css';

const Header = () => {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [_searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams((prev) => {
      prev.set('page', '1');
      prev.delete('details');
      return prev;
    });
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <Link to="/about" className={styles.navLink}>
          About
        </Link>
      </nav>
      <div className={styles.searchWrapper}>
        <Search onSearch={handleSearch} initialValue={searchTerm} />
      </div>
      <div className={styles.controlsWrapper}>
        <RefreshButton />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
