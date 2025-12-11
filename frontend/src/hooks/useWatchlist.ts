import { useState, useEffect, React } from 'react';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('marketHeatmapWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('marketHeatmapWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (e: React.MouseEvent, ticker: string) => {
    e.stopPropagation();
    setWatchlist(prev => 
      prev.includes(ticker) 
        ? prev.filter(t => t !== ticker) 
        : [...prev, ticker]
    );
  };

  return { watchlist, toggleWatchlist };
};