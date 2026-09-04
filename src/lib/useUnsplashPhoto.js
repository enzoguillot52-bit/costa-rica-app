import { useEffect, useState } from "react";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const CACHE_KEY = "cr_photo_cache";

function readCache() {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota / navigation privée — on continue sans cache persistant
  }
}

// Recherche une photo réelle via l'API Unsplash Search, mise en cache localement.
// Sans clé configurée (VITE_UNSPLASH_ACCESS_KEY) ou en cas d'échec réseau,
// le statut retombe sur "unavailable" et l'appelant doit afficher son fallback.
export function useUnsplashPhoto(query) {
  const [state, setState] = useState(() => {
    const cached = readCache()[query];
    return cached ? { status: "loaded", url: cached } : { status: ACCESS_KEY ? "loading" : "unavailable", url: null };
  });

  useEffect(() => {
    if (!ACCESS_KEY || !query) return;
    const cached = readCache()[query];
    if (cached) {
      setState({ status: "loaded", url: cached });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", url: null });
    fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish&client_id=${ACCESS_KEY}`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        const url = data?.results?.[0]?.urls?.small;
        if (url) {
          const cache = readCache();
          cache[query] = url;
          writeCache(cache);
          setState({ status: "loaded", url });
        } else {
          setState({ status: "unavailable", url: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unavailable", url: null });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return state;
}
