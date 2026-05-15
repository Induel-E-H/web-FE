import { useNavigate } from 'react-router-dom';

import './styles/NotFound.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='not-found'>
      <div className='not-found__content'>
        <p className='not-found__code'>404</p>
        <h1 className='not-found__title'>페이지를 찾을 수 없습니다</h1>
        <p className='not-found__desc'>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <button className='not-found__btn' onClick={() => void navigate('/')}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
