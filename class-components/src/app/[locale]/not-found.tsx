import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 - {t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" style={{ color: 'var(--color-primary)' }}>
        {t('backToHome')}
      </Link>
    </div>
  );
}
