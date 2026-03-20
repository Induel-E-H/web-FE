interface SectionLayoutProps {
  reverse?: boolean;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SectionLayout({
  reverse = false,
  left,
  right,
}: SectionLayoutProps) {
  return (
    <section className={`section ${reverse ? 'section--reverse' : ''}`}>
      <div className='section__left'>{left}</div>
      <div className='section__right'>{right}</div>
    </section>
  );
}
