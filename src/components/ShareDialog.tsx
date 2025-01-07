import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Share Preview</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <SharePreview 
              categories={categories} 
              visibleCategories={visibleCategories}
            />
          </div>
          <div className="flex gap-2 justify-end">
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
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;