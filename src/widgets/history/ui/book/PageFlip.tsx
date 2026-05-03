import type { ReactNode } from 'react';

import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';
import { motion } from 'framer-motion';

import '../../styles/book/PageFlip.css';
import { BookPageOuterShadow } from './BookPageOuterShadow';

export function PageFlip({
  isFlipping,
  flipDirection,
  flipDuration,
  flipFrontContent,
  flipBackContent,
  isRapidFlipping,
  isHoldChaining,
}: {
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward';
  flipDuration: number;
  flipFrontContent: ReactNode;
  flipBackContent: ReactNode;
  isRapidFlipping: boolean;
  isHoldChaining: boolean;
}) {
  const breakpoint = useBreakpoint();
  const isVertical = breakpoint !== 'desktop';
  const shouldApplyRapidClass = isRapidFlipping || isHoldChaining;

  const rotateX =
    isFlipping && isVertical ? (flipDirection === 'forward' ? 180 : -180) : 0;
  const rotateY =
    isFlipping && !isVertical ? (flipDirection === 'forward' ? -180 : 180) : 0;

  const transformOrigin = isVertical
    ? flipDirection === 'forward'
      ? 'top'
      : 'bottom'
    : flipDirection === 'forward'
      ? 'left center'
      : 'right center';

  return (
    <motion.div
      key={String(isFlipping)}
      className={`history__book-page-flip-panel history__book-page-flip-panel--${flipDirection}${!isFlipping ? ' history__book-page-flip-panel--hidden' : ''}${shouldApplyRapidClass ? ' history__book-page--rapid' : ''}`}
      style={{ transformOrigin, transformStyle: 'preserve-3d' }}
      initial={{ rotateX: 0, rotateY: 0 }}
      animate={{ rotateX, rotateY }}
      transition={
        isFlipping
          ? { type: 'tween', duration: flipDuration / 1000, ease: 'easeInOut' }
          : { duration: 0 }
      }
    >
      <div
        className={`history__book-page-flip-front ${flipDirection === 'forward' ? 'history__book-page-right' : 'history__book-page-left'}`}
      >
        {flipDirection !== 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
        <div className='history__book-page-content'>{flipFrontContent}</div>
        {flipDirection === 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
      </div>
      <div
        className={`history__book-page-flip-back ${flipDirection === 'forward' ? 'history__book-page-left' : 'history__book-page-right'}`}
      >
        {flipDirection === 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
        <div className='history__book-page-content'>{flipBackContent}</div>
        {flipDirection !== 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
      </div>
    </motion.div>
  );
}
