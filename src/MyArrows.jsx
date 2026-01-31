import { useEffect, useState } from "react";

export default function MyArrows() {
  const [boxes, setBoxes] = useState({});
  const [handCursor, setHandCursor] = useState("default");
  const [svgData, setSvgData] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const source_width = 15;
  const source_height = 15;

  useEffect(() => {
    const DynamicBoxes = {};
    for (let i = 0; i < 3; i++) {
      DynamicBoxes[i] = {
        main: {
          x: 100 + 100 * i + i * 50,
          y: 100 + 100 * i,
          width: 100,
          height: 100,
        },
        source() {
          return {
            x: this.main.width - source_width / 2,
            y: this.main.height / 2 - source_height / 2,
            width: source_width,
            height: source_width,
          };
        },
        target() {
          return {
            x: 0 - source_width / 2,
            y: this.main.height / 2 - source_height / 2,
            width: source_width,
            height: source_width,
          };
        },
      };
    }
    setBoxes(DynamicBoxes);
  }, []);

  useEffect(() => {
    document.body.style.cursor = handCursor;
  }, [handCursor]);

  const onMouseDown = (e, key) => {
    console.log("catching mousedown ");
    const startX = e.clientX
    const startY = e.clientY

    console.log("Start in these positions: ", startX, startY)

    setSvgData((prev)=>{
        return ({
            ...prev, 
            x: startX,
            y: startY
        })
    })


    let lastX = startX
let lastY = startY

const onMouseMove = (e) => {
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY

  lastX = e.clientX
  lastY = e.clientY

  setSvgData(prev => ({
    ...prev,
    width: prev.width + dx,
    height: prev.height + dy,
  }))
}




    const onMouseUp = () => {
      console.log("Catching mouse up");

      setSvgData({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });


      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };







    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      <div className="h-screen w-screen bg-gray-200">
        {Object.entries(boxes).map(([key, value]) => {
          return (
            <div key={`${key}_container`}>
              <div
                key={`${key}_main`}
                className="bg-green-500 absolute"
                style={{
                  top: `${boxes[key].main.y}px`,
                  left: `${boxes[key].main.x}px`,
                  width: `${boxes[key].main.width}px`,
                  height: `${boxes[key].main.height}px`,
                }}
              >
                <div
                  onMouseDown={(e) => {
                    onMouseDown(e, key);
                  }}
                  onMouseOver={() => {
                    setHandCursor("crosshair");
                  }}
                  onMouseLeave={() => {
                    setHandCursor("default");
                  }}
                  className="bg-black absolute rounded-full select-none"
                  style={{
                    top: `${boxes[key].source().y}px`,
                    left: `${boxes[key].source().x}px`,
                    width: `${boxes[key].source().width}px`,
                    height: `${boxes[key].source().height}px`,
                  }}
                  key={`${key}_source`}
                ></div>
                <div
                  className="bg-black absolute rounded-full select-none"
                  style={{
                    top: `${boxes[key].target().y}px`,
                    left: `${boxes[key].target().x}px`,
                    width: `${boxes[key].target().width}px`,
                    height: `${boxes[key].target().height}px`,
                  }}
                  key={`${key}_target`}
                ></div>
              </div>
            </div>
          );
        })}
        <svg
          className="bg-green-200 absolute"
          style={{
            top: `${svgData.y}px`,
            left: `${svgData.x}px`,
            width: `${svgData.width}px`,
            height: `${svgData.height}px`,
          }}
        //   viewBox={`${svgData.x} ${svgData.y} ${svgData.width} ${svgData.height}`}
          viewBox={`0 0 100 100`}
        >
            <path
            d={`M ${svgData.x/100} ${svgData.y/100} L ${svgData.width/100} ${svgData.height}`}
            stroke="black"
            strokeWidth="4"
            />



        </svg>
        
      </div>
    </>
  );
}
