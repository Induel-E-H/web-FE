import type { ReactElement } from 'react';

import { describe, expect, it } from 'vitest';

import { BackCoverInner } from './BackCover';
import { buildCoverContent } from './CoverContent';
import { FrontCoverInner } from './FrontCover';

const leftSlot = <span>left</span>;
const rightSlot = <span>right</span>;

describe('buildCoverContent', () => {
  describe('opening-front', () => {
    it('coverFrontContent가 FrontCoverInner 엘리먼트이다', () => {
      const result = buildCoverContent('opening-front', leftSlot, rightSlot);
      expect((result.coverFrontContent as ReactElement).type).toBe(
        FrontCoverInner,
      );
    });

    it('coverBackContent가 leftSlot이다', () => {
      const result = buildCoverContent('opening-front', leftSlot, rightSlot);
      expect(result.coverBackContent).toBe(leftSlot);
    });
  });

  describe('closing-front', () => {
    it('coverFrontContent가 leftSlot이다', () => {
      const result = buildCoverContent('closing-front', leftSlot, rightSlot);
      expect(result.coverFrontContent).toBe(leftSlot);
    });

    it('coverBackContent가 FrontCoverInner 엘리먼트이다', () => {
      const result = buildCoverContent('closing-front', leftSlot, rightSlot);
      expect((result.coverBackContent as ReactElement).type).toBe(
        FrontCoverInner,
      );
    });
  });

  describe('closing-back', () => {
    it('coverFrontContent가 rightSlot이다', () => {
      const result = buildCoverContent('closing-back', leftSlot, rightSlot);
      expect(result.coverFrontContent).toBe(rightSlot);
    });

    it('coverBackContent가 BackCoverInner 엘리먼트이다', () => {
      const result = buildCoverContent('closing-back', leftSlot, rightSlot);
      expect((result.coverBackContent as ReactElement).type).toBe(
        BackCoverInner,
      );
    });
  });

  describe('opening-back', () => {
    it('coverFrontContent가 BackCoverInner 엘리먼트이다', () => {
      const result = buildCoverContent('opening-back', leftSlot, rightSlot);
      expect((result.coverFrontContent as ReactElement).type).toBe(
        BackCoverInner,
      );
    });

    it('coverBackContent가 rightSlot이다', () => {
      const result = buildCoverContent('opening-back', leftSlot, rightSlot);
      expect(result.coverBackContent).toBe(rightSlot);
    });
  });

  describe('default (null 반환) 케이스', () => {
    it('"open" 상태이면 coverFrontContent가 null이다', () => {
      const result = buildCoverContent('open', leftSlot, rightSlot);
      expect(result.coverFrontContent).toBeNull();
    });

    it('"open" 상태이면 coverBackContent가 null이다', () => {
      const result = buildCoverContent('open', leftSlot, rightSlot);
      expect(result.coverBackContent).toBeNull();
    });

    it('"cover-front" 상태이면 coverFrontContent가 null이다', () => {
      const result = buildCoverContent('cover-front', leftSlot, rightSlot);
      expect(result.coverFrontContent).toBeNull();
    });

    it('"cover-front" 상태이면 coverBackContent가 null이다', () => {
      const result = buildCoverContent('cover-front', leftSlot, rightSlot);
      expect(result.coverBackContent).toBeNull();
    });

    it('"cover-back" 상태이면 coverFrontContent가 null이다', () => {
      const result = buildCoverContent('cover-back', leftSlot, rightSlot);
      expect(result.coverFrontContent).toBeNull();
    });

    it('"cover-back" 상태이면 coverBackContent가 null이다', () => {
      const result = buildCoverContent('cover-back', leftSlot, rightSlot);
      expect(result.coverBackContent).toBeNull();
    });
  });
});
