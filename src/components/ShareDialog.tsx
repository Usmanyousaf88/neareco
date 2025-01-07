import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, ZoomIn, ZoomOut, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  const handleCopy = async () => {
    try {
      const canvas = document.querySelector('#share-preview canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error('Canvas not found');

      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      toast({
        title: "Copied!",
        description: "Image copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy image. Try downloading instead.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('#share-preview canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'near-ecosystem-map.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast({
      title: "Downloaded!",
      description: "Image has been downloaded",
    });
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
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-grow min-h-0">
          <div className="relative bg-gray-900 rounded-lg overflow-auto flex-grow min-h-0">
            <div 
              className="origin-top-left transition-transform duration-200 ease-out h-full"
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