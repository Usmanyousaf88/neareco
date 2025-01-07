import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Rect, Text } from 'fabric';
import { CategorizedProjects } from '@/types/projects';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: '#0a1929'
    });
    
    fabricCanvasRef.current = canvas;

    // Draw visible categories and their projects
    const visibleCats = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);

    let currentX = 40;
    let currentY = 40;
    const maxHeight = canvas.getHeight() - 80;
    const maxWidth = canvas.getWidth() - 80;

    visibleCats.forEach(([key, category]) => {
      // Create category header
      const categoryText = new Text(category.title, {
        left: currentX,
        top: currentY,
        fontSize: 24,
        fill: '#ffffff',
        fontWeight: 'bold',
        width: 200
      });

      canvas.add(categoryText);
      currentY += 50;

      // Calculate card sizes based on project content
      const projects = category.projects.map(project => {
        const nameLength = project.name.length;
        const taglineLength = project.tagline?.length || 0;
        
        // Adjust card size based on content
        const width = Math.max(200, Math.min(300, nameLength * 8));
        const height = Math.max(150, Math.min(250, taglineLength * 0.5 + 100));

        return { ...project, width, height };
      });

      // Arrange projects in a grid-like layout
      projects.forEach((project, index) => {
        if (currentX + project.width > maxWidth) {
          currentX = 40;
          currentY += 280; // Move to next row
        }

        if (currentY + project.height > maxHeight) {
          currentY = 40; // Reset Y if we've reached the bottom
          currentX = Math.min(currentX + 320, maxWidth - project.width);
        }

        // Create card background
        const card = new Rect({
          left: currentX,
          top: currentY,
          width: project.width,
          height: project.height,
          fill: category.color || '#ffffff',
          opacity: 0.8,
          rx: 10,
          ry: 10
        });

        // Add project name
        const nameText = new Text(project.name, {
          left: currentX + 20,
          top: currentY + 20,
          fontSize: 18,
          fill: '#ffffff',
          fontWeight: 'bold',
          width: project.width - 40
        });

        // Add project tagline if exists
        if (project.tagline) {
          const taglineText = new Text(project.tagline, {
            left: currentX + 20,
            top: currentY + 60,
            fontSize: 14,
            fill: '#ffffff',
            width: project.width - 40,
            lineHeight: 1.2
          });
          canvas.add(taglineText);
        }

        canvas.add(card, nameText);
        currentX += project.width + 20;
      });

      currentX = 40;
      currentY += 280; // Space between categories
    });

    return () => {
      canvas.dispose();
    };
  }, [categories, visibleCategories]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
      <canvas ref={canvasRef} className="max-w-full shadow-xl rounded-lg" />
    </div>
  );
};

export default SharePreview;