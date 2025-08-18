import { render, screen, fireEvent } from '../../__tests__/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import { useSearchStore } from '@/app/store/searchStore';

const mockPush = vi.fn();

vi.mock('../../../navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchStore.setState({ searchTerm: '' });
  });

  it('should render navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('should call setSearchTerm and router.push on search', async () => {
    const setSearchTermSpy = vi.spyOn(
      useSearchStore.getState(),
      'setSearchTerm'
    );
    render(<Header />);

    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    fireEvent.click(searchButton);

    expect(setSearchTermSpy).toHaveBeenCalledWith('pikachu');
    expect(mockPush).toHaveBeenCalledWith('/?page=1&search=pikachu');
  });
});
