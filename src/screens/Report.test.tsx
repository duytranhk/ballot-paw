import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Report from '../screens/Report';
import { renderWithContext } from '../test/renderWithContext';

vi.mock('../utils/haptics', () => ({ vibrate: vi.fn() }));
vi.mock('../utils/share', () => ({
  buildResultText: vi.fn(() => 'result text'),
  shareResult: vi.fn(),
}));

const candidates = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
];

describe('Report screen', () => {
  const navigate = vi.fn();

  beforeEach(() => {
    navigate.mockClear();
  });

  it('renders heading and ballot count', () => {
    renderWithContext(<Report navigate={navigate} />, {
      candidates,
      votes: { a: 3, b: 2 },
      ballotCount: 5,
    });
    expect(screen.getByText('KẾT QUẢ CUỐI CÙNG')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows candidate names', () => {
    renderWithContext(<Report navigate={navigate} />, {
      candidates,
      votes: { a: 3, b: 2 },
      ballotCount: 5,
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('opens confirm modal when clicking new session button', async () => {
    const user = userEvent.setup();
    renderWithContext(<Report navigate={navigate} />, {
      candidates,
      votes: { a: 3, b: 2 },
      ballotCount: 5,
    });
    await user.click(screen.getByText('PHIÊN KIỂM PHIẾU MỚI'));
    expect(screen.getByText('Bạn muốn bắt đầu phiên kiểm phiếu mới?')).toBeInTheDocument();
  });

  it('cancels the modal without navigating', async () => {
    const user = userEvent.setup();
    renderWithContext(<Report navigate={navigate} />, {
      candidates,
      votes: { a: 1, b: 1 },
      ballotCount: 2,
    });
    await user.click(screen.getByText('PHIÊN KIỂM PHIẾU MỚI'));
    await user.click(screen.getByText('Huỷ'));
    expect(navigate).not.toHaveBeenCalled();
  });

  it('resets and navigates to setup on confirm', async () => {
    const user = userEvent.setup();
    renderWithContext(<Report navigate={navigate} />, {
      candidates,
      votes: { a: 1, b: 0 },
      ballotCount: 1,
    });
    await user.click(screen.getByText('PHIÊN KIỂM PHIẾU MỚI'));
    await user.click(screen.getByText('Xác nhận'));
    expect(navigate).toHaveBeenCalledWith('setup');
  });

  it('calls shareResult when clicking share button', async () => {
    const { shareResult } = await import('../utils/share');
    const user = userEvent.setup();
    renderWithContext(<Report navigate={navigate} />, {
      candidates,
      votes: { a: 2, b: 1 },
      ballotCount: 3,
    });
    await user.click(screen.getByText('CHIA SẺ KẾT QUẢ'));
    expect(shareResult).toHaveBeenCalled();
  });
});

