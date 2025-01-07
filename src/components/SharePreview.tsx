import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { CategorizedProjects } from '@/types/projects';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#0a1929'
    });
    
    fabricCanvasRef.current = canvas;

    // Draw visible categories and their projects
    const visibleCategories = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);

    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;
    const radius = Math.min(canvas.width!, canvas.height!) * 0.35;

    // Draw categories in a circle
    visibleCategories.forEach(([key, category], index) => {
      const angle = (index * 2 * Math.PI) / visibleCategories.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw category circle
      const categoryCircle = new fabric.Circle({
        left: x - 30,
        top: y - 30,
        radius: 30,
        fill: category.color || '#ffffff',
        stroke: '#ffffff',
        strokeWidth: 2
      });

      // Add category label
      const categoryText = new fabric.Text(category.title, {
        left: x - 40,
        top: y + 35,
        fontSize: 14,
        fill: '#ffffff',
        textAlign: 'center',
        width: 80
      });

      canvas.add(categoryCircle, categoryText);

      // Draw projects around the category
      const projectRadius = radius * 0.4;
      category.projects.forEach((project, projectIndex) => {
        const projectAngle = angle + (projectIndex * Math.PI / 8) - (Math.PI / 3);
        const projectX = x + projectRadius * Math.cos(projectAngle);
        const projectY = y + projectRadius * Math.sin(projectAngle);

        const projectCircle = new fabric.Circle({
          left: projectX - 15,
          top: projectY - 15,
          radius: 15,
          fill: category.color || '#ffffff',
          opacity: 0.7,
          stroke: '#ffffff',
          strokeWidth: 1
        });

        const projectText = new fabric.Text(project.name, {
          left: projectX - 30,
          top: projectY + 20,
          fontSize: 12,
          fill: '#ffffff',
          textAlign: 'center',
          width: 60
        });

        canvas.add(projectCircle, projectText);

        // Draw line connecting project to category
        const line = new fabric.Line([x, y, projectX, projectY], {
          stroke: '#ffffff',
          strokeWidth: 1,
          opacity: 0.3
        });

        canvas.sendToBack(line);
        canvas.add(line);
      });
    });

    return () => {
      canvas.dispose();
    };
  }, [categories, visibleCategories]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SharePreview;