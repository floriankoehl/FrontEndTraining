import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import clickSound from "../assets/click.wav"
import {snap_vertically, snap_horizontally, handleLockedChildPosition, createBezierPath} from "./utils.js"



const audio = new Audio(clickSound)
audio.volume = 0.3; 
// Globals
const sourceSize = 10;
const ROWWIDTH = 15*70;
const ROWHEIGHT = 70;
const BOXHEIGHT = 70;
const BOXWIDTH = 70;

const DAYWIDTH = 70;

export default function Connect() {
  const [boxes, setBoxes] = useState({});
  const [rows, setRows] = useState({});
  const [numTasks, setNumTasks] = useState(4);
  const [numRows, setNumRows] = useState(6);
  const [numCol, setNumCol] = useState(15);
  const [cols, setCols] = useState({});
  const [colHeight, setColHeight] = useState(800);
  const [locked, setLocked] = useState(true);
  const [cursor, setCursor] = useState("default");
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [drag, setDrag] = useState({active: false, startX: 0, startY: 0, x: 0, y: 0});




  






  // initialize Boxes (aka Tasks)
  useEffect(() => {
    const result = {};
    for (let i = 0; i < numTasks; i++) {
      result[i] = {
        main: {
          x: 100,
          y: ROWHEIGHT * i + 200,
          width: BOXWIDTH,
          height: BOXHEIGHT,
        },
        source() {
          return {
            x: this.main.x + this.main.width - sourceSize / 2 - 10,
            y: this.main.y + this.main.height / 2 - sourceSize / 2,
            width: sourceSize,
            height: sourceSize,
            middle_x: this.main.x + this.main.width,
            middle_y: this.main.y + this.main.height / 2,
          };
        },
        target() {
          return {
            x: this.main.x - sourceSize / 2 + 10,
            y: this.main.y + this.main.height / 2 - sourceSize / 2 ,
            width: sourceSize,
            height: sourceSize,
            middle_x: this.main.x,
            middle_y: this.main.y + this.main.height / 2,
          };
        },

        data: {
          parent: 0 + i,
        },
      };
    }
    setBoxes(result);
  }, []);


useEffect(() => {
  setBoxes((prev) => ({
    ...prev,
    [numTasks]: {  // ← Add new box at index numTasks
      main: {
        x: 100,
        y: ROWHEIGHT + 200,
        width: BOXWIDTH,
        height: BOXHEIGHT,
      },
      source() {
        return {
          x: this.main.x + this.main.width - sourceSize / 2 - 10,
          y: this.main.y + this.main.height / 2 - sourceSize / 2,
          width: sourceSize,
          height: sourceSize,
          middle_x: this.main.x + this.main.width,
          middle_y: this.main.y + this.main.height / 2,
        };
      },
      target() {
        return {
          x: this.main.x - sourceSize / 2 + 10,
          y: this.main.y + this.main.height / 2 - sourceSize / 2,
          width: sourceSize,
          height: sourceSize,
          middle_x: this.main.x,
          middle_y: this.main.y + this.main.height / 2,
        };
      },
      data: {
        parent: 0,
      },
    },
  }));
}, [numTasks]);

  // Initialize Rows (aka Groups)
  useEffect(() => {
    const RowsCreated = {};
    for (let i = 0; i < numRows; i++) {
      RowsCreated[i] = {
        x: 100,
        y: ROWHEIGHT * i + 200,
        height: ROWHEIGHT,
        width: ROWWIDTH,
      };
    }
    setRows(RowsCreated);

    const DaysCreated = {};
    for (let i = 0; i < numCol; i++) {
      DaysCreated[i] = {
        x: DAYWIDTH * i + 100,
        y: 200 ,
        height: numRows*ROWHEIGHT,
        width: DAYWIDTH,
      };
    }
    setCols(DaysCreated)

    setColHeight(numRows*ROWHEIGHT)
    
    
  }, [numRows]);

  // Update cursor
  useEffect(() => {
    document.body.style.cursor = cursor;
  }, [cursor]);

  // startDrag
  const startDrag = (e, key) => {
    setDrag({
      source: key,
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
    });

    const move = (e) => {
      setDrag((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const up = (e) => {
      audio.play()
      setDrag({
        active: false,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
      });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // startDraggingBox
  const startDraggingBox = (e, key) => {
    const start_x = e.clientX - boxes[key].main.x;
    const start_y = e.clientY - boxes[key].main.y;

    // Declare tracking variables
    let current_x = boxes[key].main.x;
    let current_y = boxes[key].main.y;

    const onMouseMove = (e) => {
      const new_x = e.clientX - start_x;
      const new_y = e.clientY - start_y;

      const result = handleLockedChildPosition(
        boxes[key].main,
        rows[boxes[key].data.parent],
        new_x,
        new_y,
        locked,
      );

      // Update tracked position INSIDE onMouseMove
      current_x = result[0];
      current_y = result[1];

      setBoxes((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          main: {
            ...prev[key].main,
            x: current_x,
            y: current_y,
          },
        },
      }));
    };

    const onMouseUp = () => {
      let snapped_y = current_y;
      let snapped_x = current_x

      for (let i = 0; i < Object.keys(rows).length; i++) {
        snapped_y = snap_vertically(snapped_y, rows[i].y, rows[i].height);
        if (snapped_y != current_y){
          boxes[key].data.parent = i;
          break
        }
      }

      for (let i = 0; i < Object.keys(cols).length; i ++){
        snapped_x = snap_horizontally(snapped_x, cols[i].x, cols[i].width)
      }

      audio.play()
      setBoxes((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          main: {
            ...prev[key].main,
            x: snapped_x,
            y: snapped_y,
          },
        },
      }));

      // Remove listeners INSIDE onMouseUp
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };










  return (
    <div className="w-screen h-screen bg-gray-200 relative">
      <Button
        onClick={() => {
          setNumTasks(numTasks + 1);
        }}
        variant="contained"
      >
        Add Task
      </Button>
      <Button
        onClick={() => {
          setNumRows(numRows + 1);
        }}
        variant="contained"
      >
        Add Day
      </Button>
      <Button
        onClick={() => {
          setLocked(!locked)
        }}
        variant="contained"
        color="error"
      >
        {locked ? "unlock" : "lock"}
      </Button>

      {/* Days */}
        {Object.entries(cols).map(([key, value])=>{
          return (

            <div 
            className="border-r absolute z-100 pointer-events-none"
            style={{
              top: value.y,
              left: value.x,
              width: value.width,
              height: value.height
            }}
            key={`${key}_day`}>

          </div>
          )
        })}



      {/* Rows */}
      {Object.entries(rows).map(([key, value]) => {
        return (
          <div
            className="absolute border-b rounded bg-white select-none"
            style={{
              top: value.y,
              left: value.x,
              width: value.width,
              height: value.height,
            }}
            key={`${key}_of_${value}`}
          ></div>
        );
      })}


      {/* Boxes & Connections */}
      {Object.values(boxes).map((box, i) => (
        <div key={`${i}_container`}>
          {/* Main */}
          <div
            key={`${i}_main`}
            onMouseDown={(e) => {
              startDraggingBox(e, i);
            }}
            className="absolute  select-none p-3"
            style={{
              left: box.main.x,
              top: box.main.y,
              width: box.main.width,
              height: box.main.height,
            }}
          >
            <div className="h-full w-full bg-gray-200 rounded-xl">

            </div>
          </div>

          {/* Source */}
          <div
            key={`${i}_source`}
            onMouseDown={(e) => {
              startDrag(e, i);
            }}
            onMouseEnter={() => setCursor("crosshair")}
            onMouseLeave={() => setCursor("default")}
            className="absolute bg-black rounded-full select-none"
            style={{
              width: box.source().width,
              height: box.source().height,
              left: box.source().x,
              top: box.source().y,
            }}
          ></div>

          {/* Target */}
          <div
            key={`${i}_target`}
            onMouseEnter={() => setCursor("crosshair")}
            onMouseLeave={() => setCursor("default")}
            onMouseUp={(e) => {
              if (drag.active) {
                setConnections((prev) => {
                  return [...prev, { source: drag.source, target: i }];
                });
              }
            }}
            className="absolute bg-black rounded-full select-none"
            style={{
              width: box.target().width,
              height: box.target().height,
              left: box.target().x,
              top: box.target().y,
            }}
          ></div>
        </div>
      ))}


      {/* SVG Animation */}
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

      {/* SVG Overlay */}
      <svg
        className="absolute inset-0 pointer-events-none select-none"
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      >
        {connections.map((item) => {
          const connectionId = `${item.source}_to_${item.target}`;
          return (
            <path
              key={connectionId}
              d={createBezierPath(
                boxes[item.source].source().middle_x,
                boxes[item.source].source().middle_y,
                boxes[item.target].target().middle_x,
                boxes[item.target].target().middle_y,
              )}
              className="edge-animated"
              stroke={selectedConnection === connectionId ? "#3b82f6" : "black"}
              fill="none"
              strokeWidth="3"
              onClick={() => setSelectedConnection(connectionId)}
              style={{ cursor: "pointer", pointerEvents: "stroke" }}
            />
          );
        })}

        {drag.active && (
          <path
            d={`M ${drag.startX} ${drag.startY} L ${drag.x} ${drag.y}`}
            className="edge-animated"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
