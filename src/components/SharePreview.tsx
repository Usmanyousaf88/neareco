import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CategorizedProjects } from '@/types/projects';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions with better spacing
    const width = 1920;
    const height = 1080;
    const padding = 80;
    const sectionPadding = 40;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", "#0f172a"); // Darker background for better contrast

    // Filter visible sections and create layout
    const sections = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);
      
    const numColumns = Math.min(3, Math.ceil(Math.sqrt(sections.length)));
    const numRows = Math.ceil(sections.length / numColumns);
    
    // Calculate section sizes with better proportions
    const maxProjectsInSection = Math.max(...sections.map(([_, category]) => category.projects.length));
    const minSectionHeight = 250; // Increased minimum height
    
    sections.forEach(([key, category], index) => {
      const col = index % numColumns;
      const row = Math.floor(index / numColumns);
      
      // Calculate dynamic section size with better proportions
      const projectCount = category.projects.length;
      const heightRatio = Math.max(projectCount / maxProjectsInSection, 0.6); // Minimum 60% of max height
      const sectionHeight = Math.max(minSectionHeight, (height - (padding * 2) - (sectionPadding * (numRows - 1))) / numRows * heightRatio);
      const sectionWidth = (width - (padding * 2) - (sectionPadding * (numColumns - 1))) / numColumns;
      
      const x = padding + (col * (sectionWidth + sectionPadding));
      const y = padding + (row * (sectionHeight + sectionPadding));

      // Create section container with improved styling
      const section = svg.append("g")
        .attr("transform", `translate(${x},${y})`);

      // Add section background for better visibility
      section.append("rect")
        .attr("width", sectionWidth)
        .attr("height", sectionHeight)
        .attr("rx", 12)
        .attr("fill", "#1e293b")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);

      // Add section title with improved styling
      section.append("text")
        .attr("x", 24)
        .attr("y", 48)
        .attr("fill", "#f8fafc")
        .attr("font-size", "28px")
        .attr("font-weight", "bold")
        .text(category.title);

      // Layout projects in a grid with better spacing
      const projectsPerRow = Math.min(4, Math.ceil(Math.sqrt(category.projects.length)));
      const projectPadding = 20;
      const availableWidth = sectionWidth - 48;
      const availableHeight = sectionHeight - 96;
      
      const projectSize = Math.min(
        availableWidth / projectsPerRow - projectPadding,
        availableHeight / Math.ceil(category.projects.length / projectsPerRow) - projectPadding,
        80 // Increased maximum size
      );

      category.projects.forEach((project, projectIndex) => {
        const projectCol = projectIndex % projectsPerRow;
        const projectRow = Math.floor(projectIndex / projectsPerRow);
        
        const projectX = 24 + (projectCol * (projectSize + projectPadding));
        const projectY = 72 + (projectRow * (projectSize + projectPadding + 24));

        // Project container
        const projectGroup = section.append("g")
          .attr("transform", `translate(${projectX},${projectY})`);

        // Project icon background with improved styling
        projectGroup.append("circle")
          .attr("r", projectSize / 2)
          .attr("cx", projectSize / 2)
          .attr("cy", projectSize / 2)
          .attr("fill", "#334155")
          .attr("opacity", 0.8);

        // Project icon pattern
        const patternId = `pattern-${key}-${projectIndex}`;
        
        const defs = svg.append("defs");
        const pattern = defs.append("pattern")
          .attr("id", patternId)
          .attr("width", 1)
          .attr("height", 1)
          .attr("patternUnits", "objectBoundingBox");

        pattern.append("image")
          .attr("width", projectSize * 0.8) // Slightly larger icons
          .attr("height", projectSize * 0.8)
          .attr("x", projectSize * 0.1)
          .attr("y", projectSize * 0.1)
          .attr("href", project.image)
          .attr("preserveAspectRatio", "xMidYMid meet");

        // Project icon with improved styling
        projectGroup.append("circle")
          .attr("r", projectSize * 0.4)
          .attr("cx", projectSize / 2)
          .attr("cy", projectSize / 2)
          .attr("fill", `url(#${patternId})`);

        // Project name with improved styling
        projectGroup.append("text")
          .attr("x", projectSize / 2)
          .attr("y", projectSize + 20)
          .attr("text-anchor", "middle")
          .attr("fill", "#e2e8f0")
          .attr("font-size", "14px")
          .text(project.name);
      });
    });

    // Add title with improved styling
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", padding / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#f8fafc")
      .attr("font-size", "48px")
      .attr("font-weight", "bold")
      .text("NEAR Protocol Ecosystem Map");

  }, [categories, visibleCategories]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg" id="share-preview">
      <svg 
        ref={svgRef} 
        className="w-full h-full" 
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: '80vh' }}
      />
    </div>
  );
};

export default SharePreview;