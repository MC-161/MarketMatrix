import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { Stock } from '../types';

interface MarketTreemapProps {
  stocks: Stock[];
  onStockClick: (stock: Stock) => void;
}

const MarketTreemap: React.FC<MarketTreemapProps> = ({ stocks, onStockClick }) => {
  // Transform data for Recharts Treemap
  // We can group by sector for a better visualization
  const data = stocks.map(stock => ({
    name: stock.ticker,
    size: parseFloat(stock.market_cap), // Use Market Cap for size
    stock: stock // Pass full stock object
  }));

  // Custom Content Renderer for Treemap Items
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, size } = props;
    
    // Find the original stock data
    const item = data[index];
    if (!item) return null;
    const stock = item.stock;

    const isBullish = stock.status === 'BULLISH';
    const dailyChange = parseFloat(stock.daily_change);
    const absChange = Math.abs(dailyChange);
    
    // Color logic similar to StockCard
    const intensity = Math.min(absChange / 5, 1);
    // Determine fill color
    const fillColor = isBullish 
      ? `rgba(16, 185, 129, ${0.3 + intensity * 0.6})`  // emerald with opacity
      : `rgba(244, 63, 94, ${0.3 + intensity * 0.6})`;   // rose with opacity
    
    const borderColor = isBullish ? '#34d399' : '#fb7185';
    
    // Don't render text if box is too small
    const showText = width > 40 && height > 40;
    const showPrice = width > 60 && height > 60;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: fillColor,
            stroke: '#1e293b',
            strokeWidth: 2,
            strokeOpacity: 1,
            cursor: 'pointer',
          }}
          onClick={() => onStockClick(stock)}
        />
        {showText && (
          <text
            x={x + width / 2}
            y={y + height / 2 - (showPrice ? 8 : 0)}
            textAnchor="middle"
            fill="#fff"
            fontSize={Math.min(width / 4, 16)}
            fontWeight="bold"
            pointerEvents="none"
          >
            {name}
          </text>
        )}
        {showPrice && (
            <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize={Math.min(width / 6, 12)}
            pointerEvents="none"
          >
            {dailyChange > 0 ? '+' : ''}{stock.daily_change}%
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="h-[600px] w-full bg-slate-800/20 rounded-xl border border-slate-800 p-2 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
            <Treemap
                data={data}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomizedContent />}
                animationDuration={500}
            >
               <Tooltip 
                 content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        const stock = payload[0].payload.stock as Stock;
                        return (
                            <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl text-xs">
                                <div className="font-bold text-white text-sm mb-1">{stock.ticker}</div>
                                <div className="text-gray-400 mb-1">{stock.sector}</div>
                                <div className={stock.status === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}>
                                    {stock.daily_change}%
                                </div>
                                <div className="text-white mt-1">
                                    Mkt Cap: £{stock.market_cap}B
                                </div>
                            </div>
                        );
                    }
                    return null;
                 }}
               />
            </Treemap>
        </ResponsiveContainer>
    </div>
  );
};

export default MarketTreemap;