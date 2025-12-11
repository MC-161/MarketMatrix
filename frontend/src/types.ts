export type Status = 'BULLISH' | 'BEARISH';
export type Signal = 'GOLDEN_CROSS' | 'DEATH_CROSS' | 'NONE';

export interface Stock {
  ticker: string;
  sector: string;
  status: Status;
  signal: Signal;
  current_price: string;
  daily_change: string; // Percentage change as string
  volume: string;
  market_cap: string; // In Billions
  strategy_return: string; // % Profit since trend started
  signal_date: string;
  rsi: string;
  price_history: string[]; // Last 30 days of closing prices
  sma_50: string;
  sma_200: string;
}

export type FilterStatus = 'ALL' | 'BULLISH' | 'BEARISH';