import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PatentPopup } from './Popup';

vi.mock('@entities/patent', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/patent')>();
  return {
    ...actual,
    getPatentImage: vi.fn().mockReturnValue('popup-image.webp'),
  };
});

describe('PatentPopup', () => {
  describe('렌더링', () => {
    it('dialog 역할로 렌더링된다', () => {
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={vi.fn()} />,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true"가 설정된다', () => {
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={vi.fn()} />,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-label에 특허증 제목이 포함된다', () => {
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={vi.fn()} />,
      );
      expect(
        screen.getByRole('dialog', { name: '의자 특허 특허증 이미지' }),
      ).toBeInTheDocument();
    });

    it('닫기 버튼이 렌더링된다', () => {
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={vi.fn()} />,
      );
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });

    it('이미지 alt 텍스트에 특허증 제목이 포함된다', () => {
      render(
        <PatentPopup patentId={3} patentTitle='의자 특허' onClose={vi.fn()} />,
      );
      expect(
        screen.getByAltText('의자 특허 특허증 이미지'),
      ).toBeInTheDocument();
    });

    it('이미지 src가 getPatentImage 반환값이다', () => {
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={vi.fn()} />,
      );
      expect(screen.getByAltText('의자 특허 특허증 이미지')).toHaveAttribute(
        'src',
        'popup-image.webp',
      );
    });
  });

  describe('닫기 동작', () => {
    it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={onClose} />,
      );

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('오버레이 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      const { container } = render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={onClose} />,
      );
      const overlay = container.querySelector('.popup__overlay')!;

      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('팝업 내부 클릭 시 onClose가 호출되지 않는다 (stopPropagation)', () => {
      const onClose = vi.fn();
      render(
        <PatentPopup patentId={1} patentTitle='의자 특허' onClose={onClose} />,
      );

      fireEvent.click(screen.getByRole('dialog'));

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
