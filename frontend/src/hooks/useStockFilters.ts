import { useState, useMemo } from 'react';
import { Stock, FilterStatus } from '../types';

export const useStockFilters = (stocks: Stock[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [selectedSector, setSelectedSector] = useState('All');

  // Compute unique sectors for dropdown
  const sectors = useMemo(() => {
    const allSectors = stocks.map(s => s.sector);
    return ['All', ...Array.from(new Set(allSectors))];
  }, [stocks]);

  // Filter Logic
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const matchesSearch = stock.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      const matchesStatus = statusFilter === 'ALL' || stock.status === statusFilter;
      
      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [stocks, searchTerm, selectedSector, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedSector,
    setSelectedSector,
    sectors,
    filteredStocks
  };
};