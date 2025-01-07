import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, ZoomIn, ZoomOut, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import SharePreview from './SharePreview';
import { CategorizedProjects } from '@/types/projects';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const ShareDialog = ({ open, onOpenChange, categories, visibleCategories }: ShareDialogProps) => {
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const capturePreview = async () => {
    if (!previewRef.current) return null;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#0A0F1C',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      return canvas;
    } catch (error) {
      console.error('Failed to capture preview:', error);
      return null;
    }
  };

  const handleCopy = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) throw new Error('Failed to capture preview');

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else throw new Error('Failed to create blob');
        }, 'image/png');
      });

      // Create a ClipboardItem and write to clipboard
      const data = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([data]);

      toast({
        title: "Copied!",
        description: "Image copied to clipboard",
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Error",
        description: "Failed to copy image. Try downloading instead.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) throw new Error('Failed to capture preview');

      // Create download link
      const link = document.createElement('a');
      link.download = 'near-ecosystem-map.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Downloaded!",
        description: "Image has been downloaded",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleTwitterShare = () => {
    const text = "Check out this NEAR Protocol Ecosystem Map! 🚀";
    const url = window.location.href;
    const hashtags = "NEAR,Web3,Blockchain";
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(twitterUrl, '_blank');
    
    toast({
      title: "Opening Twitter",
      description: "Redirecting you to share on Twitter/X",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Share Preview</DialogTitle>
          <DialogDescription>
            Create and share an image of your NEAR ecosystem map
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-grow min-h-0">
          <div className="relative bg-gray-900 rounded-lg overflow-auto flex-grow min-h-0">
            <div 
              ref={previewRef}
              className="origin-top-left transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <SharePreview 
                categories={categories} 
                visibleCategories={visibleCategories}
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2">
              <Button onClick={handleZoomOut} variant="outline" size="icon">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button onClick={handleZoomIn} variant="outline" size="icon">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <span className="flex items-center px-2 text-sm">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleTwitterShare} variant="outline">
                <Twitter className="w-4 h-4 mr-2" />
                Share on X
              </Button>
              <Button onClick={handleCopy} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;