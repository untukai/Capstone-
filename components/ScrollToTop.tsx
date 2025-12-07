import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Destructure pathname and search to detect changes in either
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top on route change or search param change with a smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname, search]); // Add search to the dependency array

  return null;
};

export default ScrollToTop;
