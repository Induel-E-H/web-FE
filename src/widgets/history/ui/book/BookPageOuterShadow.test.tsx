import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BookPageOuterShadow } from './BookPageOuterShadow';

describe('BookPageOuterShadow', () => {
  it('컨테이너 div가 렌더링된다', () => {
    const { container } = render(<BookPageOuterShadow side='left' count={0} />);
    expect(
      container.querySelector('.history__book-page-outer-shadow'),
    ).toBeInTheDocument();
  });

  it('count=0이면 shadow 요소가 없다', () => {
    const { container } = render(<BookPageOuterShadow side='left' count={0} />);
    const wrapper = container.querySelector(
      '.history__book-page-outer-shadow',
    )!;
    expect(wrapper.children.length).toBe(0);
  });

  it('side="left", count=3이면 레벨이 [3, 2, 1] 순으로 렌더링된다 (내림차순)', () => {
    const { container } = render(<BookPageOuterShadow side='left' count={3} />);
    const wrapper = container.querySelector(
      '.history__book-page-outer-shadow',
    )!;
    expect(wrapper.children.length).toBe(3);
    expect(wrapper.children[0].className).toBe(
      'history__book-page-outer-shadow-3',
    );
    expect(wrapper.children[1].className).toBe(
      'history__book-page-outer-shadow-2',
    );
    expect(wrapper.children[2].className).toBe(
      'history__book-page-outer-shadow-1',
    );
  });

  it('side="right", count=3이면 레벨이 [1, 2, 3] 순으로 렌더링된다 (오름차순)', () => {
    const { container } = render(
      <BookPageOuterShadow side='right' count={3} />,
    );
    const wrapper = container.querySelector(
      '.history__book-page-outer-shadow',
    )!;
    expect(wrapper.children.length).toBe(3);
    expect(wrapper.children[0].className).toBe(
      'history__book-page-outer-shadow-1',
    );
    expect(wrapper.children[1].className).toBe(
      'history__book-page-outer-shadow-2',
    );
    expect(wrapper.children[2].className).toBe(
      'history__book-page-outer-shadow-3',
    );
  });
});
