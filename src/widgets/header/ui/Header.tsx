import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

import { smoothScrollTo } from '@shared/lib/scroll/smoothScrollTo';

import induelIcon from '@assets/induel-icon.svg';

import { NAV_ITEMS } from '../model/navItems';
import { useIsHero } from '../model/useIsHero';
import '../styles/Header.css';

export function Header() {
  const isHero = useIsHero();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (selector: string) => {
    smoothScrollTo(selector, () => setMenuOpen(false));
  };

  return (
    <header
      className={`header${isHero ? ' header--hero' : ''}${menuOpen && isHero ? ' header--menu-open' : ''}`}
    >
      <div
        className='header__logo'
        onClick={() => scrollTo('.hero')}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && scrollTo('.hero')}
      >
        <div className='header__logo_icon-frame'>
          <img
            src={induelIcon}
            alt='인들이앤에이치 로고'
            className='header__logo_icon'
          />
        </div>
        <p>인들이앤에이치</p>
      </div>

      <nav className='header__nav'>
        {NAV_ITEMS.map(({ label, selector }) => (
          <button key={label} onClick={() => scrollTo(selector)}>
            {label}
          </button>
        ))}
      </nav>

      <button
        className='header__hamburger'
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label='메뉴 열기'
        aria-expanded={menuOpen}
      >
        <RxHamburgerMenu />
      </button>

      {menuOpen && (
        <div className='header__mobile-menu'>
          {NAV_ITEMS.map(({ label, selector }) => (
            <button key={label} onClick={() => scrollTo(selector)}>
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
