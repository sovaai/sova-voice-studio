import React, { memo, useMemo } from 'react';
import { ReactComponent as Logo } from '../../assets/images/logo-text.svg';
import { ReactComponent as MenuBtn } from '../../assets/images/menu-btn.svg';
import { useRouter } from '../../hooks/useRouter';
const Navigation = memo(() => {
  const { push, location } = useRouter();

  const dashboard = useMemo(() => location.pathname === '/', [location.pathname]);
  const headerText = location.pathname.split('/').filter(Boolean).join();

  return (
    <>
      <header className={`navigation navigation__dashboard-${dashboard} flex justify-between`}>
        <a
          className={`logo logo__dashboard-${dashboard}`}
          target="_blank"
          rel="noreferrer"
          href="https://sova.ai"
        >
          <Logo />
        </a>
      </header>
      {!dashboard && (
        <nav className="page-navigation flex items-start justify-center w-full p-8">
          <div onClick={() => push('/')} className="menu absolute cursor-pointer">
            <MenuBtn />
          </div>
          <h1 className="text-4xl text-white uppercase">{headerText}</h1>
        </nav>
      )}
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
