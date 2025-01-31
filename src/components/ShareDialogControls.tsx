import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Copy, ZoomIn, ZoomOut, Twitter } from "lucide-react";

interface ShareDialogControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onTwitterShare: () => void;
}

const ShareDialogControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onCopy,
  onDownload,
  onTwitterShare
}: ShareDialogControlsProps) => {
  return (
    <div className="flex gap-2 justify-between items-center">
      <div className="flex gap-2">
        <Button onClick={onZoomOut} variant="outline" size="icon">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button onClick={onZoomIn} variant="outline" size="icon">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <span className="flex items-center px-2 text-sm">
          {Math.round(zoom * 100)}%
        </span>
      </div>
      <div className="flex gap-2">
        <Button onClick={onTwitterShare} variant="outline">
          <Twitter className="w-4 h-4 mr-2" />
          Share on X
        </Button>
        <Button onClick={onCopy} variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button onClick={onDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default ShareDialogControls;