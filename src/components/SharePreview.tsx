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

    // Setup dimensions
    const width = 3840;
    const height = 2160;
    const padding = 40;
    const sectionPadding = 20;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", "rgb(17, 24, 39)");

    // Filter visible sections and create layout
    const sections = Object.entries(categories)
      .filter(([key]) => visibleCategories[key]);
      
    const numColumns = 3;
    const numRows = Math.ceil(sections.length / numColumns);
    
    const sectionWidth = (width - (padding * 2) - (sectionPadding * (numColumns - 1))) / numColumns;
    const sectionHeight = (height - (padding * 2) - (sectionPadding * (numRows - 1))) / numRows;

    sections.forEach(([key, category], index) => {
      const col = index % numColumns;
      const row = Math.floor(index / numColumns);
      
      const x = padding + (col * (sectionWidth + sectionPadding));
      const y = padding + (row * (sectionHeight + sectionPadding));

      // Create section container
      const section = svg.append("g")
        .attr("transform", `translate(${x},${y})`);

      // Add section border
      section.append("rect")
        .attr("width", sectionWidth)
        .attr("height", sectionHeight)
        .attr("rx", 8)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("opacity", 0.3);

      // Add section title
      section.append("text")
        .attr("x", 20)
        .attr("y", 40)
        .attr("fill", "white")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .text(category.title);

      // Layout projects in a grid
      const projectsPerRow = 4;
      const projectPadding = 10;
      const projectSize = Math.min(
        (sectionWidth - 40) / projectsPerRow - projectPadding,
        60
      );

      category.projects.forEach((project, projectIndex) => {
        const projectCol = projectIndex % projectsPerRow;
        const projectRow = Math.floor(projectIndex / projectsPerRow);
        
        const projectX = 20 + (projectCol * (projectSize + projectPadding));
        const projectY = 60 + (projectRow * (projectSize + projectPadding + 20));

        // Project container
        const projectGroup = section.append("g")
          .attr("transform", `translate(${projectX},${projectY})`);

        // Project icon background
        projectGroup.append("circle")
          .attr("r", projectSize / 2)
          .attr("cx", projectSize / 2)
          .attr("cy", projectSize / 2)
          .attr("fill", "white")
          .attr("opacity", 0.1);

        // Project icon - using pattern to ensure image displays correctly
        const patternId = `pattern-${key}-${projectIndex}`;
        
        // Define pattern for image
        const defs = svg.append("defs");
        const pattern = defs.append("pattern")
          .attr("id", patternId)
          .attr("width", 1)
          .attr("height", 1)
          .attr("patternUnits", "objectBoundingBox");

        pattern.append("image")
          .attr("width", projectSize * 0.7)
          .attr("height", projectSize * 0.7)
          .attr("href", project.image)
          .attr("preserveAspectRatio", "xMidYMid meet");

        // Project icon circle with pattern fill
        projectGroup.append("circle")
          .attr("r", projectSize * 0.35)
          .attr("cx", projectSize / 2)
          .attr("cy", projectSize / 2)
          .attr("fill", `url(#${patternId})`);

        // Project name
        projectGroup.append("text")
          .attr("x", projectSize / 2)
          .attr("y", projectSize + 15)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .text(project.name);
      });
    });

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", padding / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "36px")
      .attr("font-weight", "bold")
      .text("NEAR Protocol Ecosystem Map");

  }, [categories, visibleCategories]);

  return (
    <div className="fixed left-[-9999px] top-[-9999px]" id="share-preview">
      <svg ref={svgRef} />
    </div>
  );
};

export default SharePreview;