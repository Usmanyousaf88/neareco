import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Rect, Text, Image } from 'fabric';
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

    // Initialize Fabric canvas with 16:9 aspect ratio
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

    // Calculate layout
    const padding = 40;
    const maxWidth = canvas.getWidth() - (padding * 2);
    const maxHeight = canvas.getHeight() - (padding * 2);
    const categorySpacing = 60;
    const projectSpacing = 20;

    let currentY = padding;

    // Draw each category and its projects
    const drawCategories = async () => {
      for (const [key, category] of visibleCats) {
        // Add category title
        const categoryText = new Text(category.title, {
          left: padding,
          top: currentY,
          fontSize: 32,
          fill: '#ffffff',
          fontWeight: 'bold',
          selectable: false,
          evented: false,
        });

        canvas.add(categoryText);
        currentY += 50;

        // Calculate project card dimensions
        const projectsPerRow = Math.min(4, category.projects.length);
        const cardWidth = (maxWidth - (projectSpacing * (projectsPerRow - 1))) / projectsPerRow;
        const cardHeight = cardWidth * 0.6;

        // Process projects in rows
        for (let i = 0; i < category.projects.length; i++) {
          const project = category.projects[i];
          const row = Math.floor(i / projectsPerRow);
          const col = i % projectsPerRow;

          const cardX = padding + (col * (cardWidth + projectSpacing));
          const cardY = currentY + (row * (cardHeight + projectSpacing));

          // Create card background
          const card = new Rect({
            left: cardX,
            top: cardY,
            width: cardWidth,
            height: cardHeight,
            fill: category.color || '#1a2e3b',
            rx: 8,
            ry: 8,
            selectable: false,
            evented: false,
          });

          // Add project image
          try {
            const imageUrl = PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length];
            await new Promise<void>((resolve) => {
              Image.fromURL(imageUrl, {
                scaleX: cardWidth / 300,
                scaleY: cardWidth / 300,
              }).then((img) => {
                img.set({
                  left: cardX,
                  top: cardY,
                  width: cardWidth,
                  height: cardHeight * 0.6,
                  selectable: false,
                  evented: false,
                });
                canvas.add(img);
                resolve();
              });
            });
          } catch (error) {
            console.error('Failed to load image:', error);
          }

          // Add project name
          const nameText = new Text(project.name, {
            left: cardX + 10,
            top: cardY + (cardHeight * 0.65),
            fontSize: 18,
            fill: '#ffffff',
            fontWeight: 'bold',
            width: cardWidth - 20,
            selectable: false,
            evented: false,
          });

          // Add project tagline if exists
          if (project.tagline) {
            const taglineText = new Text(project.tagline, {
              left: cardX + 10,
              top: cardY + (cardHeight * 0.8),
              fontSize: 14,
              fill: '#ffffff',
              width: cardWidth - 20,
              lineHeight: 1.2,
              opacity: 0.8,
              selectable: false,
              evented: false,
            });
            canvas.add(taglineText);
          }

          canvas.add(card, nameText);
        }

        // Update currentY for next category
        const rowCount = Math.ceil(category.projects.length / projectsPerRow);
        currentY += (rowCount * (cardHeight + projectSpacing)) + categorySpacing;
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