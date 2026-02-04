import { useState } from "react";

const INITIAL_TASKS = [
  "Konzept",
  "Bar-Plan",
  "Event-Setup",
  "Musik",
  "Finanzen",
];

export default function Simplest_reorder() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // Move dragged item to hover position
  const reorderTasks = () => {
    if (draggedIndex === null || hoverIndex === null) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(hoverIndex, 0, movedTask);

    setTasks(updatedTasks);
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  return (
    <div style={{ width: 250 }}>
      {tasks.map((task, index) => (
        <div
          key={task}
          draggable
          onDragStart={() => setDraggedIndex(index)}
          onDragOver={(e) => {
            e.preventDefault();
            setHoverIndex(index);
          }}
          onDrop={reorderTasks}
          onDragEnd={() => setHoverIndex(null)}
          style={{
            padding: "10px",
            marginBottom: "6px",
            background: hoverIndex === index ? "#dbeafe" : "#f1f5f9",
            border:
              hoverIndex === index
                ? "2px dashed #3b82f6"
                : "1px solid #cbd5e1",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          {task}
        </div>
      ))}
    </div>
  );
}
