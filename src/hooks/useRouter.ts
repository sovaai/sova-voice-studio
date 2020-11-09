import { useMemo } from 'react';
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router';
import queryString from 'query-string';

export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match: RandomObject = useRouteMatch();

  return useMemo(() => {
    return {
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,

      query: {
        ...queryString.parse(location.search),
        ...params,
      },
      match,
      location,
      history,
    };
  }, [params, match, location, history]);
};
