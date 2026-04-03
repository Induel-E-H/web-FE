import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionLayout } from './SectionLayout';

describe('SectionLayout', () => {
  describe('기본 렌더링', () => {
    it('section 요소로 렌더링된다', () => {
      const { container } = render(
        <SectionLayout
          content={<div>content</div>}
          keyword={<h1>keyword</h1>}
        />,
      );
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('vision__section 클래스를 가진다', () => {
      const { container } = render(
        <SectionLayout
          content={<div>content</div>}
          keyword={<h1>keyword</h1>}
        />,
      );
      expect(container.querySelector('section')).toHaveClass('vision__section');
    });

    it('reverse 기본값은 false로 vision__section-reverse 클래스가 없다', () => {
      const { container } = render(
        <SectionLayout
          content={<div>content</div>}
          keyword={<h1>keyword</h1>}
        />,
      );
      expect(container.querySelector('section')).not.toHaveClass(
        'vision__section-reverse',
      );
    });

    it('content 노드가 vision__content-group 안에 렌더링된다', () => {
      const { container } = render(
        <SectionLayout
          content={<span>my content</span>}
          keyword={<h1>keyword</h1>}
        />,
      );
      const contentGroup = container.querySelector('.vision__content-group');
      expect(contentGroup).toBeInTheDocument();
      expect(contentGroup).toHaveTextContent('my content');
    });

    it('keyword 노드가 vision__keyword-group 안에 렌더링된다', () => {
      const { container } = render(
        <SectionLayout
          content={<div>content</div>}
          keyword={<span>my keyword</span>}
        />,
      );
      const keywordGroup = container.querySelector('.vision__keyword-group');
      expect(keywordGroup).toBeInTheDocument();
      expect(keywordGroup).toHaveTextContent('my keyword');
    });

    it('content-group과 keyword-group 모두 fade-section 클래스를 가진다', () => {
      const { container } = render(
        <SectionLayout
          content={<div>content</div>}
          keyword={<h1>keyword</h1>}
        />,
      );
      expect(container.querySelectorAll('.fade-section')).toHaveLength(2);
    });
  });

  describe('reverse prop', () => {
    it('reverse=true이면 vision__section-reverse 클래스가 추가된다', () => {
      const { container } = render(
        <SectionLayout
          reverse={true}
          content={<div>content</div>}
          keyword={<h1>keyword</h1>}
        />,
      );
      expect(container.querySelector('section')).toHaveClass(
        'vision__section-reverse',
      );
    });

    it('reverse=false이면 vision__section-reverse 클래스가 없다', () => {
      const { container } = render(
        <SectionLayout
          reverse={false}
          content={<div>content</div>}
          keyword={<h1>keyword</h1>}
        />,
      );
      expect(container.querySelector('section')).not.toHaveClass(
        'vision__section-reverse',
      );
    });
  });
});
