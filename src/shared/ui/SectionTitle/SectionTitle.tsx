import './SectionTitle.css';

type SectionTitleProps = {
  label: string;
  headings: string | [string, string];
  className?: string;
  ref?: React.RefObject<HTMLElement | null>;
};

export function SectionTitle({
  label,
  headings,
  className,
  ref,
}: SectionTitleProps) {
  const headingArray = Array.isArray(headings) ? headings : [headings];
  const rootClass = ['section-title', className].filter(Boolean).join(' ');

  return (
    <hgroup ref={ref} className={rootClass}>
      <div className='section-title__description'>
        <hr />
        <p>{label}</p>
      </div>
      {headingArray.map((h) => (
        <h2 key={h}>{h}</h2>
      ))}
    </hgroup>
  );
}
