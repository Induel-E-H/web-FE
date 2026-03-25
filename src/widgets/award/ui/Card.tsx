import '../styles/Card.css';

export function Card({
  name,
  year,
  imageUrl,
}: {
  name: string;
  year: string;
  imageUrl: string;
}) {
  return (
    <div className='award__card'>
      <div className='award__card_image'>
        <img src={imageUrl} alt={name}></img>
      </div>
      <div className='award__card_title'>
        <h4>{name}</h4>
        <p>{year.slice(0, 4)}</p>
      </div>
    </div>
  );
}
