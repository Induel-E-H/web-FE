interface VisionItemProps {
  title: string;
  description: string;
  keyword: string;
  image: string;
  index: number;
}

export function VisionItem({
  title,
  description,
  keyword,
  image,
  index,
}: VisionItemProps) {
  const isReverse = index % 2 !== 0;

  return (
    <div
      className={`vision__content${isReverse ? ' vision__content--reverse' : ''}`}
    >
      <div className='vision__content__image'>
        <img src={image} alt={title} />
      </div>
      <div className='vision__content_text'>
        <div className='vision__content__title'>
          <p className='vision__content__index'>VISION {index + 1}</p>
          <div className='vision__content__title__main'>
            <h3>{keyword}</h3>
            <h4>{title}</h4>
          </div>
          <hr />
        </div>
        <p className='vision__content__description'>{description}</p>
      </div>
    </div>
  );
}
