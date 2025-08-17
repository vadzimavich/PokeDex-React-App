'use client';

import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '../../../navigation';
import { useTranslations } from 'next-intl';
import { useSearchStore } from '@/app/store/searchStore';

import Search from '../Search/Search';
import ThemeSwitcher from '../ThemeSwitch/ThemeSwitch';
import RefreshButton from '../RefreshButton/RefreshButton';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('Header');
  const { searchTerm, setSearchTerm } = useSearchStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('search', term);
    if (!term) {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          {t('home')}
        </Link>
        <Link href="/about" className={styles.navLink}>
          {t('about')}
        </Link>
      </nav>
      <div className={styles.searchWrapper}>
        <Search onSearch={handleSearch} initialValue={searchTerm} />
      </div>
      <div className={styles.controlsWrapper}>
        <LocaleSwitcher />
        <RefreshButton />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
