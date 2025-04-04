
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeScanner from '@/components/QRCodeScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, ScanLine } from 'lucide-react';
import { addQRToHistory } from '@/utils/api';
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('url');
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();
  
  useEffect(() => {
    if (urlParam) {
      setActiveTab('generate');
      toast({
        title: "URL Detected",
        description: "QR code generation form has been pre-filled",
      });
    }
  }, [urlParam, toast]);
  
  const handleGenerate = (url: string) => {
    addQRToHistory(url, 'generated');
  };
  
  const handleScan = (result: string) => {
    addQRToHistory(result, 'scanned');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <Tabs 
          defaultValue="generate" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-md mx-auto"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="flex gap-2 items-center">
              <QrCode className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex gap-2 items-center">
              <ScanLine className="h-4 w-4" />
              Scan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <QRCodeGenerator onGenerate={handleGenerate} />
          </TabsContent>
          
          <TabsContent value="scan">
            <QRCodeScanner onScan={handleScan} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
