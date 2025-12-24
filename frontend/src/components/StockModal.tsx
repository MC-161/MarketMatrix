import React from 'react';
import { X, Activity, BarChart2, DollarSign, TrendingUp, Info, AlertTriangle } from 'lucide-react';
import { Stock } from '../types';
import TrendChart from './TrendChart';

interface StockModalProps {
  stock: Stock;
  onClose: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ stock, onClose }) => {
  const isBullish = stock.status === 'BULLISH';
  const strategyReturn = parseFloat(stock.strategy_return);
  const rsi = parseFloat(stock.rsi);
  const currentPrice = parseFloat(stock.current_price);
  const sma50 = parseFloat(stock.sma_50);
  const sma200 = parseFloat(stock.sma_200);

  // RSI Color Logic
  let rsiColor = 'text-yellow-400';
  let rsiBgColor = 'bg-yellow-400';
  if (rsi > 70) {
      rsiColor = 'text-rose-400'; // Overbought
      rsiBgColor = 'bg-rose-400';
  }
  if (rsi < 30) {
      rsiColor = 'text-emerald-400'; // Oversold
      rsiBgColor = 'bg-emerald-400';
  }

  // Gauge Calculation
  const values = [currentPrice, sma50, sma200];
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1; // prevent divide by zero
  
  const getPosition = (val: number) => {
    // Add 10% padding to sides
    return 10 + ((val - minVal) / range) * 80; 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-serif font-semibold text-white flex items-center gap-3">
                    {stock.ticker}
                    <div className="relative group">
                        <span className={`px-2 py-1 rounded text-xs font-bold border cursor-help flex items-center gap-1 ${isBullish ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-rose-900/30 text-rose-400 border-rose-500/30'}`}>
                            {stock.status} <Info size={12} />
                        </span>
                        {/* Educational Tooltip */}
                        <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
                            A <strong>Golden Cross</strong> occurs when the 50-day Simple Moving Average rises above the 200-day Simple Moving Average, indicating a potential long-term uptrend.
                        </div>
                    </div>
                </h2>
                <p className="text-gray-400 text-sm mt-1">{stock.sector}</p>
            </div>
            <div className="text-right pr-12">
                <div className="text-3xl font-mono text-white">£{stock.current_price}</div>
                <div className={`text-sm font-bold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {parseFloat(stock.daily_change) > 0 ? '+' : ''}{stock.daily_change}%
                </div>
            </div>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Strategy Highlight Section */}
            <div className={`rounded-xl p-6 border relative group cursor-help ${strategyReturn >= 0 ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-rose-950/20 border-rose-500/20'}`}>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <p className="text-xs text-gray-300 leading-relaxed">
                        <strong>Strategy Return</strong> shows the percentage profit or loss generated since the trend signal was first identified {stock.signal_date}.
                    </p>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-700"></div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className={strategyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
                    <span className="text-sm font-serif font-semibold text-gray-300 uppercase tracking-wider">Strategy Performance</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className={`text-4xl font-bold font-mono ${strategyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {strategyReturn > 0 ? '+' : ''}{stock.strategy_return}%
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Trend started <span className="text-gray-300 font-medium">{stock.signal_date}</span>
                        </p>
                    </div>
                    {stock.signal !== 'NONE' && (
                        <div className="text-right">
                             <div className="text-xs text-gray-500 uppercase">Active Signal</div>
                             <div className={`text-lg font-bold ${stock.signal === 'GOLDEN_CROSS' ? 'text-yellow-400' : 'text-purple-400'}`}>
                                {stock.signal.replace('_', ' ')}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Technical Analysis & SMA Visualizer */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800">
                <h3 className="text-sm font-serif font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-blue-400" />
                    Technical Analysis
                </h3>
                
                {stock.signal === 'GOLDEN_CROSS' && (
                    <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-yellow-200 text-sm font-bold">BUY SIGNAL DETECTED</p>
                            <p className="text-yellow-400/80 text-xs mt-1">
                                The short-term trend (SMA 50) just crossed above the long-term trend (SMA 200).
                            </p>
                        </div>
                    </div>
                )}

                <div className="mb-2 text-xs text-gray-400 flex justify-between">
                     <span>Bearish Zone</span>
                     <span>Bullish Zone</span>
                </div>
                
                {/* Visualization Gauge */}
                <div className="relative h-12 w-full bg-gray-900 rounded-full border border-gray-700 mb-2">
                    {/* Track Line */}
                    <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-700 -translate-y-1/2"></div>
                    
                    {/* SMA 200 Marker (Anchor) */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center group/sma200" style={{ left: `${getPosition(sma200)}%` }}>
                        <div className="w-3 h-3 bg-slate-500 rounded-full ring-4 ring-gray-900 z-10"></div>
                        <div className="absolute top-5 text-[10px] font-mono text-slate-400 whitespace-nowrap">SMA 200</div>
                    </div>

                    {/* SMA 50 Marker */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-20" style={{ left: `${getPosition(sma50)}%` }}>
                        <div className={`w-3 h-3 rounded-full ring-4 ring-gray-900 ${isBullish ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <div className={`absolute -top-6 text-[10px] font-mono font-bold whitespace-nowrap ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>SMA 50</div>
                    </div>

                    {/* Current Price Marker */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-30" style={{ left: `${getPosition(currentPrice)}%` }}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-lg shadow-white/20 ring-4 ring-gray-900"></div>
                        <div className="absolute top-6 text-[10px] font-bold text-white whitespace-nowrap">Price</div>
                    </div>
                </div>

                <div className="mt-6 text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                    {isBullish ? (
                        <p>The <span className="text-emerald-400 font-bold">50-day average (£{sma50})</span> is ABOVE the <span className="text-slate-400 font-bold">200-day average (£{sma200})</span>, indicating a confirmed long-term uptrend.</p>
                    ) : (
                        <p>The <span className="text-rose-400 font-bold">50-day average (£{sma50})</span> is BELOW the <span className="text-slate-400 font-bold">200-day average (£{sma200})</span>, indicating a bearish downtrend.</p>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-850/50 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-2">30 Day Price History</h3>
                <TrendChart stock={stock} />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-800 relative group cursor-help">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                        <p className="text-xs text-gray-300 mb-2 leading-relaxed">
                            The <strong>Relative Strength Index (RSI)</strong> measures the speed and magnitude of recent price changes.
                        </p>
                        <div className="space-y-1 text-[10px] font-mono">
                            <div className="flex justify-between items-center text-rose-400 bg-rose-950/30 px-2 py-1 rounded">
                                <span>Overbought</span>
                                <span>&gt; 70</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded">
                                <span>Oversold</span>
                                <span>&lt; 30</span>
                            </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-700"></div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-2">
                        <Activity size={14} /> RSI (14)
                    </div>
                    
                    <div className="flex justify-between items-end mb-2">
                        <div className={`text-2xl font-mono leading-none ${rsiColor}`}>
                            {stock.rsi}
                        </div>
                         <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            rsi > 70 ? 'bg-rose-900/40 text-rose-400' : 
                            rsi < 30 ? 'bg-emerald-900/40 text-emerald-400' : 
                            'bg-gray-700/40 text-gray-400'
                        }`}>
                            {rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
                        </div>
                    </div>

                    {/* RSI Visual Bar */}
                    <div className="relative h-2 w-full bg-gray-950 rounded-full overflow-hidden">
                        {/* Zones */}
                        <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-emerald-500/20 border-r border-gray-800"></div> {/* Oversold 0-30 */}
                        <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-rose-500/20 border-l border-gray-800"></div>   {/* Overbought 70-100 */}
                        
                        {/* Position Marker */}
                         <div 
                            className={`absolute top-0 bottom-0 w-1.5 -ml-0.5 rounded-full shadow-[0_0_5px_currentColor] ${rsiBgColor}`}
                            style={{ left: `${Math.min(Math.max(rsi, 0), 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-600 font-mono mt-1 px-0.5">
                        <span>0</span>
                        <span>30</span>
                        <span>70</span>
                        <span>100</span>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                        <BarChart2 size={14} /> Volume
                    </div>
                    <div className="text-2xl font-mono text-white">
                        {(parseInt(stock.volume) / 1000000).toFixed(1)}M
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                        <DollarSign size={14} /> Mkt Cap
                    </div>
                    <div className="text-2xl font-mono text-white">
                        £{stock.market_cap}B
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default StockModal;