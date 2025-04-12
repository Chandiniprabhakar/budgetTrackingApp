import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent errors in SSR
    const mediaQuery = window.matchMedia(query);

    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    mediaQuery.addEventListener("change", onChange);
    setValue(mediaQuery.matches); 

    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
