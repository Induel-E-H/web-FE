import type { ReactNode } from 'react';

interface SectionLayoutProps {
  reverse?: boolean;
  content: ReactNode;
  keyword: ReactNode;
}

export function SectionLayout({
  reverse = false,
  content,
  keyword,
}: SectionLayoutProps) {
  return (
    <section className={`section ${reverse ? 'section--reverse' : ''}`}>
      <div className='vision__content-group fade-section'>{content}</div>
      <div className='vision__keyword-group fade-section'>{keyword}</div>
    </section>
  );
}
