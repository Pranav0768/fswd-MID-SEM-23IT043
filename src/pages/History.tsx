
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import QRHistoryList from '@/components/QRHistoryList';
import DateRangeFilter from '@/components/DateRangeFilter';
import { getQRHistory } from '@/utils/api';
import { useToast } from "@/components/ui/use-toast";

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [qrItems, setQrItems] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const fetchHistory = () => {
    try {
      const { items, totalPages: pages } = getQRHistory(
        currentPage,
        10,
        startDate,
        endDate
      );
      
      setQrItems(items);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Could not load QR code history",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    fetchHistory();
  }, [currentPage, startDate, endDate]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleApplyFilter = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1); 
    
    toast({
      title: "Filter Applied",
      description: "QR code history has been filtered by date",
    });
  };
  
  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1); 
    
    toast({
      title: "Filter Cleared",
      description: "Showing all QR code history",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your QR Code History</h1>
          
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />
          
          <QRHistoryList
            items={qrItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default History;
