import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchHistory, MarketSnapshot } from '../services/marketData';

export const useMarketData = () => {
  const [history, setHistory] = useState<MarketSnapshot[]>([]);
  const [timeIndex, setTimeIndex] = useState(0); // 0 = Oldest, Length-1 = Newest (Live)
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef<number | null>(null);

  // Load History Logic
  useEffect(() => {
    const loadData = async () => {
      try {
        const snapshots = await fetchHistory();
        setHistory(snapshots);
        setTimeIndex(snapshots.length - 1); // Start at "Live"
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Playback Logic
  useEffect(() => {
    if (isPlaying) {
      playbackRef.current = window.setInterval(() => {
        setTimeIndex(prev => {
          if (prev >= history.length - 1) {
            setIsPlaying(false); // Stop at end
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // Change every 1.5 seconds
    } else {
      if (playbackRef.current) clearInterval(playbackRef.current);
    }
    return () => { if (playbackRef.current) clearInterval(playbackRef.current); };
  }, [isPlaying, history.length]);

  // Derive Current Stocks from Time Slider
  const stocks = useMemo(() => {
    if (history.length === 0) return [];
    return history[timeIndex]?.data || [];
  }, [history, timeIndex]);

  const currentSnapshotLabel = history[timeIndex]?.label || 'Loading...';
  const isTimeTraveling = history.length > 0 && timeIndex < history.length - 1;

  return {
    history,
    stocks,
    loading,
    timeIndex,
    setTimeIndex,
    isPlaying,
    setIsPlaying,
    currentSnapshotLabel,
    isTimeTraveling
  };
};