import { useCallback, useLayoutEffect } from "react";

export default function useScrollY(fn: (y: number) => void, deps: any[]) {
  const callback = useCallback(fn, deps);

  useLayoutEffect(() => {
    function handle() {
      callback(window.scrollY);
    }

    window.addEventListener("scroll", handle);

    handle();

    return () => window.removeEventListener("scroll", handle);
  }, []);
}
