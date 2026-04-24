import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useLocation, useNavigate } from 'react-router-dom';

import { smoothScrollTo } from '@shared/lib/scroll/smoothScrollTo';

import induelIcon from '@assets/induel-icon.svg';

import { NAV_ITEMS } from '../model/navItems';
import { useHeaderVisibility } from '../model/useHeaderVisibility';
import { useIsHero } from '../model/useIsHero';
import '../styles/Header.css';

export function Header() {
  const isHero = useIsHero();
  const { hidden, onNavScrollStart, onNavScrollEnd } = useHeaderVisibility();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const scrollTo = (selector: string) => {
    if (!isHome) {
      void navigate('/', { state: { scrollTo: selector } });
      return;
    }
    onNavScrollStart();
    smoothScrollTo(selector, () => {
      setMenuOpen(false);
      onNavScrollEnd();
    });
  };

  const handleLogoClick = () => {
    if (!isHome) {
      void navigate('/');
      return;
    }
    scrollTo('.hero');
  };

  return (
    <header
      className={[
        'header',
        isHero ? 'header--hero' : '',
        hidden && !menuOpen ? 'header--hidden' : '',
        menuOpen && isHero ? 'header--menu-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button className='header__logo' onClick={handleLogoClick}>
        <div className='header__logo_icon-frame'>
          <img
            src={induelIcon}
            alt='인들이앤에이치 로고'
            className='header__logo_icon'
          />
        </div>
        <span>인들이앤에이치</span>
      </button>

      <nav className='header__nav' aria-label='데스크탑 메뉴'>
        {NAV_ITEMS.map(({ label, selector }) => (
          <button key={label} onClick={() => scrollTo(selector)}>
            {label}
          </button>
        ))}
      </nav>

      <button
        className='header__hamburger'
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={menuOpen}
        aria-controls='mobile-menu'
      >
        <RxHamburgerMenu aria-hidden='true' />
      </button>

      {menuOpen && (
        <nav
          id='mobile-menu'
          className='header__mobile-menu'
          aria-label='모바일 메뉴'
        >
          {NAV_ITEMS.map(({ label, selector }) => (
            <button key={label} onClick={() => scrollTo(selector)}>
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
