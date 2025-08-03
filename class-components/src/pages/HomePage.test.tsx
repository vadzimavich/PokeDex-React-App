import { render, screen } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage Component', () => {
  const renderHomePage = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should call navigate when a card is clicked', async () => {
    renderHomePage();
    const card = await screen.findByText('bulbasaur');
    const clickableDiv = card.closest('div[style*="cursor: pointer"]');

    if (!clickableDiv) {
      throw new Error('Test failed: clickable card div not found');
    }
    await userEvent.click(clickableDiv);

    expect(mockNavigate).toHaveBeenCalledWith('details/1');
  });
});
