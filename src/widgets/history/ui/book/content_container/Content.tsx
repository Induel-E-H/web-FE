import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdOutlineImage, MdOutlineZoomOutMap } from 'react-icons/md';

import {
  artworks,
  getAllContentImages,
  getThumbnailImage,
} from '@entities/history';
import {
  getArtworkIndex,
  preloadContentImages,
} from '@features/history/model/helpers';
import type { PageSide } from '@features/history/model/types';

import '../../../styles/book/content_container/Content.css';
import { ImageGalleryPopup } from '../../ImageGalleryPopup';

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

function ContentItem({
  item,
  index,
}: {
  item: (typeof artworks)[0];
  index: number;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [showImageInline, setShowImageInline] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageSrc = getThumbnailImage(index);

  useLayoutEffect(() => {
    if (!imageSrc) return;

    const article = articleRef.current;
    const text = textRef.current;
    if (!article || !text) return;

    function measure() {
      const articleHeight = article!.clientHeight;
      const textHeight = text!.clientHeight;
      const gap = parseFloat(getComputedStyle(article!).gap) || 0;
      const available = articleHeight - textHeight - gap;
      setShowImageInline(available >= articleHeight * 0.3);
    }

    const ro = new ResizeObserver(measure);
    ro.observe(article);
    ro.observe(text);
    measure();

    return () => ro.disconnect();
  }, [imageSrc]);

  async function handleImageClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const images = await getAllContentImages(index);
    setContentImages(images);
    setShowPopup(true);
  }

  function handlePopupClose() {
    setShowPopup(false);
    setContentImages([]);
  }

  const iconMode = Boolean(imageSrc && !showImageInline);

  return (
    <article
      className={`content__item${iconMode ? ' content__item--icon-mode' : ''}`}
      ref={articleRef}
    >
      {iconMode && (
        <button
          className='content__image-icon'
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleImageClick}
          aria-label='이미지 보기'
        >
          <MdOutlineImage aria-hidden='true' />
        </button>
      )}
      <div className='content__text' ref={textRef}>
        <div className='content__title'>
          <h3 className='content__title-kor'>{item.title}</h3>
          <h3 className='content__title-eng'>{item.titleEng}</h3>
        </div>
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
      {showImageInline && (
        <figure
          className={`content__image${imageSrc ? ' content__image--has-image' : ''}`}
          onMouseDown={(e) => imageSrc && e.stopPropagation()}
          onClick={imageSrc ? handleImageClick : undefined}
        >
          {imageSrc && (
            <>
              <img src={imageSrc} alt={item.title} loading='lazy' />
              <div className='content__image-zoom' aria-hidden='true'>
                <MdOutlineZoomOutMap />
              </div>
            </>
          )}
        </figure>
      )}
      {showPopup &&
        createPortal(
          <ImageGalleryPopup
            title={item.title}
            images={contentImages}
            onClose={handlePopupClose}
          />,
          document.body,
        )}
    </article>
  );
}

export function ContentPage({ side, pageIndex }: ContentPageProps) {
  const itemIndex = getArtworkIndex(pageIndex, side);
  const item = artworks[itemIndex] ?? null;

  useLayoutEffect(() => {
    preloadContentImages(pageIndex);
  }, [pageIndex]);

  return item ? (
    <ContentItem item={item} index={itemIndex} />
  ) : (
    <div className='content__empty' />
  );
}
