import { render, screen } from '../../app/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Flyout from './Flyout';

describe('Flyout Component', () => {
  const onUnselectAllMock = vi.fn();
  const onDownloadMock = vi.fn();

  it('should not render if selectedCount is 0', () => {
    const { container } = render(
      <Flyout
        selectedCount={0}
        onUnselectAll={onUnselectAllMock}
        onDownload={onDownloadMock}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render correctly with 1 item selected', () => {
    render(
      <Flyout
        selectedCount={1}
        onUnselectAll={onUnselectAllMock}
        onDownload={onDownloadMock}
      />
    );
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('should render correctly with multiple items selected', () => {
    render(
      <Flyout
        selectedCount={5}
        onUnselectAll={onUnselectAllMock}
        onDownload={onDownloadMock}
      />
    );
    expect(screen.getByText('5 items selected')).toBeInTheDocument();
  });

  it('should call onUnselectAll when the button is clicked', async () => {
    render(
      <Flyout
        selectedCount={5}
        onUnselectAll={onUnselectAllMock}
        onDownload={onDownloadMock}
      />
    );
    const unselectButton = screen.getByRole('button', {
      name: /unselect all/i,
    });
    await userEvent.click(unselectButton);
    expect(onUnselectAllMock).toHaveBeenCalledTimes(1);
  });

  it('should call onDownload when the button is clicked', async () => {
    render(
      <Flyout
        selectedCount={5}
        onUnselectAll={onUnselectAllMock}
        onDownload={onDownloadMock}
      />
    );
    const downloadButton = screen.getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);
    expect(onDownloadMock).toHaveBeenCalledTimes(1);
  });
});
