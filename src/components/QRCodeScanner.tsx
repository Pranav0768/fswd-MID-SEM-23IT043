
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanLine, ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface QRCodeScannerProps {
  onScan?: (result: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize scanner on mount
  useEffect(() => {
    if (scannerContainerRef.current) {
      scannerRef.current = new Html5Qrcode('qr-reader');
    }
    
    // Cleanup on unmount
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current?.stop()
          .catch(error => console.error('Error stopping scanner:', error));
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current) return;
    
    setScanning(true);
    setResult(null);
    
    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        handleScanSuccess,
        undefined
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check your permissions.",
        variant: "destructive"
      });
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;
    
    try {
      await scannerRef.current.stop();
      setScanning(false);
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    stopScanner();
    setResult(decodedText);
    
    if (onScan) {
      onScan(decodedText);
    }
    
    toast({
      title: "QR Code Scanned",
      description: "Successfully scanned QR code",
    });
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "QR code content has been copied",
    });
  };

  const openUrl = () => {
    if (!result) return;
    
    try {
      const url = new URL(result);
      window.open(url.href, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (result.includes('.') && !result.startsWith('http')) {
        window.open(`https://${result}`, '_blank', 'noopener,noreferrer');
      } else {
        toast({
          title: "Not a Valid URL",
          description: "The scanned content is not a valid URL",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <ScanLine className="h-5 w-5 text-primary" />
          <span>Scan QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={scannerContainerRef} className="qr-scanner-container mb-4">
          <div id="qr-reader" className="w-full h-full"></div>
          {scanning && (
            <>
              <div className="scanner-overlay"></div>
              <div className="qr-animated-border"></div>
            </>
          )}
        </div>
        
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium mb-1">Scanned Result:</p>
            <p className="text-sm break-all mb-3">{result}</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openUrl} 
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
              
              <CopyToClipboard text={result} onCopy={handleCopy}>
                <Button variant="outline" size="sm" className="flex-1">
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy
                </Button>
              </CopyToClipboard>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {!scanning ? (
          <Button onClick={startScanner} variant="default">
            <ScanLine className="h-4 w-4 mr-2" />
            Start Scanner
          </Button>
        ) : (
          <Button onClick={stopScanner} variant="destructive">
            Stop Scanner
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;
