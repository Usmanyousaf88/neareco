import React from 'react';
import Masonry from 'react-masonry-css';

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
            margin-left: -24px;
          }
          .masonry-grid_column {
            padding-left: 24px;
            background-clip: padding-box;
          }
          .masonry-grid_column > * {
            margin-bottom: 24px;
          }
        `}
      </style>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {children}
      </Masonry>
    </>
  );
};

export default MasonryLayout;