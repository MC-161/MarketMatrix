import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  CartesianGrid
} from 'recharts';
import { Stock } from '../types';

interface TrendChartProps {
  stock: Stock;
}

const TrendChart: React.FC<TrendChartProps> = ({ stock }) => {
  const sma50Num = parseFloat(stock.sma_50);
  const sma200Num = parseFloat(stock.sma_200);

  // Generate dates for the last 30 days (Assuming last point is Today)
  const data = stock.price_history.map((price, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - index));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price),
    };
  });

  const isBullish = stock.status === 'BULLISH';
  // emerald-500 (#10b981) for bullish, rose-500 (#f43f5e) for bearish
  const color = isBullish ? '#10b981' : '#f43f5e';

  // Calculate domain to ensure SMA lines and price history fit well
  const prices = data.map(d => d.price);
  const allValues = [...prices, sma50Num, sma200Num];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.15; // 15% padding for breathing room

  return (
    <div className="h-72 w-full mt-4 bg-gray-900/50 rounded-lg p-2 border border-gray-800/50">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          
          <YAxis 
            domain={[minVal - padding, maxVal + padding]} 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `£${val.toFixed(0)}`}
            width={40}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111827', 
              borderColor: '#374151', 
              color: '#f3f4f6',
              borderRadius: '6px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            formatter={(value: number) => [`£${value.toFixed(2)}`, 'Price']}
          />
          
          {/* 50 Day SMA Reference */}
          <ReferenceLine 
            y={sma50Num} 
            stroke={isBullish ? '#34d399' : '#fb7185'} 
            strokeDasharray="3 3" 
            opacity={0.8}
            strokeWidth={1}
          >
             <Label 
               value={`SMA50: £${sma50Num}`} 
               position="insideRight" 
               fill={isBullish ? '#34d399' : '#fb7185'} 
               fontSize={10} 
               offset={-10} // Pulled inside slightly
               style={{ textShadow: '0px 0px 4px rgba(0,0,0,0.8)', fontWeight: 600 }}
             />
          </ReferenceLine>

          {/* 200 Day SMA Reference */}
          <ReferenceLine 
            y={sma200Num} 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            opacity={0.6}
            strokeWidth={1}
          >
             <Label 
               value={`SMA200: £${sma200Num}`} 
               position="insideRight" 
               fill="#94a3b8" 
               fontSize={10} 
               offset={-10}
               style={{ textShadow: '0px 0px 4px rgba(0,0,0,0.8)', fontWeight: 600 }}
             />
          </ReferenceLine>

          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;