/**
 * MARKET DATA HOOK - Centralized State Management
 * 
 * TECHNICAL JUSTIFICATION: React Hooks for Complex State Management
 * ------------------------------------------------------------------
 * This custom hook manages market data state using React patterns:
 * 
 * 1. Single Source of Truth: All market data flows through this hook, eliminating
 *    prop drilling and ensuring data consistency across 100+ stock components.
 * 
 * 2. Time-Travel Playback: The timeIndex state enables historical snapshot navigation,
 *    allowing users to view past market states.
 * 
 * 3. Performance Optimization: useMemo prevents expensive recalculations when filtering
 *    or navigating historical data, avoiding unnecessary re-renders.
 * 
 * 4. Async Data Loading: useEffect handles S3 JSON fetch with proper loading states
 *    and error handling.
 * 
 * 5. Playback Control: Automatic playback with setInterval uses refs for cleanup
 *    and proper state synchronization.
 */

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