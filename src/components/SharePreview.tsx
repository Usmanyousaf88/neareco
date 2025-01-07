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

    // Initialize Fabric canvas with 16:9 aspect ratio
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1920,
      height: 1080,
      backgroundColor: '#0A0F1C', // Dark background like the reference
      selection: false,
      interactive: false,
    });
    
    fabricCanvasRef.current = canvas;

    // Get visible categories
    const visibleCats = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);

    // Calculate layout
    const padding = 40;
    const titleHeight = 80;
    const maxWidth = canvas.getWidth() - (padding * 2);
    const maxHeight = canvas.getHeight() - (padding * 2) - titleHeight;
    
    // Add title
    const titleText = new Text('NEAR Protocol Ecosystem Map', {
      left: padding,
      top: padding,
      fontSize: 48,
      fill: '#FFFFFF',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      selectable: false,
      evented: false,
    });
    canvas.add(titleText);

    // Calculate grid layout
    const numColumns = 3;
    const numRows = Math.ceil(visibleCats.length / numColumns);
    const cardWidth = (maxWidth - (padding * (numColumns - 1))) / numColumns;
    const cardHeight = (maxHeight - padding * (numRows - 1)) / numRows;
    
    // Draw categories and their projects
    visibleCats.forEach(([key, category], index) => {
      const row = Math.floor(index / numColumns);
      const col = index % numColumns;
      
      const cardX = padding + (col * (cardWidth + padding));
      const cardY = padding + titleHeight + (row * (cardHeight + padding));

      // Create category background
      const card = new Rect({
        left: cardX,
        top: cardY,
        width: cardWidth,
        height: cardHeight,
        fill: '#111827',
        rx: 8,
        ry: 8,
        stroke: '#2563EB',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });

      // Add category title
      const categoryTitle = new Text(category.title, {
        left: cardX + 20,
        top: cardY + 20,
        fontSize: 24,
        fill: '#60A5FA',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        selectable: false,
        evented: false,
      });

      // Add projects in a grid
      const projectsPerRow = 4;
      const projectPadding = 15;
      const projectStartY = cardY + 70; // Start projects below category title
      const projectWidth = (cardWidth - 40 - (projectPadding * (projectsPerRow - 1))) / projectsPerRow;
      const projectHeight = 30;

      category.projects.forEach((project, projectIndex) => {
        const projectRow = Math.floor(projectIndex / projectsPerRow);
        const projectCol = projectIndex % projectsPerRow;

        const projectX = cardX + 20 + (projectCol * (projectWidth + projectPadding));
        const projectY = projectStartY + (projectRow * (projectHeight + projectPadding));

        // Add project name
        const projectText = new Text(project.name, {
          left: projectX,
          top: projectY,
          fontSize: 14,
          fill: '#FFFFFF',
          fontFamily: 'Arial',
          width: projectWidth,
          textAlign: 'left',
          selectable: false,
          evented: false,
        });

        canvas.add(projectText);
      });

      canvas.add(card, categoryTitle);
    });

    // Add footer with date
    const dateText = new Text(`Updated: ${new Date().toLocaleDateString()}`, {
      left: canvas.width - padding - 200,
      top: canvas.height - padding - 20,
      fontSize: 14,
      fill: '#6B7280',
      fontFamily: 'Arial',
      selectable: false,
      evented: false,
    });
    canvas.add(dateText);

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