import { PATENT_VALID_LIST } from '@entities/patent';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PatentValidContent } from './ValidContent';

vi.mock('@shared/lib/useScrollLock/useScrollLock', () => ({
  lockScroll: vi.fn(),
  unlockScroll: vi.fn(),
}));

describe('PatentValidContent', () => {
  it('유효 특허 건수가 표시된다', () => {
    render(<PatentValidContent />);
    expect(
      screen.getByText(`유효 특허증 (${PATENT_VALID_LIST.length}건)`),
    ).toBeInTheDocument();
  });

  it('PATENT_VALID_LIST 개수만큼 카드가 렌더링된다', () => {
    const { container } = render(<PatentValidContent />);
    expect(container.querySelectorAll('button.patent__card')).toHaveLength(
      PATENT_VALID_LIST.length,
    );
  });

  it('각 카드에 특허 제목이 표시된다', () => {
    render(<PatentValidContent />);
    PATENT_VALID_LIST.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  describe('팝업 열기/닫기', () => {
    it('카드 클릭 시 팝업이 열린다', () => {
      render(<PatentValidContent />);
      const cards = screen.getAllByRole('button');
      fireEvent.click(cards[0]);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('팝업이 열리면 첫 번째 특허 제목이 aria-label로 설정된다', () => {
      render(<PatentValidContent />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(
        screen.getByRole('dialog', { name: PATENT_VALID_LIST[0].title }),
      ).toBeInTheDocument();
    });

    it('두 번째 카드 클릭 시 두 번째 특허 팝업이 열린다', () => {
      render(<PatentValidContent />);
      fireEvent.click(screen.getAllByRole('button')[1]);
      expect(
        screen.getByRole('dialog', { name: PATENT_VALID_LIST[1].title }),
      ).toBeInTheDocument();
    });

    it('팝업 닫기 버튼 클릭 시 팝업이 닫힌다', () => {
      render(<PatentValidContent />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('팝업이 없는 초기 상태에서 dialog가 렌더링되지 않는다', () => {
      render(<PatentValidContent />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
