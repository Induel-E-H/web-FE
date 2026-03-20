import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineZoomOutMap } from 'react-icons/md';

import { artworks } from '@entities/history';

import {
  getAllContentImages,
  getArtworkIndex,
  getContentImage,
  preloadContentImages,
} from '../model/helpers';
import type { PageSide } from '../model/types';
import '../styles/Content.css';

interface ContentPageProps {
  side: PageSide;
  pageIndex: number;
}

type SubTitleProp = string | string[] | undefined;
type ContentProp = string | string[];

function SubTitleContent({
  subTitle,
  content,
}: {
  subTitle: SubTitleProp;
  content: ContentProp;
}) {
  if (Array.isArray(subTitle)) {
    return subTitle.map((sub, i) => (
      <div key={sub} className='content__text-group'>
        <h4 className='content__subtitle'>{sub}</h4>
        {Array.isArray(content) && content[i] && (
          <p className='content__body'>{content[i]}</p>
        )}
      </div>
    ));
  }

  return (
    <div className='content__text-group'>
      {subTitle && <h4 className='content__subtitle'>{subTitle}</h4>}
      {typeof content === 'string' && content && (
        <p className='content__body'>{content}</p>
      )}
    </div>
  );
}

function ImageGalleryPopup({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval>>(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  function startHold(fn: () => void) {
    fn();
    holdTimerRef.current = setInterval(fn, 400);
  }

  function stopHold() {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', stopHold);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', stopHold);
      stopHold();
    };
  }, [handlePrev, handleNext]);

  return (
    <div
      className='gallery-overlay'
      onMouseDown={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='gallery-popup'>
        <div className='gallery-popup__header'>
          <h3 className='gallery-popup__title'>{title}</h3>
          <button
            className='gallery-popup__close'
            onClick={onClose}
            aria-label='닫기'
          >
            <IoMdClose size='1.6vmax' />
          </button>
        </div>
        <hr />
        <div className='gallery-popup__viewer'>
          <div className='gallery-popup__image-frame'>
            <div
              className='gallery-popup__track'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((src, i) => (
                <div key={i} className='gallery-popup__slide'>
                  <img src={src} alt={`${title} - ${i + 1}`} />
                </div>
              ))}
            </div>
            <div className='gallery-popup__indicator'>
              {currentIndex + 1} / {images.length}
            </div>
            <button
              className='gallery-popup__nav gallery-popup__nav--prev'
              onMouseDown={() => startHold(handlePrev)}
              aria-label='이전 이미지'
            >
              <IoIosArrowBack size='1.25vmax' />
            </button>
            <button
              className='gallery-popup__nav gallery-popup__nav--next'
              onMouseDown={() => startHold(handleNext)}
              aria-label='다음 이미지'
            >
              <IoIosArrowForward size='1.25vmax' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentItem({
  item,
  index,
}: {
  item: (typeof artworks)[0];
  index: number;
}) {
  const [showGallery, setShowGallery] = useState(false);
  const imageSrc = getContentImage(index);

  function handleImageClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setShowGallery(true);
  }

  return (
    <article className='content__item'>
      <div className='content__text'>
        <h3 className='content__title-eng'>{item.titleEng}</h3>
        <h3 className='content__title-kor'>{item.title}</h3>
        <SubTitleContent
          subTitle={item.subTitle as SubTitleProp}
          content={item.content as ContentProp}
        />
        <dl className='content__caption'>
          <div className='content__caption-col'>
            {item.time && (
              <div className='content__caption-row'>
                <dt>사업 기간</dt>
                <dd>{item.time}</dd>
              </div>
            )}
            {item.area.length > 0 && (
              <div className='content__caption-row'>
                <dt>사업 면적</dt>
                <dd>{item.area.join('\n')}</dd>
              </div>
            )}
          </div>
          <div className='content__caption-col'>
            {item.description && (
              <div className='content__caption-row'>
                <dt className='sr-only'>설명</dt>
                <dd>{item.description}</dd>
              </div>
            )}
            {item.address && (
              <div className='content__caption-row'>
                <dt className='sr-only'>주소</dt>
                <dd>{item.address}</dd>
              </div>
            )}
          </div>
        </dl>
      </div>
      <figure
        className={`content__image${imageSrc ? ' content__image--has-image' : ''}`}
        onMouseDown={(e) => imageSrc && e.stopPropagation()}
        onClick={imageSrc ? handleImageClick : undefined}
      >
        {imageSrc && (
          <>
            <img src={imageSrc} alt={item.title} />
            <div className='content__image-zoom'>
              <MdOutlineZoomOutMap size='1.25vmax' color='white' />
            </div>
          </>
        )}
      </figure>
      {showGallery &&
        createPortal(
          <ImageGalleryPopup
            title={item.title}
            images={getAllContentImages(index)}
            onClose={() => setShowGallery(false)}
          />,
          document.body,
        )}
    </article>
  );
}

export function ContentPage({ side, pageIndex }: ContentPageProps) {
  const itemIndex = getArtworkIndex(pageIndex, side);
  const item = artworks[itemIndex] ?? null;

  useEffect(() => {
    preloadContentImages(pageIndex);
  }, [pageIndex]);

  return item ? (
    <ContentItem item={item} index={itemIndex} />
  ) : (
    <div className='content__empty' />
  );
}
