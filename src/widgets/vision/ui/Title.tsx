import '../styles/Title.css';

export function VisionTitle({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={ref} className='vision__title'>
      <div className='vision__title__description'>
        <hr />
        <p>FUTURE VISION</p>
      </div>
      <h2>미래를 향한</h2>
      <h2>세 가지 방향</h2>
    </div>
  );
}
