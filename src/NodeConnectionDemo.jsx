import { useState, useRef, useCallback } from 'react';

export default function NodeConnectionDemo() {
  // State for storing all nodes with their positions and dimensions
  const [nodes, setNodes] = useState([
    { id: '1', x: 100, y: 100, width: 100, height: 60 },
    { id: '2', x: 400, y: 200, width: 100, height: 60 },
    { id: '3', x: 700, y: 100, width: 100, height: 60 },
  ]);

  // State for storing all completed connections between nodes
  const [connections, setConnections] = useState([]);
  
  // State for tracking the connection currently being dragged (null when not dragging)
  const [draggingConnection, setDraggingConnection] = useState(null);
  
  // State for tracking the currently selected edge
  const [selectedEdge, setSelectedEdge] = useState(null);
  
  // Ref to the container element for calculating mouse positions
  const containerRef = useRef(null);

  /**
   * Calculate the position of a connection handle for a given node
   * @param {Object} node - The node object containing x, y, width, height
   * @param {string} type - Either 'source' (right side) or 'target' (left side)
   * @returns {Object} Object with x and y coordinates of the handle
   */
  const getHandlePosition = (node, type) => {
    return {
      // Source handle is on the right edge, target handle is on the left edge
      x: type === 'source' ? node.x + node.width : node.x,
      // Both handles are vertically centered
      y: node.y + node.height / 2,
    };
  };

  /**
   * Find if there's a node at the given position (within snap radius of target handle)
   * @param {number} x - Mouse x position
   * @param {number} y - Mouse y position
   * @returns {Object|undefined} The node if found, undefined otherwise
   */
  const getNodeAtPosition = (x, y) => {
    return nodes.find(node => {
      const pos = getHandlePosition(node, 'target');
      // Calculate distance from mouse to target handle using Pythagorean theorem
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      // Return true if within 20px snap radius
      return distance < 20;
    });
  };

  /**
   * Handler for when user clicks on a source handle to start creating a connection
   * @param {MouseEvent} e - The mouse event
   * @param {Object} node - The node whose source handle was clicked
   */
  const handleSourceMouseDown = (e, node) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const rect = containerRef.current.getBoundingClientRect();
    const pos = getHandlePosition(node, 'source');
    
    // Start tracking the connection being dragged
    setDraggingConnection({
      sourceId: node.id,
      sourceX: pos.x, // Fixed start position
      sourceY: pos.y,
      targetX: e.clientX - rect.left, // Current mouse position
      targetY: e.clientY - rect.top,
    });
  };

  /**
   * Handler for mouse movement - updates the dragging connection to follow the mouse
   * @param {MouseEvent} e - The mouse event
   */
  const handleMouseMove = useCallback((e) => {
    if (!draggingConnection || !containerRef.current) return;
    
    // Convert mouse position from screen coordinates to container coordinates
    const rect = containerRef.current.getBoundingClientRect();
    setDraggingConnection(prev => ({
      ...prev,
      targetX: e.clientX - rect.left,
      targetY: e.clientY - rect.top,
    }));
  }, [draggingConnection]);

  /**
   * Handler for mouse release - completes the connection if dropped on a valid target
   * @param {MouseEvent} e - The mouse event
   */
  const handleMouseUp = useCallback((e) => {
    if (!draggingConnection) return;
    
    // Get mouse position in container coordinates
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is over a target handle
    const targetNode = getNodeAtPosition(mouseX, mouseY);
    
    // Only create connection if dropped on a valid target (and not connecting to self)
    if (targetNode && targetNode.id !== draggingConnection.sourceId) {
      setConnections(prev => [...prev, {
        id: `${draggingConnection.sourceId}-${targetNode.id}`,
        sourceId: draggingConnection.sourceId,
        targetId: targetNode.id,
      }]);
    }
    
    // Clear the dragging state
    setDraggingConnection(null);
  }, [draggingConnection, nodes]);

  /**
   * Create an SVG path string for a curved connection line
   * @param {number} sourceX - Starting x coordinate
   * @param {number} sourceY - Starting y coordinate
   * @param {number} targetX - Ending x coordinate
   * @param {number} targetY - Ending y coordinate
   * @returns {string} SVG path string using cubic Bezier curve
   */
  const createPath = (sourceX, sourceY, targetX, targetY) => {
    // Calculate horizontal offset for control points (creates the curve)
    const dx = Math.abs(targetX - sourceX) * 0.5;
    // M = Move to start, C = Cubic Bezier curve with two control points
    return `M ${sourceX},${sourceY} C ${sourceX + dx},${sourceY} ${targetX - dx},${targetY} ${targetX},${targetY}`;
  };

  return (
    // Main container - handles mouse events for dragging connections
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
      onMouseMove={handleMouseMove} // Update connection line as mouse moves
      onMouseUp={handleMouseUp}     // Complete connection on mouse release
    >
      <style>{`
        @keyframes edge-flow {
          to { stroke-dashoffset: -24; }
        }
        .edge-animated {
          stroke-dasharray: 6 6;
          stroke-dashoffset: 0;
          animation: edge-flow 1s linear infinite;
        }
      `}</style>
      {/* SVG layer for rendering all connection lines */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        
        {/* Render all completed connections */}
        {connections.map(conn => {
          // Find the source and target nodes for this connection
          const source = nodes.find(n => n.id === conn.sourceId);
          const target = nodes.find(n => n.id === conn.targetId);
          if (!source || !target) return null;
          
          // Calculate current positions of the handles
          const sourcePos = getHandlePosition(source, 'source');
          const targetPos = getHandlePosition(target, 'target');
          
          return (
            <path
              key={conn.id}
              d={createPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y)}
              className="edge-animated"
              stroke={selectedEdge === conn.id ? "blue" : "black"}
              strokeWidth={selectedEdge === conn.id ? "3" : "2"}
              fill="none"
              onClick={() => setSelectedEdge(conn.id)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Render the connection currently being dragged (if any) */}
        {draggingConnection && (
          <path
            d={createPath(
              draggingConnection.sourceX,
              draggingConnection.sourceY,
              draggingConnection.targetX,
              draggingConnection.targetY
            )}
            className="edge-animated"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        )}
      </svg>

      {/* Render all nodes with their handles */}
      {nodes.map(node => (
        <div key={node.id}>
          {/* The main node box */}
          <div
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: node.width,
              height: node.height,
              border: '1px solid black',
              background: 'white',
            }}
          />
          
          {/* Target handle (left side - where connections end) */}
          <div
            style={{
              position: 'absolute',
              left: node.x - 5,  // Position on left edge
              top: node.y + node.height / 2 - 5,  // Vertically centered
              width: 10,
              height: 10,
              background: 'black',
            }}
          />
          
          {/* Source handle (right side - where connections start) */}
          <div
            onMouseDown={(e) => handleSourceMouseDown(e, node)}
            style={{
              position: 'absolute',
              left: node.x + node.width - 5,  // Position on right edge
              top: node.y + node.height / 2 - 5,  // Vertically centered
              width: 10,
              height: 10,
              background: 'black',
              cursor: 'pointer',
            }}
          />
        </div>
      ))}
    </div>
  );
}
