import { artworks } from '@entities/history';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContentPage } from './Content';

describe('ContentPage', () => {
  describe('렌더링', () => {
    it('유효한 인덱스의 영문 타이틀이 렌더링된다', () => {
      render(<ContentPage side='left' pageIndex={0} />);
      expect(screen.getByText(artworks[0].titleEng)).toBeInTheDocument();
    });

    it('유효한 인덱스의 한국어 타이틀이 렌더링된다', () => {
      render(<ContentPage side='left' pageIndex={0} />);
      expect(screen.getByText(artworks[0].title)).toBeInTheDocument();
    });

    it('right side는 pageIndex*2+1 인덱스의 작품을 렌더링한다', () => {
      render(<ContentPage side='right' pageIndex={0} />);
      expect(screen.getByText(artworks[1].titleEng)).toBeInTheDocument();
    });

    it('범위를 초과한 pageIndex에서는 빈 컨테이너를 렌더링한다', () => {
      const { container } = render(<ContentPage side='left' pageIndex={999} />);
      expect(container.querySelector('.content__empty')).toBeInTheDocument();
    });

    it('작품 주소가 렌더링된다', () => {
      render(<ContentPage side='left' pageIndex={0} />);
      expect(screen.getByText(artworks[0].address)).toBeInTheDocument();
    });
  });
});
