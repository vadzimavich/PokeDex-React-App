import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.7',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  link: {
    color: 'var(--color-primary)',
    textDecoration: 'underline',
  },
  backLink: {
    display: 'inline-block',
    marginTop: '2rem',
  },
};

export default async function AboutPage() {
  const t = await getTranslations('AboutPage');

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{t('title')}</h1>
      <p>{t('author')}</p>
      <p>
        {t('course')}
        <a
          href="https://rs.school/react/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          {t('courseLinkText')}
        </a>
        .
      </p>
      <Link href="/" style={{ ...styles.link, ...styles.backLink }}>
        &larr; {t('back')}
      </Link>
    </div>
  );
}
