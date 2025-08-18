import { render, screen } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from './page';
import { type ReactNode } from 'react';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => `AboutPage.${key}`,
}));

vi.mock('@/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AboutPage', () => {
  it('should render the about page content', async () => {
    const PagePromise = AboutPage();

    render(await PagePromise);

    expect(
      screen.getByRole('heading', { name: 'AboutPage.title' })
    ).toBeInTheDocument();

    expect(screen.getByText('AboutPage.author')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'AboutPage.courseLinkText' })
    ).toBeInTheDocument();
  });
});
