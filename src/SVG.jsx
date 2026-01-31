import { useEffect, useState } from "react";

export default function SVG() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const offset = 100

  const handleMove = (e) => {
    console.log("e: ", e);
    setMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <div className="h-screen w-screen bg-blue-200">
        <svg
          viewBox={`0 0 ${mouse.x} ${mouse.y}`}
          style={{
            width: `${mouse.x}px`,
            height: `${mouse.y}px`,
          }}
          className="bg-red-200"
        >
          <path
            // d={`M 0 0
            //     L ${mouse.x} ${mouse.y}`}

            d={`M ${offset}  ${offset}
      C ${mouse.x / 2} 0,
        ${mouse.x / 2} ${mouse.y},
        ${mouse.x} ${mouse.y}`}
        fill="none"
            stroke="black"
            strokeWidth="4"
          />
        </svg>
      </div>
    </>
  );
}
