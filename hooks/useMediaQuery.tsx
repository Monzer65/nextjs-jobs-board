import { useEffect, useState } from "react";

function useMediaQuery(breakpoint: number) {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const query = `(min-width: ${breakpoint}px)`;
    const mediaQuery = window.matchMedia(query);

    // Initial check
    setIsMatch(mediaQuery.matches);

    // Listener for changes
    const handleChange = () => setIsMatch(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup on unmount
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMatch;
}

export default useMediaQuery;
