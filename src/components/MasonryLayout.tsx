import React from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';

interface MasonryLayoutProps {
  children: React.ReactNode;
  breakpointColumns: {
    default: number;
    [key: number]: number;
  };
}

const MasonryLayout = ({ children, breakpointColumns }: MasonryLayoutProps) => {
  return (
    <>
      <style>
        {`
          .masonry-grid {
            display: flex;
            width: auto;
            margin-left: -16px;
            transition: height 0.3s ease;
          }
          .masonry-grid_column {
            padding-left: 16px;
            background-clip: padding-box;
            transition: transform 0.3s ease;
          }
          .masonry-grid_column > div {
            margin-bottom: 16px;
            transition: transform 0.3s ease;
          }
        `}
      </style>
      <AnimatePresence>
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {children}
        </Masonry>
      </AnimatePresence>
    </>
  );
};

export default MasonryLayout;