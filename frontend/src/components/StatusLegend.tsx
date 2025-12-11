import React from 'react';
import { Grid2x2, Zap, Skull } from 'lucide-react';

const StatusLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 px-4 py-3 bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider mr-2">
            <div className="bg-slate-700/50 p-1 rounded"><Grid2x2 size={12} /></div>
            Legend
        </div>
        
        {/* Bullish */}
        <div className="group relative flex items-center gap-2 text-xs cursor-help">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-slate-300">Bullish Trend</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 border border-emerald-500/30 rounded shadow-xl text-[10px] text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                <strong className="block mb-1 text-emerald-400">Long-term Uptrend</strong>
                Price is healthy. SMA 50 is above SMA 200.
            </div>
        </div>
        
        {/* Bearish */}
        <div className="group relative flex items-center gap-2 text-xs cursor-help">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
            <span className="text-slate-300">Bearish Trend</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 border border-rose-500/30 rounded shadow-xl text-[10px] text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                    <strong className="block mb-1 text-rose-400">Long-term Downtrend</strong>
                    Price is weak. SMA 50 is below SMA 200.
            </div>
        </div>

        <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block"></div>

        {/* Golden Cross */}
        <div className="group relative flex items-center gap-1.5 text-xs bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 cursor-help">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-yellow-100 font-medium">Golden Cross</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 border border-yellow-500/30 rounded shadow-xl text-[10px] text-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                <strong className="block mb-1 text-yellow-400">Strong Buy Signal</strong>
                Short-term trend (50d) just crossed ABOVE long-term trend (200d).
            </div>
        </div>
        
        {/* Death Cross */}
        <div className="group relative flex items-center gap-1.5 text-xs bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 cursor-help">
            <Skull size={12} className="text-purple-400" />
            <span className="text-purple-100 font-medium">Death Cross</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 border border-purple-500/30 rounded shadow-xl text-[10px] text-purple-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                <strong className="block mb-1 text-purple-400">Strong Sell Signal</strong>
                Short-term trend (50d) just crossed BELOW long-term trend (200d).
            </div>
        </div>

        <div className="ml-auto hidden md:flex items-center gap-2 text-[10px] text-slate-500">
            <span>Color Intensity</span>
            <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-slate-800 via-emerald-900 to-emerald-500 opacity-50"></div>
            <span>Daily Change %</span>
        </div>
    </div>
  );
};

export default StatusLegend;