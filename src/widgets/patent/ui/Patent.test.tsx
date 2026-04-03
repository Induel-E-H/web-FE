import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import PATENT_LIST_DATA from '../model/PatentListData';
import Patent from './Patent';

// .webp 이미지 import 모킹
vi.mock('../model/PatentImgData', () => ({
  default: ['img-0', 'img-1', 'img-2', 'img-3', 'img-4'],
}));

// react-icons 모킹 (SVG 렌더링 불필요)
vi.mock('react-icons/io', () => ({
  IoIosArrowBack: () => <span data-testid='icon-back' />,
  IoIosArrowForward: () => <span data-testid='icon-forward' />,
  IoIosArrowDown: () => <span data-testid='icon-down' />,
  IoIosArrowUp: () => <span data-testid='icon-up' />,
}));

describe('Patent', () => {
  describe('시맨틱 구조', () => {
    it('최상위 요소가 section.patent로 렌더링된다', () => {
      const { container } = render(<Patent />);

      expect(container.querySelector('section.patent')).toBeInTheDocument();
    });
  });

  describe('타이틀', () => {
    it('"Patent" 텍스트가 표시된다', () => {
      render(<Patent />);

      expect(screen.getByText('Patent')).toBeInTheDocument();
    });

    it('유효 특허 건수가 표시된다', () => {
      render(<Patent />);

      // PATENT_IMG_DATA mock의 길이 = 5
      expect(screen.getByText(/유효 특허 5건/)).toBeInTheDocument();
    });

    it('권리 소멸 건수가 표시된다', () => {
      render(<Patent />);

      expect(
        screen.getByText(
          new RegExp(`권리 소멸\\s*${PATENT_LIST_DATA.length}건`),
        ),
      ).toBeInTheDocument();
    });
  });

  describe('하위 컴포넌트', () => {
    it('캐러셀이 렌더링된다', () => {
      const { container } = render(<Patent />);

      expect(container.querySelector('.patent__carousel')).toBeInTheDocument();
    });

    it('권리 소멸 목록 영역이 렌더링된다', () => {
      const { container } = render(<Patent />);

      expect(
        container.querySelector('.patent__content-sub'),
      ).toBeInTheDocument();
    });
  });
});
