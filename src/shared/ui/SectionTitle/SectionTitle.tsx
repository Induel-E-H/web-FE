import './SectionTitle.css';

type SectionTitleProps = {
  subTitle: string;
  title: string;
  className?: string;
  ref?: React.Ref<HTMLElement | null>;
};

export function SectionTitle({
  subTitle: label,
  title: heading,
  className,
  ref,
}: SectionTitleProps) {
  const rootClass = ['section-title', className].filter(Boolean).join(' ');

  return (
    <hgroup ref={ref} className={rootClass}>
      <div className='section-title__description'>
        <hr aria-hidden='true' />
        <p>{label}</p>
      </div>
      <h2>{heading}</h2>
    </hgroup>
  );
}
