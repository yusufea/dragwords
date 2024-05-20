import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React from "react";

const Droppable = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });

  const droppableStyle = {
    padding: "20px 10px",
    border: "1px solid black",
    borderRadius: "5px",
    minWidth: "200px",
    minHeight: "100px",
  };

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      {id === "group2" ? (
        <div>
          <div
            className={`flex gap-4 ${id === "group2" ? "" : ""}`}
            ref={setNodeRef}
            style={droppableStyle}
          >
            {items.map((item) => (
              <SortableItem key={item} id={item} />
            ))}
            {/* <div class="w-full bg-gray-200 h-24 rounded-xl"></div> */}
          </div>
        </div>
      ) : (
        <div
          className={`flex gap-4 ${id === "group2" ? "" : ""}`}
          ref={setNodeRef}
          style={droppableStyle}
        >
          {items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </div>
      )}
    </SortableContext>
  );
};

export default Droppable;
