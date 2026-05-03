import type { ReactNode } from 'react';

import { useBreakpoint } from '@shared/lib/breakpoint/useBreakpoint';
import { motion } from 'framer-motion';

import '../../styles/book/CoverFlip.css';

export function BookCoverFlip({
  isFlipping,
  flipDirection,
  flipDuration,
  frontContent,
  backContent,
}: {
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward';
  flipDuration: number;
  frontContent: ReactNode;
  backContent: ReactNode;
}) {
  const breakpoint = useBreakpoint();
  const isVertical = breakpoint !== 'desktop';

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
    <div className='history__book-cover-flip'>
      <motion.div
        key={String(isFlipping)}
        className={`history__book-cover-flip-panel history__book-cover-flip-panel--${flipDirection}${!isFlipping ? ' history__book-cover-flip-panel--hidden' : ''}`}
        style={{ transformOrigin, transformStyle: 'preserve-3d' }}
        initial={{ rotateX: 0, rotateY: 0 }}
        animate={{ rotateX, rotateY }}
        transition={
          isFlipping
            ? {
                type: 'tween',
                duration: flipDuration / 1000,
                ease: 'easeInOut',
              }
            : { duration: 0 }
        }
      >
        <div className='history__book-cover-flip-front'>
          <div className='history__book-cover-flip-front-inner'>
            {frontContent}
          </div>
        </div>
        <div className='history__book-cover-flip-back'>
          <div className='history__book-cover-flip-back-inner'>
            {backContent}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
