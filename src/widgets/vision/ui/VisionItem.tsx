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
      left={
        <div className='vision__media-group'>
          <img src={image} alt={title} />
          <div className='vision__content'>
            <span className='vision__title'>{title}</span>
            <p className='vision__description'>{description}</p>
          </div>
        </div>
      }
      right={<p className='vision__keyword'>{keyword}</p>}
    />
  );
}
