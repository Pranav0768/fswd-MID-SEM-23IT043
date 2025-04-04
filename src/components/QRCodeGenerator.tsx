
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download,
  Copy,
  Send,
  Check,
  Link as LinkIcon,
  QrCode,
  X 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useToast } from "@/components/ui/use-toast";

interface QRCodeGeneratorProps {
  onGenerate?: (url: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate }) => {
  const [url, setUrl] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const generateQRCode = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL or text",
        variant: "destructive"
      });
      return;
    }
    
    setQrValue(url);
    
    // Call the callback if provided
    if (onGenerate) {
      onGenerate(url);
    }
    
    toast({
      title: "QR Code Generated",
      description: "Your QR code has been created successfully",
    });
  };
  
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${new Date().toISOString()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been saved as a PNG file",
    });
  };
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "QR code URL has been copied",
    });
  };
  
  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out this QR Code');
    const body = encodeURIComponent(`I've generated a QR code for: ${qrValue}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    toast({
      title: "Sharing",
      description: "Opening email client to share QR code",
    });
  };
  
  const clearQRCode = () => {
    setUrl('');
    setQrValue('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <span>Generate QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or text"
              className="flex-1"
            />
            <Button 
              onClick={generateQRCode} 
              disabled={!url}
              variant="default"
            >
              Generate
            </Button>
          </div>
        </div>
        
        {qrValue && (
          <div className="qr-container bg-white rounded-lg p-4 border">
            <div className="qr-code relative mb-4">
              <QRCodeCanvas
                id="qr-code"
                value={qrValue}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white"
                onClick={clearQRCode}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2 justify-center">
              <LinkIcon className="h-3 w-3" />
              <span className="truncate">{qrValue}</span>
            </div>
            
            <div className="qr-action-buttons">
              <Button variant="outline" size="sm" onClick={downloadQRCode}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <CopyToClipboard text={qrValue} onCopy={handleCopy}>
                <Button variant="outline" size="sm">
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy
                </Button>
              </CopyToClipboard>
              
              <Button variant="outline" size="sm" onClick={shareViaEmail}>
                <Send className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
