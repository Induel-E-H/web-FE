import { TRANSPORT_ITEMS } from '@entities/map';
import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MapCard } from './MapCard';

describe('MapCard', () => {
  describe('회사 정보 표시', () => {
    it('회사명이 h3로 표시된다', () => {
      render(<MapCard />);

      expect(
        screen.getByRole('heading', {
          level: 3,
          name: '(주) 인들이앤에이치 본사',
        }),
      ).toBeInTheDocument();
    });

    it('전화 링크가 올바르게 렌더링된다', () => {
      render(<MapCard />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `tel:${COMPANY.PHONE}`);
    });

    it('전화 번호가 표시된다', () => {
      render(<MapCard />);

      expect(screen.getByText(COMPANY.PHONE_DISPLAY)).toBeInTheDocument();
    });

    it('"문의 전화:" 텍스트가 존재한다', () => {
      render(<MapCard />);

      expect(screen.getByText('문의 전화:')).toBeInTheDocument();
    });
  });

  describe('교통 정보 리스트', () => {
    it('TRANSPORT_ITEMS 개수만큼 리스트가 렌더링된다', () => {
      render(<MapCard />);

      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(TRANSPORT_ITEMS.length);
    });

    it('각 transport label이 표시된다', () => {
      render(<MapCard />);

      TRANSPORT_ITEMS.forEach(({ label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('각 transport lines가 모두 표시된다', () => {
      render(<MapCard />);

      TRANSPORT_ITEMS.forEach(({ lines }) => {
        lines.forEach((line) => {
          expect(screen.getByText(line)).toBeInTheDocument();
        });
      });
    });

    it('각 transport label이 h4 요소로 표시된다', () => {
      render(<MapCard />);

      const headings = screen.getAllByRole('heading', { level: 4 });
      expect(headings).toHaveLength(TRANSPORT_ITEMS.length);
      TRANSPORT_ITEMS.forEach(({ label }, i) => {
        expect(headings[i]).toHaveTextContent(label);
      });
    });
  });

  describe('시맨틱 구조', () => {
    it('address 요소가 존재한다', () => {
      const { container } = render(<MapCard />);

      const address = container.querySelector('address');
      expect(address).toBeInTheDocument();
      expect(address).toHaveClass('map__card_content');
    });

    it('ul.map__description 리스트가 존재한다', () => {
      const { container } = render(<MapCard />);

      expect(
        container.querySelector('ul.map__description'),
      ).toBeInTheDocument();
    });

    it('hr 요소가 존재한다', () => {
      const { container } = render(<MapCard />);

      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('hr 요소에 aria-hidden="true" 속성이 있다', () => {
      const { container } = render(<MapCard />);

      expect(container.querySelector('hr')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('전화 링크에 map__description_call 클래스가 있다', () => {
      const { container } = render(<MapCard />);

      expect(
        container.querySelector('a.map__description_call'),
      ).toBeInTheDocument();
    });
  });
});
