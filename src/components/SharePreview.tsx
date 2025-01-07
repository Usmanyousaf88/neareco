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
      backgroundColor: '#0a1929'
    });
    
    fabricCanvasRef.current = canvas;

    // Draw visible categories and their projects
    const visibleCats = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);

    let currentX = 60;
    let currentY = 60;
    const maxHeight = canvas.getHeight() - 120;
    const maxWidth = canvas.getWidth() - 120;

    visibleCats.forEach(([key, category]) => {
      // Create category header
      const categoryText = new Text(category.title, {
        left: currentX,
        top: currentY,
        fontSize: 36,
        fill: '#ffffff',
        fontWeight: 'bold',
        width: 300
      });

      canvas.add(categoryText);
      currentY += 80;

      // Calculate card sizes based on project content
      const projects = category.projects.map((project, index) => {
        const nameLength = project.name.length;
        const taglineLength = project.tagline?.length || 0;
        
        // Base card size with 16:9 aspect ratio
        const width = Math.max(320, Math.min(480, nameLength * 10));
        const height = width * (9/16); // Maintain 16:9 aspect ratio

        return { 
          ...project, 
          width, 
          height,
          imageUrl: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]
        };
      });

      // Arrange projects in a grid-like layout
      projects.forEach(async (project) => {
        if (currentX + project.width > maxWidth) {
          currentX = 60;
          currentY += project.height + 40; // Add spacing between rows
        }

        if (currentY + project.height > maxHeight) {
          currentY = 60;
          currentX = Math.min(currentX + project.width + 40, maxWidth - project.width);
        }

        // Create card background
        const card = new Rect({
          left: currentX,
          top: currentY,
          width: project.width,
          height: project.height,
          fill: category.color || '#1a2e3b',
          rx: 12,
          ry: 12,
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 10,
            offsetX: 0,
            offsetY: 4
          })
        });

        // Load and add project image
        fabric.Image.fromURL(project.imageUrl, (img) => {
          img.scaleToWidth(project.width);
          const scaledHeight = img.getScaledHeight();
          if (scaledHeight > project.height * 0.6) {
            img.scaleToHeight(project.height * 0.6);
          }
          
          img.set({
            left: currentX,
            top: currentY,
            clipPath: new fabric.Rect({
              width: project.width,
              height: project.height * 0.6,
              rx: 12,
              ry: 12,
              absolutePositioned: true,
              left: currentX,
              top: currentY
            })
          });
          
          canvas.add(img);
        });

        // Add project name
        const nameText = new Text(project.name, {
          left: currentX + 20,
          top: currentY + project.height * 0.65,
          fontSize: 24,
          fill: '#ffffff',
          fontWeight: 'bold',
          width: project.width - 40
        });

        // Add project tagline if exists
        if (project.tagline) {
          const taglineText = new Text(project.tagline, {
            left: currentX + 20,
            top: currentY + project.height * 0.8,
            fontSize: 16,
            fill: '#ffffff',
            width: project.width - 40,
            lineHeight: 1.2,
            opacity: 0.8
          });
          canvas.add(taglineText);
        }

        canvas.add(card, nameText);
        currentX += project.width + 40; // Add spacing between cards
      });

      currentX = 60;
      currentY += 320; // Space between categories
    });

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