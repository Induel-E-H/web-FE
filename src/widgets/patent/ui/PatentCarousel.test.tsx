import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PatentCarousel from './PatentCarousel';

const mockImages = ['img-0', 'img-1', 'img-2', 'img-3', 'img-4'];

// offset별 CSS 클래스 조회 헬퍼
function getCardByOffset(container: HTMLElement, offset: number) {
  return container.querySelector(`.patent__carousel-card--offset-${offset}`);
}

describe('PatentCarousel', () => {
  describe('초기 렌더링', () => {
    it('이전/다음 버튼이 렌더링된다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);

      const buttons = container.querySelectorAll('.patent__carousel-btn');
      expect(buttons).toHaveLength(2);
    });

    it('초기 activeIndex는 2이다 (가운데 카드가 offset-0)', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);

      expect(getCardByOffset(container, 0)).toBeInTheDocument();
    });

    it('5개 이미지 기준 모든 카드가 렌더링된다 (|offset| ≤ 2)', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);

      const cards = container.querySelectorAll('.patent__carousel-card');
      expect(cards).toHaveLength(5);
    });

    it('각 카드에 img 태그가 렌더링된다', () => {
      render(<PatentCarousel images={mockImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(5);
    });
  });

  describe('이전 버튼 클릭', () => {
    it('클릭 시 activeIndex가 1 감소한다 (offset-0 카드가 변경)', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);
      const [prevBtn] = container.querySelectorAll('.patent__carousel-btn');

      // 초기 activeIndex=2, img-2가 offset-0
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-2');

      fireEvent.click(prevBtn);

      // activeIndex=1, img-1이 offset-0
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-1');
    });

    it('activeIndex가 0일 때 클릭하면 마지막 카드로 순환한다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);
      const [prevBtn] = container.querySelectorAll('.patent__carousel-btn');

      // activeIndex 0으로 이동 (2번 클릭)
      fireEvent.click(prevBtn);
      fireEvent.click(prevBtn);

      // activeIndex=0, img-0이 offset-0
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-0');

      fireEvent.click(prevBtn);

      // activeIndex=(0-1+5)%5=4, img-4가 offset-0
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-4');
    });
  });

  describe('다음 버튼 클릭', () => {
    it('클릭 시 activeIndex가 1 증가한다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);
      const buttons = container.querySelectorAll('.patent__carousel-btn');
      const nextBtn = buttons[1];

      // 초기 activeIndex=2
      fireEvent.click(nextBtn);

      // activeIndex=3, img-3이 offset-0
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-3');
    });

    it('마지막 카드에서 클릭하면 첫 번째 카드로 순환한다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);
      const buttons = container.querySelectorAll('.patent__carousel-btn');
      const nextBtn = buttons[1];

      // activeIndex를 4로 이동 (2번 클릭)
      fireEvent.click(nextBtn);
      fireEvent.click(nextBtn);

      // activeIndex=4
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-4');

      fireEvent.click(nextBtn);

      // activeIndex=(4+1)%5=0, img-0이 offset-0
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-0');
    });
  });

  describe('카드 클릭', () => {
    it('카드 클릭 시 해당 카드가 activeIndex가 된다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);

      // 초기 activeIndex=2, offset-1 카드는 img-3
      const offset1Card = getCardByOffset(container, 1);
      expect(offset1Card?.querySelector('img')).toHaveAttribute('src', 'img-3');

      fireEvent.click(offset1Card!);

      // img-3이 offset-0이 되어야 함
      expect(
        getCardByOffset(container, 0)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-3');
    });
  });

  describe('getOffset 순환 계산', () => {
    it('activeIndex=0일 때 마지막 이미지가 offset--1로 렌더링된다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);
      const [prevBtn] = container.querySelectorAll('.patent__carousel-btn');

      // activeIndex를 0으로 이동
      fireEvent.click(prevBtn);
      fireEvent.click(prevBtn);

      // activeIndex=0, img-4의 offset: 4-0=4 > Math.floor(5/2)=2 → 4-5=-1
      expect(
        getCardByOffset(container, -1)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-4');
    });

    it('activeIndex=4일 때 첫 번째 이미지가 offset-1로 렌더링된다', () => {
      const { container } = render(<PatentCarousel images={mockImages} />);
      const buttons = container.querySelectorAll('.patent__carousel-btn');
      const nextBtn = buttons[1];

      // activeIndex를 4로 이동
      fireEvent.click(nextBtn);
      fireEvent.click(nextBtn);

      // activeIndex=4, img-0의 offset: 0-4=-4 < -Math.floor(5/2)=-2 → -4+5=1
      expect(
        getCardByOffset(container, 1)?.querySelector('img'),
      ).toHaveAttribute('src', 'img-0');
    });
  });
});
