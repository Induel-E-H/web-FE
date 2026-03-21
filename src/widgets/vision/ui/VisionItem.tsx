import { SectionLayout } from '../ui/SectionLayout';

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
            <span className='vision__title'>{title}</span>
            <span className='vision__description'>{description}</span>
          </div>
        </div>
      }
      keyword={<p className='vision__keyword'>{keyword}</p>}
    />
  );
}
