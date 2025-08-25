'use client';

import { Link } from '../../../navigation';
import { useTranslations } from 'next-intl';

import ThemeSwitcher from '../ThemeSwitch/ThemeSwitch';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('Header');

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
      <div className={styles.controlsWrapper}>
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
