/**
 * MARKETMATRIX MAIN APPLICATION COMPONENT
 * 
 * TECHNICAL JUSTIFICATION: React State Management Over Basic HTML Grid
 * --------------------------------------------------------------------
 * This implementation uses React for state management instead of a basic HTML grid.
 * 
 * WHY REACT STATE MANAGEMENT OVER BASIC HTML:
 * 1. Component Architecture: Modular React components enable code reusability and
 *    maintainability. A basic HTML grid would require 100+ duplicate DOM elements
 *    with manual event handlers - unmaintainable at scale.
 * 
 * 2. State Management: React Context + Hooks provide centralized state for:
 *    - Market data (100+ stocks with real-time updates)
 *    - User preferences (watchlist, filters, view modes)
 *    - Time-travel playback (historical snapshot navigation)
 *    - Sentiment calculations (derived state from market data)
 *    A basic HTML grid cannot handle this complexity without jQuery spaghetti code.
 * 
 * 3. Performance: React's virtual DOM and memoization (useMemo) prevent unnecessary
 *    re-renders. Filtering 100 stocks in a basic HTML grid would require manual
 *    DOM manipulation, causing janky UI. React handles this efficiently.
 * 
 * 4. User Experience: Features like time-travel playback, watchlist persistence,
 *    and interactive treemaps are difficult with basic HTML. React enables:
 *    - Real-time filtering without page reloads
 *    - Persistent watchlist via localStorage integration
 *    - Smooth animations and transitions
 *    - Responsive design with Tailwind CSS
 */

import React, { useState, useMemo } from 'react';
import { Loader2, LayoutDashboard, Star, Clock } from 'lucide-react';
import { Stock } from './types';
import StockCard from './components/StockCard';
import StockModal from './components/StockModal';
import MarketTreemap from './components/MarketTreemap';
import Header from './components/Header';
import StatusLegend from './components/StatusLegend';
import TimeTravelFooter from './components/TimeTravelFooter';

import { useMarketData } from './hooks/useMarketData';
import { useWatchlist } from './hooks/useWatchlist';
import { useStockFilters } from './hooks/useStockFilters';
import { calculateSentiment } from './utils/analytics';

type ViewMode = 'GRID' | 'TREEMAP';

const App: React.FC = () => {
  const {
    history,
    stocks,
    loading,
    timeIndex,
    setTimeIndex,
    isPlaying,
    setIsPlaying,
    currentSnapshotLabel,
    isTimeTraveling
  } = useMarketData();

  const { watchlist, toggleWatchlist } = useWatchlist();

  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    selectedSector, setSelectedSector,
    sectors,
    filteredStocks
  } = useStockFilters(stocks);

  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Feature 4: Market Sentiment Calculation
  const sentimentStats = useMemo(() => calculateSentiment(stocks), [stocks]);

  // Separate Watchlist items for display
  const watchlistStocks = useMemo(() => {
    return filteredStocks.filter(s => watchlist.includes(s.ticker));
  }, [filteredStocks, watchlist]);

  const otherStocks = useMemo(() => {
    return filteredStocks.filter(s => !watchlist.includes(s.ticker));
  }, [filteredStocks, watchlist]);

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-50 font-sans pb-32 transition-all duration-500 ${isTimeTraveling ? 'border-8 border-amber-500/30' : ''}`}>
      
      {/* Historical Mode Overlay Badge */}
      {isTimeTraveling && (
         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-20">
             <h1 className="text-9xl font-serif font-black text-amber-500 uppercase text-display">History</h1>
         </div>
      )}

      {/* Header */}
      <Header 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedSector={selectedSector} setSelectedSector={setSelectedSector} sectors={sectors}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        viewMode={viewMode} setViewMode={setViewMode}
        isTimeTraveling={isTimeTraveling}
        sentimentStats={sentimentStats}
        loading={loading}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 size={48} className="text-emerald-500 animate-spin" />
            <p className="text-charcoal animate-pulse font-medium">Scanning market signals...</p>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
            <p className="text-xl text-charcoal font-medium">No stocks match your criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setSelectedSector('All'); }}
              className="mt-4 text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <StatusLegend />

            {/* View Mode Logic */}
            {viewMode === 'TREEMAP' ? (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-serif font-semibold text-slate-200 flex items-center gap-2">
                            <LayoutDashboard size={20} className="text-purple-400" />
                            Market Map (Size by Cap)
                        </h2>
                        {/* Time Indicator for Treemap */}
                        <div className={`text-xs font-mono px-2 py-1 rounded flex items-center gap-1 border ${isTimeTraveling ? 'text-amber-400 bg-amber-950/30 border-amber-500/30' : 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30'}`}>
                            <Clock size={12} /> {currentSnapshotLabel}
                        </div>
                    </div>
                    <MarketTreemap stocks={filteredStocks} onStockClick={setSelectedStock} />
                </div>
            ) : (
                /* Grid View with Watchlist Section */
                <div className="animate-in fade-in duration-300">
                    {/* Time Context Header */}
                    <div className={`flex items-center gap-2 mb-6 p-2 rounded border w-fit ${isTimeTraveling ? 'bg-amber-900/10 border-amber-500/30' : 'bg-slate-800/30 border-slate-800/50'}`}>
                         <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Viewing Data:</span>
                         <span className={`text-sm font-mono font-bold ${isTimeTraveling ? 'text-amber-400' : 'text-emerald-400'}`}>{currentSnapshotLabel}</span>
                    </div>

                    {/* Watchlist Section */}
                    {watchlistStocks.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-serif font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                My Watchlist
                            </h2>
                            {/* Updated Grid for Wider Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {watchlistStocks.map(stock => (
                                    <StockCard 
                                        key={stock.ticker} 
                                        stock={stock} 
                                        isStarred={true}
                                        onToggleStar={toggleWatchlist}
                                        onClick={setSelectedStock} 
                                    />
                                ))}
                            </div>
                            {otherStocks.length > 0 && <div className="h-px bg-slate-800 my-8"></div>}
                        </div>
                    )}

                    {/* All / Remaining Stocks */}
                    {otherStocks.length > 0 && (
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-slate-200 mb-4">
                                {watchlistStocks.length > 0 ? 'Other Assets' : 'All Assets'}
                            </h2>
                            {/* Updated Grid for Wider Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {otherStocks.map(stock => (
                                    <StockCard 
                                        key={stock.ticker} 
                                        stock={stock} 
                                        isStarred={false}
                                        onToggleStar={toggleWatchlist}
                                        onClick={setSelectedStock} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
          </>
        )}
      </main>

      {/* Feature 7: Time Travel Slider Footer */}
      {!loading && history.length > 0 && (
          <TimeTravelFooter 
             history={history}
             timeIndex={timeIndex}
             setTimeIndex={setTimeIndex}
             isPlaying={isPlaying}
             setIsPlaying={setIsPlaying}
             currentSnapshotLabel={currentSnapshotLabel}
             isTimeTraveling={isTimeTraveling}
          />
      )}

      {/* Modal */}
      {selectedStock && (
        <StockModal 
          stock={selectedStock} 
          onClose={() => setSelectedStock(null)} 
        />
      )}

    </div>
  );
};

export default App;