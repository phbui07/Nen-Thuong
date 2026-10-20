import { useEffect, useState } from "react";

// True after the first client render. Use it before showing state that only
// exists in the browser (localStorage) so it matches the server-rendered HTML.
export default function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
