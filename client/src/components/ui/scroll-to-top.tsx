import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop component - scrolls to the top of the page when the route changes
 * This helps ensure all new page views start from the top of the content
 */
const ScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default ScrollToTop;