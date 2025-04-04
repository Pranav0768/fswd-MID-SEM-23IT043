
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Link2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface QRCodeItem {
  id: string;
  content: string;
  type: 'generated' | 'scanned';
  createdAt: Date;
}

interface QRHistoryListProps {
  items: QRCodeItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const QRHistoryList: React.FC<QRHistoryListProps> = ({
  items,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const openUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      window.open(parsed.href, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (url.includes('.') && !url.startsWith('http')) {
        window.open(`https://${url}`, '_blank', 'noopener,noreferrer');
      } else {
        console.error('Not a valid URL:', url);
      }
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No QR codes in your history yet.
        </div>
      ) : (
        <>
          {items.map((item) => (
            <Card key={item.id} className="history-item overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  <div className={`w-2 ${item.type === 'generated' ? 'bg-primary' : 'bg-cyan-500'}`}></div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="max-w-[80%]">
                        <p className="font-medium text-sm truncate" title={item.content}>
                          {item.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            item.type === 'generated' 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-cyan-500/10 text-cyan-600'
                          }`}>
                            {item.type === 'generated' ? 'Generated' : 'Scanned'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8" 
                          onClick={() => openUrl(item.content)}
                          title="Open link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8" 
                          onClick={() => {
                            const url = `${window.location.origin}/dashboard?url=${encodeURIComponent(item.content)}`;
                            window.open(url, '_blank');
                          }}
                          title="Generate QR code"
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) onPageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default QRHistoryList;
