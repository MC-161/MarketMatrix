import React from 'react';
import { Search, Filter, LayoutGrid, LayoutDashboard, History, Grid2x2, TrendingUp, TrendingDown } from 'lucide-react';
import { FilterStatus } from '../types';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  sectors: string[];
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
  viewMode: 'GRID' | 'TREEMAP';
  setViewMode: (mode: 'GRID' | 'TREEMAP') => void;
  isTimeTraveling: boolean;
  sentimentStats: { bullish: number; bearish: number; percent: number; };
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm, setSearchTerm,
  selectedSector, setSelectedSector, sectors,
  statusFilter, setStatusFilter,
  viewMode, setViewMode,
  isTimeTraveling,
  sentimentStats,
  loading
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Title & Logo */}
              <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                      <Grid2x2 size={24} className="text-white" />
                  </div>
                  <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                          Market Matrix
                      </h1>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">Algorithmic Trend Intelligence</p>
                  </div>
                  {isTimeTraveling && (
                      <div className="hidden sm:flex px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full items-center gap-2 animate-pulse ml-4">
                          <History size={14} className="text-amber-500" />
                          <span className="text-xs font-bold text-amber-500 uppercase">Viewing Past Data</span>
                      </div>
                  )}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              
              {/* Search */}
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                  type="text"
                  placeholder="Search Ticker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full sm:w-48 transition-all font-medium"
                  />
              </div>

              {/* Sector Dropdown */}
              <div className="relative">
                  <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="appearance-none bg-slate-800 text-white pl-4 pr-10 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 w-full sm:w-40 cursor-pointer font-medium"
                  >
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <Filter size={16} />
                  </div>
              </div>

              {/* Status Toggles */}
              <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                  {(['ALL', 'BULLISH', 'BEARISH'] as FilterStatus[]).map((status) => (
                  <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      statusFilter === status
                          ? status === 'BULLISH' ? 'bg-emerald-600 text-white shadow-lg'
                          : status === 'BEARISH' ? 'bg-rose-600 text-white shadow-lg'
                          : 'bg-slate-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                  >
                      {status}
                  </button>
                  ))}
              </div>

               {/* View Toggle */}
               <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 ml-0 sm:ml-2">
                  <button
                      onClick={() => setViewMode('GRID')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Grid View"
                  >
                      <LayoutGrid size={18} />
                  </button>
                  <button
                      onClick={() => setViewMode('TREEMAP')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'TREEMAP' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Treemap View (Market Cap)"
                  >
                      <LayoutDashboard size={18} />
                  </button>
               </div>

              </div>
          </div>

          {/* Market Sentiment Gauge */}
          {!loading && (
              <div className="w-full bg-slate-800/50 rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border border-slate-800 transition-all duration-500">
                  <div className="text-xs font-bold text-slate-300 whitespace-nowrap flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                      <span>Market Health:</span>
                      <div className="flex gap-2">
                           <span className="text-emerald-400">{sentimentStats.percent}% Bull</span>
                           <span className="text-slate-600">|</span>
                           <span className="text-rose-400">{100 - sentimentStats.percent}% Bear</span>
                      </div>
                  </div>
                  <div className="flex-1 w-full h-3 bg-slate-900 rounded-full overflow-hidden flex relative">
                       {/* Bullish Bar */}
                       <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10"
                          style={{ width: `${sentimentStats.percent}%` }}
                       ></div>
                       {/* Bearish Bar */}
                       <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-1000 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                          style={{ width: `${100 - sentimentStats.percent}%` }}
                       ></div>
                  </div>
                  <div className="flex gap-4 text-[10px] font-mono text-slate-400 w-full sm:w-auto justify-end">
                      <span className="flex items-center gap-1" title="Bullish Count"><TrendingUp size={12} className="text-emerald-400" /> {sentimentStats.bullish}</span>
                      <span className="flex items-center gap-1" title="Bearish Count"><TrendingDown size={12} className="text-rose-400" /> {sentimentStats.bearish}</span>
                  </div>
              </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;