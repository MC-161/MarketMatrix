import { Stock } from '../types';

export const calculateSentiment = (stocks: Stock[]) => {
  if (stocks.length === 0) return { bullish: 0, bearish: 0, percent: 0 };
  const bullishCount = stocks.filter(s => s.status === 'BULLISH').length;
  const percent = Math.round((bullishCount / stocks.length) * 100);
  return {
    bullish: bullishCount,
    bearish: stocks.length - bullishCount,
    percent
  };
};