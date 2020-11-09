import React, { memo, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouter } from '../../hooks/useRouter';
import { routes } from '../config/routesConfig';
import Navigation from '../navigation/navigation';
import { ReactComponent as RouteButtonSvg } from '../../assets/images/route__btn.svg';

const Main = memo(() => {
  const { location, push } = useRouter();
  const dashboard = useMemo(() => location.pathname === '/', [location.pathname]);
  const asr = useMemo(() => location.pathname === '/asr/', [location.pathname]);

  return (
    <>
      <Navigation />
      <main
        className={`main main__dashboard-${dashboard} flex flex-auto flex-col items-center w-full overflow-hidden text-gray-700`}
      >
        <Switch>
          {routes.map(({ id, path, exact, component }) => (
            <Route key={id} exact={exact} path={path}>
              {component}
            </Route>
          ))}
        </Switch>
        {!dashboard && (
          <button
            onClick={() => push(asr ? '/tts/' : '/asr/')}
            className="route__btn absolute mr-12"
          >
            <RouteButtonSvg />
          </button>
        )}
      </main>
    </>
  );
});

Main.displayName = 'Main';

export default Main;
