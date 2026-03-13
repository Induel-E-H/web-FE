import artworks from '../data/artwork.json';
import type { PageSide } from '../model/types';
import '../style/Content.css';

const contentImages = import.meta.glob('../asset/content/*.webp', {
  eager: true,
  import: 'default',
});

function getContentImage(index: number): string | undefined {
  const src = contentImages[`../asset/content/${index}.webp`];
  return typeof src === 'string' ? src : undefined;
}

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
    <>
      {subTitle && <h4 className='content__subtitle'>{subTitle}</h4>}
      {typeof content === 'string' && content && (
        <p className='content__body'>{content}</p>
      )}
    </>
  );
}

function ContentItem({
  item,
  index,
}: {
  item: (typeof artworks)[0];
  index: number;
}) {
  const imageSrc = getContentImage(index);

  return (
    <div className='content__item'>
      <div className='content__text'>
        <h3 className='content__title-eng'>{item.titleEng}</h3>
        <h3 className='content__title-kor'>{item.title}</h3>
        <SubTitleContent
          subTitle={item.subTitle as SubTitleProp}
          content={item.content as ContentProp}
        />
        <div className='content__caption'>
          <div className='content__caption-col'>
            {item.time && <span>사업 기간 {item.time}</span>}
            {item.area.length > 0 && (
              <span>사업 면적 {item.area.join(' | ')}</span>
            )}
          </div>
          <div className='content__caption-col'>
            {item.description && <span>{item.description}</span>}
            {item.address && <span>{item.address}</span>}
          </div>
        </div>
      </div>
      <div className='content__image'>
        {imageSrc && <img src={imageSrc} alt={item.title} />}
      </div>
    </div>
  );
}

export function ContentPage({ side, pageIndex }: ContentPageProps) {
  const itemIndex = pageIndex * 2 + (side === 'left' ? 0 : 1);
  const item = artworks[itemIndex] ?? null;

  return (
    <>
      {item ? (
        <ContentItem item={item} index={itemIndex} />
      ) : (
        <div className='content__empty' />
      )}
    </>
  );
}
