
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from "@/components/ui/button";
import { CalendarRange, FilterX } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onApplyFilter: (startDate: Date | null, endDate: Date | null) => void;
  onClearFilter: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onApplyFilter,
  onClearFilter,
}) => {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate);
  
  const handleApplyFilter = () => {
    onApplyFilter(localStartDate, localEndDate);
  };
  
  const handleClearFilter = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    onClearFilter();
  };
  
  const isFilterActive = !!(startDate || endDate);
  
  return (
    <Card className="shadow-sm mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Date Range Filter</span>
          </div>
          {isFilterActive && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilter}
              className="h-8 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <FilterX className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 date-picker-container mb-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
            <DatePicker
              selected={localStartDate}
              onChange={(date) => setLocalStartDate(date)}
              selectsStart
              startDate={localStartDate}
              endDate={localEndDate}
              maxDate={new Date()}
              placeholderText="Select start date"
              dateFormat="MMM d, yyyy"
              className="w-full text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
            <DatePicker
              selected={localEndDate}
              onChange={(date) => setLocalEndDate(date)}
              selectsEnd
              startDate={localStartDate}
              endDate={localEndDate}
              minDate={localStartDate}
              maxDate={new Date()}
              placeholderText="Select end date"
              dateFormat="MMM d, yyyy"
              className="w-full text-sm"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleApplyFilter} 
          size="sm" 
          className="w-full"
        >
          Apply Filter
        </Button>
      </CardContent>
    </Card>
  );
};

export default DateRangeFilter;
