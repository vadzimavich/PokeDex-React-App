import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ru'] as const;

export default getRequestConfig(async ({ locale }) => {
  const isValidLocale = (locales as readonly string[]).includes(locale);
  if (!isValidLocale) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
