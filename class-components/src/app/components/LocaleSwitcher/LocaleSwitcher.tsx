'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useState, useTransition } from 'react';

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [currentLocale, setCurrentLocale] = useState(locale);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    setCurrentLocale(nextLocale);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      defaultValue={currentLocale}
      onChange={onSelectChange}
      disabled={isPending}
      style={{
        backgroundColor: 'var(--color-input-bg)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        padding: '0.3rem',
      }}
    >
      <option value="en">English</option>
      <option value="ru">Русский</option>
    </select>
  );
}
