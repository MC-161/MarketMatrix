import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Zap, Skull, Star } from 'lucide-react';
import { Stock } from '../types';

interface StockCardProps {
  stock: Stock;
  isStarred: boolean;
  onToggleStar: (e: React.MouseEvent, ticker: string) => void;
  onClick: (stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, isStarred, onToggleStar, onClick }) => {
  const isBullish = stock.status === 'BULLISH';
  const dailyChangeNum = parseFloat(stock.daily_change);
  const absChange = Math.abs(dailyChangeNum);
  
  // Sparkline Logic: Convert price history to points for SVG
  const priceHistory = useMemo(() => stock.price_history.map(p => parseFloat(p)), [stock.price_history]);
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  const range = maxPrice - minPrice || 1;
  
  // Generate SVG path for sparkline
  const points = priceHistory.map((price, i) => {
    const x = (i / (priceHistory.length - 1)) * 100;
    // Normalize y to 0-100 (inverted because SVG y=0 is top)
    // Use 80% of height to leave padding
    const y = 100 - ((price - minPrice) / range) * 80 - 10; 
    return `${x},${y}`;
  }).join(' ');

  const sparklinePath = `M ${points}`;
  // Close the path for the fill (bottom-right -> bottom-left)
  const fillPath = `M 0,100 L 0,${100 - ((priceHistory[0] - minPrice) / range) * 80 - 10} ${points.replace('M', 'L')} L 100,100 Z`;

  // Colors
  const accentColor = isBullish ? 'emerald' : 'rose';
  const accentHex = isBullish ? '#10b981' : '#f43f5e';
  
  return (
    <div
      onClick={() => onClick(stock)}
      className={`
        group relative overflow-hidden rounded-2xl 
        bg-gray-900 border border-gray-800 
        hover:border-${accentColor}-500/50 hover:shadow-2xl hover:shadow-${accentColor}-900/10
        transition-all duration-300 ease-out cursor-pointer
        transform hover:-translate-y-1
      `}
    >
        {/* Sparkline Background */}
        <div className="absolute inset-x-0 bottom-0 h-32 opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20 mask-linear">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                    <linearGradient id={`grad-${stock.ticker}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={accentHex} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={accentHex} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={fillPath} fill={`url(#grad-${stock.ticker})`} stroke="none" />
                <path d={sparklinePath} fill="none" stroke={accentHex} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
            
            {/* Top Row: Ticker & Star */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                         <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{stock.ticker}</h3>
                         {/* Signal Badges Pulse Next to Ticker */}
                         {stock.signal === 'GOLDEN_CROSS' && (
                             <div className="relative flex items-center justify-center group/signal">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-40"></span>
                                 <Zap size={18} className="text-yellow-400 fill-yellow-400 relative z-10" />
                             </div>
                         )}
                         {stock.signal === 'DEATH_CROSS' && (
                             <div className="relative flex items-center justify-center group/signal">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-40"></span>
                                 <Skull size={18} className="text-purple-400 fill-purple-400 relative z-10" />
                             </div>
                         )}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mt-1">{stock.sector}</span>
                </div>
                
                <button
                    onClick={(e) => onToggleStar(e, stock.ticker)}
                    className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/5 transition-colors text-gray-600 hover:text-yellow-400"
                >
                    <Star size={20} className={isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
                </button>
            </div>

            {/* Middle Row: Price & Change */}
            <div className="flex items-end gap-3 mb-6">
                 <span className="text-4xl font-mono font-medium text-white tracking-tighter leading-none">
                    £{stock.current_price}
                 </span>
                 <div className={`flex items-center text-sm font-bold mb-1 ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isBullish ? <ArrowUp size={16} strokeWidth={3} /> : <ArrowDown size={16} strokeWidth={3} />}
                    {absChange.toFixed(2)}%
                 </div>
            </div>

            {/* Bottom Row: SMA Context Pill */}
             <div className="w-full bg-gray-950/60 backdrop-blur-md rounded-lg p-2.5 border border-white/5 flex justify-between items-center text-[10px] font-mono shadow-inner">
                 <div className="flex flex-col">
                     <span className="text-gray-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">SMA 50</span>
                     <span className={`font-semibold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>£{stock.sma_50}</span>
                 </div>
                 
                 {/* Visual Trend Connector */}
                 <div className="flex-1 px-4 flex items-center">
                    <div className="h-0.5 w-full bg-gray-800 relative rounded-full overflow-hidden">
                        <div className={`absolute top-0 left-0 h-full w-1/2 ${isBullish ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isBullish ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`}></div>
                    </div>
                 </div>

                 <div className="flex flex-col items-end">
                     <span className="text-gray-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">SMA 200</span>
                     <span className="text-slate-300 font-semibold">£{stock.sma_200}</span>
                 </div>
             </div>
        </div>
        
        {/* Left Border Highlight */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isBullish ? 'bg-emerald-500' : 'bg-rose-500'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  );
};

export default StockCard;