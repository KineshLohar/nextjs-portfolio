'use client';  // Ensure this is a client component

import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Hook to get the current pathname

const ScrollToTop = () => {
  const pathname = usePathname(); // Get the current route path

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll the window to the top
  }, [pathname]);  // Dependency array listens for pathname changes

  return null; // This component does not need to render anything
};

export default ScrollToTop;
