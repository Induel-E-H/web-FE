import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useLocation, useNavigate } from 'react-router-dom';

import { induelIcon } from '@shared/assets';
import { COMPANY } from '@shared/constant';
import { smoothScrollTo } from '@shared/lib/scroll';
import { AnimatePresence, motion } from 'framer-motion';

import { NAV_ITEMS } from '../model/navItems';
import { useHeaderVisibility } from '../model/useHeaderVisibility';
import { useIsHero } from '../model/useIsHero';
import '../styles/Header.css';

const HERO_SELECTOR = '.hero';

interface HeaderProps {
  onNavClick?: (selector: string) => void;
}

export function Header({ onNavClick }: HeaderProps = {}) {
  const isHero = useIsHero();
  const { hidden, onNavScrollStart, onNavScrollEnd } = useHeaderVisibility();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  function scrollTo(selector: string) {
    if (onNavClick) {
      onNavClick(selector);
      return;
    }
    if (!isHome) {
      void navigate('/', { state: { scrollTo: selector } });
      return;
    }
    onNavScrollStart();
    smoothScrollTo(selector, () => {
      setMenuOpen(false);
      onNavScrollEnd();
    });
  }

  function handleLogoClick() {
    if (!isHome) {
      void navigate('/');
      return;
    }
    scrollTo(HERO_SELECTOR);
  }

  const navItems = NAV_ITEMS.map(({ label, selector }) => (
    <button key={label} onClick={() => scrollTo(selector)}>
      {label}
    </button>
  ));

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
            alt={`${COMPANY.NAME_KO} 로고`}
            className='header__logo_icon'
          />
        </div>
        <span>{COMPANY.NAME_KO}</span>
      </button>

      <nav className='header__nav' aria-label='데스크탑 메뉴'>
        {navItems}
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

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id='mobile-menu'
            className='header__mobile-menu'
            aria-label='모바일 메뉴'
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {navItems}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
