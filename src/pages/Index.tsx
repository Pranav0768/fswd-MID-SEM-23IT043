
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { QrCode, ScanLine, History, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: 'Generate QR Codes',
      description: 'Create QR codes from any URL or text in seconds',
    },
    {
      icon: <ScanLine className="h-6 w-6" />,
      title: 'Scan with Ease',
      description: 'Use your device camera to scan any QR code instantly',
    },
    {
      icon: <History className="h-6 w-6" />,
      title: 'Track History',
      description: 'Keep a record of all your scanned and generated QR codes',
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Secure & Fast',
      description: 'Your data stays on your device. No server connection needed',
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full py-4 border-b">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">QR Scanner</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>Go to home</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-primary">Scan & share</span>
                  <br />
                  QR Codes 
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  click below to generat 
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2">
                    <QrCode className="h-5 w-5" />
                    Generate QR Code
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/scan')} className="gap-2">
                    <ScanLine className="h-5 w-5" />
                    Scan QR Code
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 to-purple-400/20 blur-3xl"></div>
                  <div className="relative bg-background rounded-3xl shadow-lg p-6 md:p-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center p-4">
                        <QrCode className="h-12 w-12 text-primary" />
                      </div>
                      <div className="aspect-square bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
                        <ScanLine className="h-12 w-12 text-slate-700 dark:text-slate-200" />
                      </div>
                      <div className="aspect-square bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
                        <History className="h-12 w-12 text-slate-700 dark:text-slate-200" />
                      </div>
                      <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center p-4">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
                          <rect x="6" y="30" width="12" height="12" rx="2" fill="currentColor" />
                          <rect x="30" y="6" width="12" height="12" rx="2" fill="currentColor" />
                          <rect x="30" y="30" width="12" height="36" rx="2" fill="currentColor" opacity="0.2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        
        
        
      </main>
    </div>
  );
};

export default Index;
