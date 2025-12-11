import { Stock } from '../types';

const DATA_URL = 'https://signalgrid-ui-2025.s3.eu-north-1.amazonaws.com/market-data-historical.json';

// Helper to inject missing market_cap data for the visualization (since source JSON might lack it)
const generateMarketCap = (ticker: string, sector: string): string => {
    // Known Mega Caps
    if (['AAPL', 'MSFT', 'NVDA', 'GOOG', 'GOOGL', 'AMZN'].includes(ticker)) return (2000 + Math.random() * 1000).toFixed(2);
    if (['META', 'TSLA', 'AVGO', 'LLY', 'V', 'JPM', 'WMT', 'MA'].includes(ticker)) return (500 + Math.random() * 500).toFixed(2);
    // Sector averages
    if (sector === 'Technology') return (100 + Math.random() * 300).toFixed(2);
    if (sector === 'Healthcare') return (80 + Math.random() * 200).toFixed(2);
    return (50 + Math.random() * 150).toFixed(2);
};

export interface MarketSnapshot {
    label: string;
    timestamp: number;
    data: Stock[];
}

export const fetchHistory = async (): Promise<MarketSnapshot[]> => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const rawData = await response.json();

    // 1. Process "Live" Data (stockData) to use as the base for snapshots
    // Ensure numeric fields are converted to strings if necessary
    const liveStocks: Stock[] = rawData.stockData.map((item: any) => ({
        ...item,
        market_cap: item.market_cap ? String(item.market_cap) : generateMarketCap(item.ticker, item.sector),
        sma_50: String(item.sma_50),
        sma_200: String(item.sma_200),
        current_price: String(item.current_price),
        daily_change: String(item.daily_change),
        strategy_return: String(item.strategy_return),
        rsi: String(item.rsi),
        volume: String(item.volume)
    }));

    // 2. Process Historical Snapshots from JSON
    const history: MarketSnapshot[] = (rawData.historicalSnapshots || []).map((snap: any) => {
      const date = new Date(snap.timestamp);
      const label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Merge snapshot partial data with full live data to ensure valid Stock objects
      const snapshotStocks = snap.stocks.map((partialStock: any) => {
        const baseStock = liveStocks.find(s => s.ticker === partialStock.ticker);
        if (!baseStock) return null;

        return {
          ...baseStock,
          ...partialStock, 
          // Override specific fields and ensure they are strings
          sma_50: String(partialStock.sma_50),
          sma_200: String(partialStock.sma_200),
          status: partialStock.status,
          signal: partialStock.signal
        };
      }).filter(Boolean) as Stock[];

      return {
        label: label, 
        timestamp: date.getTime(),
        data: snapshotStocks
      };
    });

    // 3. Add Current Live Data as the last snapshot (Source of truth is stockData)
    const liveSnapshot: MarketSnapshot = {
      label: 'Now (Live)',
      timestamp: Date.now(),
      data: liveStocks
    };

    // Combine history + live and sort by timestamp
    return [...history, liveSnapshot].sort((a, b) => a.timestamp - b.timestamp);
    
  } catch (error) {
    console.error("Error fetching market history:", error);
    // Return empty array to handle error gracefully in UI
    return [];
  }
};