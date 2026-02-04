// Import React hooks: useState for state management, useRef for persistent mutable refs
import { useState, useRef } from "react";

// Array of initial task names to be rendered in the draggable list
const INITIAL_TASKS = [
  "Konzept",
  "Bar-Plan",
  "Event-Setup",
  "Musik",
  "Finanzen",
];


const TASKWIDTH = 200
const TASKHEIGHT = 100

const updated_tasks = INITIAL_TASKS.map((task, index)=>{
    return ({
        ...task, 
        position: {
            x: 0,
            y: 100 * index, 
            height: TASKHEIGHT,
            width: TASKWIDTH
        }
    })
})

// Height constant for each list item in pixels
const ITEM_HEIGHT = 44;

/**
 * Prototype Component
 * A draggable list component that allows reordering items by drag-and-drop.
 * Features insertion line preview and floating dragged item indicator.
 * @returns {JSX.Element} The rendered draggable list component
 */
export default function Prototype() {
  // State: Array of task items in current order
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  // State: Index of the item currently being dragged (null if nothing being dragged)
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // State: Index where the item will be inserted when dropped (null if not hovering)
  const [insertIndex, setInsertIndex] = useState(null);
  
  // State: Current position of the mouse during drag (object with x, y coordinates)
  const [dragPosition, setDragPosition] = useState(null);

  // Ref: Reference to the list container DOM element
  const listRef = useRef(null);

  /**
   * Handles the mouse down event when user starts dragging an item
   * @param {React.MouseEvent} event - The mouse down event object
   * @param {number} index - The index of the task being dragged
   */
  const handleMouseDown = (event, index) => {
    // Set which item is being dragged
    setDraggedIndex(index);
    
    // Initialize insertion index to current position
    setInsertIndex(index);
    
    // Store initial mouse position
    setDragPosition({ x: event.clientX, y: event.clientY });
  };

  /**
   * Handles the mouse move event during dragging to update drop position
   * @param {React.MouseEvent} event - The mouse move event object
   */
  const handleMouseMove = (event) => {
    // Exit early if not currently dragging or list ref is not available
    if (draggedIndex === null || !listRef.current) return;

    // Get the Y coordinate of the list container's top edge relative to viewport
    const listTop = listRef.current.getBoundingClientRect().top;
    
    // Calculate the mouse position relative to the list container (not viewport)
    const mouseY = event.clientY - listTop;

    // Update the current drag position for the floating item
    setDragPosition({ x: event.clientX, y: event.clientY });

    // Calculate which item index the mouse is hovering over based on item height
    const rawIndex = Math.floor(mouseY / ITEM_HEIGHT);
    
    // Clamp the calculated index to valid range (0 to tasks.length inclusive)
    setInsertIndex(
      Math.max(0, Math.min(tasks.length, rawIndex))
    );
  };

  /**
   * Handles the mouse up event when user releases the dragged item
   * Performs the actual reordering of tasks
   */
  const handleMouseUp = () => {
    // Exit early if no item was being dragged or insert position is invalid
    if (draggedIndex === null || insertIndex === null) return;

    // Create a copy of the tasks array to avoid mutating state
    const updatedTasks = [...tasks];
    
    // Remove the dragged item from its original position and store it
    const [movedTask] = updatedTasks.splice(draggedIndex, 1);

    /**
     * Adjust the final insertion index:
     * If inserting after the original position, subtract 1 because we already removed the item
     * If inserting before, keep the same index
     */
    const finalIndex =
      insertIndex > draggedIndex ? insertIndex - 1 : insertIndex;

    // Insert the item at its new position
    updatedTasks.splice(finalIndex, 0, movedTask);

    // Update state with reordered tasks
    setTasks(updatedTasks);
    
    // Reset all drag state
    setDraggedIndex(null);
    setInsertIndex(null);
    setDragPosition(null);
  };

  return (
    // List container: captures all mouse events for drag handling
    <div
      ref={listRef} // Attach ref to measure position and dimensions
      onMouseMove={handleMouseMove} // Track mouse movement during drag
      onMouseUp={handleMouseUp} // Handle drop/release
      style={{ width: 250, position: "relative", userSelect: "none" }}
    >
      {/* Render each task item in the list */}
      {tasks.map((task, index) => (
        <div key={task}>
          {/* Insertion line shown above item when hovering to insert before */}
          {insertIndex === index && draggedIndex !== null && (
            <div
              style={{
                height: 4, // Thin line to indicate insertion point
                background: "#3b82f6", // Blue color
                borderRadius: 2,
                margin: "4px 0",
              }}
            />
          )}

          {/* Individual task item container */}
          <div
            // Start drag when user presses mouse down on this item
            onMouseDown={(e) => handleMouseDown(e, index)}
            style={{
              height: ITEM_HEIGHT, // Fixed height for consistency
              padding: "10px", // Internal spacing
              marginBottom: "4px", // Spacing between items
              background: "#f1f5f9", // Light gray background
              border: "1px solid #cbd5e1", // Subtle border
              // Hide the item while dragging (replaced by floating version)
              visibility:
                draggedIndex === index ? "hidden" : "visible",
              cursor: "grab", // Visual indicator that item can be dragged
            }}
          >
            {/* Display the task name */}
            {task}
          </div>
        </div>
      ))}

      {/* Insertion line shown at the end of list when hovering after last item */}
      {insertIndex === tasks.length && draggedIndex !== null && (
        <div
          style={{
            height: 4, // Thin line
            background: "#3b82f6", // Blue color
            borderRadius: 2,
            marginTop: 4,
          }}
        />
      )}

      {/* Floating visual representation of the dragged item */}
      {draggedIndex !== null && dragPosition && (
        <div
          style={{
            position: "fixed", // Use fixed positioning to follow cursor
            // Center the item horizontally under cursor (240px width / 2 = 120px)
            left: dragPosition.x - 120,
            // Position vertically with item centered on cursor (ITEM_HEIGHT / 2 = 22px)
            top: dragPosition.y - ITEM_HEIGHT / 2,
            width: 240, // Item width
            padding: "10px", // Internal spacing
            background: "#e0f2fe", // Light blue background
            border: "2px solid #3b82f6", // Blue border
            pointerEvents: "none", // Allow mouse events to pass through
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)", // Drop shadow for depth
            opacity: 0.9, // Slightly transparent
          }}
        >
          {/* Display the name of the dragged item */}
          {tasks[draggedIndex]}
        </div>
      )}
    </div>
  );
}
