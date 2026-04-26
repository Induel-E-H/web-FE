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
});
