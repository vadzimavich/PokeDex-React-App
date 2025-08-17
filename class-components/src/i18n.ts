import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ru'];

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    return notFound();
  }

  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) {
    return notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
