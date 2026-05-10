import './styles/UnsupportedBrowser.css';

export function UnsupportedBrowser() {
  return (
    <div className='unsupported-browser'>
      <div className='unsupported-browser__content'>
        <svg
          className='unsupported-browser__icon'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='12' y1='8' x2='12' y2='12' />
          <line x1='12' y1='16' x2='12.01' y2='16' />
        </svg>

        <h1 className='unsupported-browser__title'>
          브라우저 업데이트가 필요합니다
        </h1>

        <p className='unsupported-browser__desc'>
          이 사이트는 <strong>Chrome 90</strong> 이상에서 정상적으로 동작합니다.
          <br />
          현재 사용 중인 Chrome 버전은 지원되지 않습니다.
        </p>

        <div className='unsupported-browser__versions'>
          <div className='unsupported-browser__version unsupported-browser__version--full'>
            <span>Chrome 90+</span>
            <span>완전 지원</span>
          </div>
          <div className='unsupported-browser__version unsupported-browser__version--limited'>
            <span>Chrome 80 – 89</span>
            <span>제한 지원</span>
          </div>
          <div className='unsupported-browser__version unsupported-browser__version--none'>
            <span>Chrome 79 이하</span>
            <span>미지원</span>
          </div>
        </div>

        <a
          className='unsupported-browser__cta'
          href='https://www.google.com/chrome/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Chrome 최신 버전 다운로드
        </a>
      </div>
    </div>
  );
}
