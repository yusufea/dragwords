import React from 'react';

type DroppableAreaProps = {
  items: string[];
};

const DroppableArea: React.FC<DroppableAreaProps> = ({ items }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        width: '200px',
        height: '100px',
        border: '2px dashed #ccc',
        padding: '10px',
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'lightgreen',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default DroppableArea;
