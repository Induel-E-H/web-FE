import { useAwardStore } from '@features/award';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AwardPopup } from './Popup';

vi.mock('@entities/award', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/award')>();
  return {
    ...actual,
    getAwardImage: vi.fn().mockReturnValue('popup-image.webp'),
    AWARD_LIST: [
      {
        id: 0,
        title: '최우수상',
        category: '당선작',
        date: '2020-01-01',
        issuer: '기관',
      },
      {
        id: 1,
        title: '우수상',
        category: '당선작',
        date: '2020-01-02',
        issuer: '기관',
      },
      {
        id: 3,
        title: '금상',
        category: '당선작',
        date: '2020-01-03',
        issuer: '기관',
      },
    ],
  };
});

describe('AwardPopup', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  describe('렌더링', () => {
    it('selectedId가 null이면 렌더링되지 않는다', () => {
      render(<AwardPopup />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('dialog 역할로 렌더링된다', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true"가 설정된다', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-label에 수상 제목이 포함된다', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      expect(
        screen.getByRole('dialog', { name: '우수상 수상 이미지' }),
      ).toBeInTheDocument();
    });

    it('닫기 버튼이 렌더링된다', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });

    it('이미지 src가 getAwardImage 반환값이다', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      expect(screen.getByAltText('우수상 수상 이미지')).toHaveAttribute(
        'src',
        'popup-image.webp',
      );
    });
  });

  describe('닫기 동작', () => {
    it('닫기 버튼 클릭 시 selectedId가 null로 변경된다', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      expect(useAwardStore.getState().selectedId).toBe(null);
    });

    it('오버레이 클릭 시 selectedId가 null로 변경된다', () => {
      useAwardStore.setState({ selectedId: 1 });
      const { container } = render(<AwardPopup />);
      const overlay = container.querySelector('.popup__overlay')!;
      fireEvent.click(overlay);
      expect(useAwardStore.getState().selectedId).toBe(null);
    });

    it('팝업 내부 클릭 시 selectedId가 유지된다 (stopPropagation)', () => {
      useAwardStore.setState({ selectedId: 1 });
      render(<AwardPopup />);
      fireEvent.click(screen.getByRole('dialog'));
      expect(useAwardStore.getState().selectedId).toBe(1);
    });
  });
});
