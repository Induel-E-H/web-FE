import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InfoCard } from './InfoCard';

vi.mock('../styles/InfoCard.css', () => ({}));

const defaultProps = {
  icon: <svg data-testid='test-icon' />,
  year: { text: '2023년', dateTime: '2023' },
  title: '테스트 제목',
  secondary: '보조 텍스트',
  onClick: vi.fn(),
  className: undefined as string | undefined,
};

function renderCard(overrides?: Partial<typeof defaultProps>) {
  return render(<InfoCard {...defaultProps} {...overrides} />);
}

describe('InfoCard', () => {
  describe('렌더링', () => {
    it('button 역할로 렌더링된다', () => {
      renderCard();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('aria-label이 "title - year.text, secondary" 형태로 설정된다', () => {
      renderCard();
      expect(
        screen.getByRole('button', {
          name: '테스트 제목 - 2023년, 보조 텍스트',
        }),
      ).toBeInTheDocument();
    });

    it('icon이 렌더링된다', () => {
      renderCard();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('year.text가 time 요소에 표시된다', () => {
      const { container } = renderCard();
      const time = container.querySelector('time');
      expect(time?.textContent).toBe('2023년');
    });

    it('year.dateTime이 time 요소의 dateTime 속성에 설정된다', () => {
      const { container } = renderCard();
      const time = container.querySelector('time');
      expect(time).toHaveAttribute('dateTime', '2023');
    });

    it('title이 렌더링된다', () => {
      const { container } = renderCard();
      expect(
        container.querySelector('.info-card__text__title')?.textContent,
      ).toBe('테스트 제목');
    });

    it('secondary가 렌더링된다', () => {
      const { container } = renderCard();
      expect(
        container.querySelector('.info-card__text__secondary')?.textContent,
      ).toBe('보조 텍스트');
    });
  });

  describe('className prop', () => {
    it('className이 없으면 "info-card" 클래스만 적용된다', () => {
      renderCard();
      const btn = screen.getByRole('button');
      expect(btn.className).toBe('info-card');
    });

    it('className이 있으면 "info-card {className}" 형태로 적용된다', () => {
      renderCard({ className: 'info-card--active' });
      const btn = screen.getByRole('button');
      expect(btn.className).toBe('info-card info-card--active');
    });
  });

  describe('상호작용', () => {
    it('버튼 클릭 시 onClick이 호출된다', async () => {
      const onClick = vi.fn();
      renderCard({ onClick });
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
