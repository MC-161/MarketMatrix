import React, { useMemo } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { MarketSnapshot } from '../services/marketData';

interface TimeTravelFooterProps {
  history: MarketSnapshot[];
  timeIndex: number;
  setTimeIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentSnapshotLabel: string;
  isTimeTraveling: boolean;
}

const TimeTravelFooter: React.FC<TimeTravelFooterProps> = ({
  history,
  timeIndex,
  setTimeIndex,
  isPlaying,
  setIsPlaying,
  currentSnapshotLabel,
  isTimeTraveling
}) => {
  // Filter to only show snapshots from the last 24 hours
  const filteredHistory = useMemo(() => {
    if (history.length === 0) return [];
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    return history.filter(snapshot => snapshot.timestamp >= twentyFourHoursAgo);
  }, [history]);

  // Map timeIndex to filtered history index
  const filteredTimeIndex = useMemo(() => {
    if (filteredHistory.length === 0) return 0;
    const currentSnapshot = history[timeIndex];
    if (!currentSnapshot) return filteredHistory.length - 1;
    const indexInFiltered = filteredHistory.findIndex(s => s.timestamp === currentSnapshot.timestamp);
    return indexInFiltered >= 0 ? indexInFiltered : filteredHistory.length - 1;
  }, [history, timeIndex, filteredHistory]);

  // Map filtered index back to original history index for setTimeIndex
  const handleTimeIndexChange = (filteredIdx: number) => {
    if (filteredHistory.length === 0) return;
    const snapshot = filteredHistory[filteredIdx];
    const originalIdx = history.findIndex(s => s.timestamp === snapshot.timestamp);
    if (originalIdx >= 0) {
      setIsPlaying(false);
      setTimeIndex(originalIdx);
    }
  };

  const displayHistory = filteredHistory.length > 0 ? filteredHistory : history;
  const displayIndex = filteredHistory.length > 0 ? filteredTimeIndex : timeIndex;
  const maxIndex = displayHistory.length > 0 ? displayHistory.length - 1 : 0;

  return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-40 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
              
              {/* Controls */}
              <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-3 rounded-full transition-all ${isPlaying ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
                  >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <button 
                     onClick={() => { setIsPlaying(false); setTimeIndex(history.length - 1); }}
                     className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"
                     title="Reset to Live"
                  >
                      <RotateCcw size={18} />
                  </button>
              </div>

              {/* Slider Container */}
              <div className="flex-1 w-full relative">
                   <div className="flex justify-between text-caption-sm uppercase font-bold text-slate-500 mb-2">
                       <span>24 Hours Ago</span>
                       <span className={isTimeTraveling ? 'text-slate-500' : 'text-emerald-500'}>Live Market</span>
                   </div>
                   
                   <div className="relative h-2 bg-slate-700 rounded-lg">
                        {/* Progress Fill */}
                        <div 
                            className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-300 ${isTimeTraveling ? 'bg-amber-500/50' : 'bg-emerald-500'}`}
                            style={{ width: maxIndex > 0 ? `${(displayIndex / maxIndex) * 100}%` : '100%' }}
                        ></div>
                        <input 
                            type="range" 
                            min="0" 
                            max={maxIndex} 
                            value={displayIndex}
                            onChange={(e) => handleTimeIndexChange(parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                   </div>
                   
                   {/* Floating Label above Thumb */}
                   <div 
                     className={`absolute -top-10 -translate-x-1/2 text-white text-caption font-bold py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-300 ${isTimeTraveling ? 'bg-amber-600' : 'bg-emerald-600'}`}
                     style={{ left: maxIndex > 0 ? `${(displayIndex / maxIndex) * 100}%` : '100%' }}
                   >
                       {currentSnapshotLabel}
                       <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-4 border-transparent ${isTimeTraveling ? 'border-t-amber-600' : 'border-t-emerald-600'}`}></div>
                   </div>
              </div>

              {/* Current Status Badge */}
              <div className="hidden md:flex flex-col items-end min-w-[120px]">
                  <span className="text-caption-sm text-slate-400 uppercase">Selected Time</span>
                  <span className={`text-sm font-mono font-bold flex items-center gap-2 ${isTimeTraveling ? 'text-amber-400' : 'text-emerald-400'}`}>
                     <Clock size={14} />
                     {currentSnapshotLabel}
                  </span>
              </div>
          </div>
      </div>
  );
};

export default TimeTravelFooter;