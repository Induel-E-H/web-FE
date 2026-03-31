import { SectionLayout } from './SectionLayout';

interface VisionItemProps {
  title: string;
  description: string;
  keyword: string;
  image: string;
  reverse?: boolean;
}

export function VisionItem({
  title,
  description,
  keyword,
  image,
  reverse = false,
}: VisionItemProps) {
  return (
    <SectionLayout
      reverse={reverse}
      content={
        <div className='vision__content'>
          <img src={image} alt={title} />
          <div className='vision__context'>
            <h2 className='vision__title'>{title}</h2>
            <span className='vision__description'>{description}</span>
          </div>
        </div>
      }
      keyword={<h1 className='vision__keyword'>{keyword}</h1>}
    />
  );
}
