import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollDuration = 100; 
    const startTime = performance.now();
    const startPosition = window.scrollY;

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / scrollDuration, 1); // Clamp between 0 and 1
      const easeInOutQuad = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Smooth easing function

      window.scrollTo(0, startPosition * (1 - easeInOutQuad));

      if (elapsedTime < scrollDuration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
