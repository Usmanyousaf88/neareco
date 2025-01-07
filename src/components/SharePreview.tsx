import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Rect, Text, Image, Shadow } from 'fabric';
import { CategorizedProjects } from '@/types/projects';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
];

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1920,
      height: 1080,
      backgroundColor: '#0a1929',
      selection: false,
      interactive: false,
    });
    
    fabricCanvasRef.current = canvas;

    // Get visible categories
    const visibleCats = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);

    let currentX = 60;
    let currentY = 60;
    const maxHeight = canvas.getHeight() - 120;
    const maxWidth = canvas.getWidth() - 120;

    // Draw each category and its projects
    const drawCategories = async () => {
      for (const [key, category] of visibleCats) {
        // Add category title
        const categoryText = new Text(category.title, {
          left: currentX,
          top: currentY,
          fontSize: 36,
          fill: '#ffffff',
          fontWeight: 'bold',
          width: 300,
          selectable: false,
          evented: false,
        });

        canvas.add(categoryText);
        currentY += 80;

        // Process projects
        for (const [index, project] of category.projects.entries()) {
          const width = Math.max(320, Math.min(480, project.name.length * 10));
          const height = width * (9/16);

          // Check if we need to move to next row or column
          if (currentX + width > maxWidth) {
            currentX = 60;
            currentY += height + 40;
          }

          if (currentY + height > maxHeight) {
            currentY = 60;
            currentX = Math.min(currentX + width + 40, maxWidth - width);
          }

          // Create card background
          const card = new Rect({
            left: currentX,
            top: currentY,
            width: width,
            height: height,
            fill: category.color || '#1a2e3b',
            rx: 12,
            ry: 12,
            selectable: false,
            evented: false,
            shadow: new Shadow({
              color: 'rgba(0,0,0,0.3)',
              blur: 10,
              offsetX: 0,
              offsetY: 4
            })
          });

          // Add project image
          try {
            await new Promise<void>((resolve) => {
              const imageUrl = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
              Image.fromURL(imageUrl, {
                callback: (img) => {
                  img.scaleToWidth(width);
                  const scaledHeight = img.getScaledHeight();
                  if (scaledHeight > height * 0.6) {
                    img.scaleToHeight(height * 0.6);
                  }
                  
                  img.set({
                    left: currentX,
                    top: currentY,
                    selectable: false,
                    evented: false,
                    clipPath: new Rect({
                      width: width,
                      height: height * 0.6,
                      rx: 12,
                      ry: 12,
                      absolutePositioned: true,
                      left: currentX,
                      top: currentY
                    })
                  });
                  
                  canvas.add(img);
                  resolve();
                }
              });
            });
          } catch (error) {
            console.error('Failed to load image:', error);
          }

          // Add project name
          const nameText = new Text(project.name, {
            left: currentX + 20,
            top: currentY + height * 0.65,
            fontSize: 24,
            fill: '#ffffff',
            fontWeight: 'bold',
            width: width - 40,
            selectable: false,
            evented: false,
          });

          // Add project tagline if exists
          if (project.tagline) {
            const taglineText = new Text(project.tagline, {
              left: currentX + 20,
              top: currentY + height * 0.8,
              fontSize: 16,
              fill: '#ffffff',
              width: width - 40,
              lineHeight: 1.2,
              opacity: 0.8,
              selectable: false,
              evented: false,
            });
            canvas.add(taglineText);
          }

          canvas.add(card, nameText);
          currentX += width + 40;
        }

        currentX = 60;
        currentY += 320;
      }
    };

    // Execute the drawing
    drawCategories();

    return () => {
      canvas.dispose();
    };
  }, [categories, visibleCategories]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
      <canvas ref={canvasRef} className="max-w-full h-auto shadow-xl rounded-lg" />
    </div>
  );
};

export default SharePreview;