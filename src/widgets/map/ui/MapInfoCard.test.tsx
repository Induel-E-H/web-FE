import { COMPANY } from '@shared/constant';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MapInfoCard } from './MapInfoCard';

vi.mock('@shared/assets', () => ({ induelIcon: 'induel-icon.svg' }));

describe('MapInfoCard', () => {
  it('회사 한글 이름이 렌더링된다', () => {
    render(<MapInfoCard />);
    expect(screen.getByText(COMPANY.NAME_KO)).toBeInTheDocument();
  });

  it('회사 영문 전체 명칭이 렌더링된다', () => {
    render(<MapInfoCard />);
    expect(screen.getByText(COMPANY.NAME_EN_FULL)).toBeInTheDocument();
  });

  it('전화번호 tel: 링크가 렌더링된다', () => {
    render(<MapInfoCard />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `tel:${COMPANY.PHONE}`);
    expect(link).toHaveTextContent(COMPANY.PHONE_DISPLAY);
  });

  it('회사 주소(전체)가 렌더링된다', () => {
    render(<MapInfoCard />);
    expect(screen.getByText(COMPANY.ADDRESS_FULL)).toBeInTheDocument();
  });

  it('회사 주소(부가)가 렌더링된다', () => {
    render(<MapInfoCard />);
    expect(screen.getByText(COMPANY.ADDRESS_SUB)).toBeInTheDocument();
  });

  it('map__info 루트 요소가 렌더링된다', () => {
    const { container } = render(<MapInfoCard />);
    expect(container.querySelector('.map__info')).toBeInTheDocument();
  });

  it('말풍선 꼬리(map__info__tail)가 렌더링된다', () => {
    const { container } = render(<MapInfoCard />);
    expect(container.querySelector('.map__info__tail')).toBeInTheDocument();
  });

  it('로고 img에 aria-hidden="true" 속성이 있다', () => {
    const { container } = render(<MapInfoCard />);

    expect(container.querySelector('img.map__info__logo')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('map__info__card 내부에 map__info__header가 존재한다', () => {
    const { container } = render(<MapInfoCard />);

    const card = container.querySelector('.map__info__card');
    expect(card?.querySelector('.map__info__header')).toBeInTheDocument();
  });

  it('map__info__card 내부에 map__info__body가 존재한다', () => {
    const { container } = render(<MapInfoCard />);

    const card = container.querySelector('.map__info__card');
    expect(card?.querySelector('.map__info__body')).toBeInTheDocument();
  });

  it('map__info__row 요소가 2개 존재한다', () => {
    const { container } = render(<MapInfoCard />);

    const rows = container.querySelectorAll('.map__info__row');
    expect(rows).toHaveLength(2);
  });
});
