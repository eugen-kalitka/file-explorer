import {useState} from 'react';

const usePathQueryParam = () => {
  const searchParams = new URLSearchParams(document.location.search);
  const [path, setPath] = useState(searchParams.get('path') || '/');

  const updateUrl = (path) => {
    if (searchParams.get('path')) {
      searchParams.set('path', path);
    } else {
      searchParams.append('path', path);
    }
    setPath(path);
    window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
  };

  return {
    updateUrl,
    path
  };
};

export default usePathQueryParam;
