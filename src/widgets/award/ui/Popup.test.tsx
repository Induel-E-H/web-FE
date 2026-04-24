import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AwardPopup } from './Popup';

vi.mock('../model/image', () => ({
  getAwardImage: vi.fn().mockReturnValue('popup-image.webp'),
}));

describe('AwardPopup', () => {
  describe('렌더링', () => {
    it('dialog 역할로 렌더링된다', () => {
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={vi.fn()} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true"가 설정된다', () => {
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={vi.fn()} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-label에 수상 제목이 포함된다', () => {
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={vi.fn()} />);
      expect(
        screen.getByRole('dialog', { name: '우수상 수상 이미지' }),
      ).toBeInTheDocument();
    });

    it('닫기 버튼이 렌더링된다', () => {
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });

    it('이미지 alt 텍스트에 수상 제목이 포함된다', () => {
      render(
        <AwardPopup awardId={3} awardTitle='최우수상' onClose={vi.fn()} />,
      );
      expect(screen.getByAltText('최우수상')).toBeInTheDocument();
    });

    it('이미지 src가 getAwardImage 반환값이다', () => {
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={vi.fn()} />);
      expect(screen.getByAltText('우수상')).toHaveAttribute(
        'src',
        'popup-image.webp',
      );
    });
  });

  describe('닫기 동작', () => {
    it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={onClose} />);

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('오버레이 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      const { container } = render(
        <AwardPopup awardId={1} awardTitle='우수상' onClose={onClose} />,
      );
      const overlay = container.querySelector('.popup__overlay')!;

      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('팝업 내부 클릭 시 onClose가 호출되지 않는다 (stopPropagation)', () => {
      const onClose = vi.fn();
      render(<AwardPopup awardId={1} awardTitle='우수상' onClose={onClose} />);

      fireEvent.click(screen.getByRole('dialog'));

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
