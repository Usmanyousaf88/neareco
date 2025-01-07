import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import { CategorizedProjects } from '@/types/projects';
import ShareDialogControls from './ShareDialogControls';
import SharePreviewContainer from './SharePreviewContainer';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && containerRef.current && previewRef.current) {
      const container = containerRef.current;
      const preview = previewRef.current;
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const previewWidth = 1920;
      const previewHeight = 1080;
      
      const horizontalScale = containerWidth / previewWidth;
      const verticalScale = containerHeight / previewHeight;
      
      const initialZoom = Math.min(horizontalScale, verticalScale) * 0.95;
      setZoom(initialZoom);
    }
  }, [open]);

  const capturePreview = async () => {
    if (!previewRef.current) return null;
    
    try {
      const originalTransform = previewRef.current.style.transform;
      previewRef.current.style.transform = 'scale(1)';
      
      const canvas = await html2canvas(previewRef.current, {
        width: 1920,
        height: 1080,
        scale: 2,
        backgroundColor: '#0A0F1C',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      previewRef.current.style.transform = originalTransform;
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

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else throw new Error('Failed to create blob');
        }, 'image/png');
      });

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
          <SharePreviewContainer
            containerRef={containerRef}
            previewRef={previewRef}
            zoom={zoom}
            categories={categories}
            visibleCategories={visibleCategories}
          />
          
          <ShareDialogControls
            zoom={zoom}
            onZoomIn={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            onZoomOut={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onTwitterShare={handleTwitterShare}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;