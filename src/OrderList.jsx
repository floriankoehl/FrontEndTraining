import { useEffect, useRef, useState } from "react"
import Button from '@mui/material/Button';



export default function OrderList(){

  // The Drag Item
  const DragRef = useRef(null)
  const offset = useRef({x:0, y:0})
  const [position, setPosition] = useState({x:0,y:0})
  const [dragging, setDragging] = useState(false)
  const [color, setColor] = useState("#001b36")


  // One Parent container
  const boxRef = useRef(null)
  const [box, setBox] = useState({x: 200, y: 200, width: 250, height: 120})

  const boxRef2 = useRef(null)
  const [box2, set2Box] = useState({x: 200, y: 400, width: 250, height: 120})


  // const listref = useRef(null)
  // const list_elements_map = {
  //   // 1: {x: 500, y: 200, width: 250, height: 120},
  //   // 2: {x: 500, y: 400, width: 250, height: 120},
  //   // 3: {x: 500, y: 600, width: 250, height: 120},
  // }

  const [list_elements_map, setListElementsMap] = useState({})

  const [elementHeight, setElementHeight] = useState(80)
  const [elementGap, setElementGap] = useState(10)
  const [numElements, setNumElements] = useState(5)



   useEffect(()=>{
    const map = {} 
    
    for (let i = 0; i < numElements; i ++ ){
      map[i] = {x: 500, y: 200 + i*(elementHeight+elementGap), width: 250, height: elementHeight}
     }

    
     setListElementsMap(map)




   },[elementHeight, elementGap, numElements])





   const snap_to_box = (setPositionFunction, childRect, parentRect) => {
      
      // console.log("____INSIDE SNAP TO BOX FUNCTION____")
      // console.log("Child rect: ", childRect)
      // console.log("Parent rect: ", parentRect)

      setPositionFunction({
        x: parentRect.x,
        y: parentRect.y
      })
   }


   const snap_evaluation = (childRect, parentRect) => {
      // const childRect = childref.current.getBoundingClientRect();
      // const parentRect = parentref.current.getBoundingClientRect();

      // console.log("____INSIDE SNAP EVALUATION FUNCTION____")
      // console.log("Child rect: ", childRect)
      // console.log("Parent rect: ", parentRect)


      if (childRect.x + childRect.width/2 < parentRect.x) {
        // console.log("____________LEFT NO_____________")
        return false
      }
      if (childRect.y + childRect.height/2 < parentRect.y) {
        // console.log("____________TOP NO_____________")
        return false
      }
      if (childRect.x + childRect.width/2 > parentRect.x + parentRect.width) {
        // console.log("____________RIGHT NO_____________")
        return false
      }
      if (childRect.y + childRect.height/2 > parentRect.y + parentRect.height) {
        // console.log("____________BOTTOM NO_____________")
        return false
      }


      return true

   }


  useEffect(()=>{


    const MovingMouse = (e) => {
      if (!dragging) return

      const new_x = e.clientX - offset.current.x;
      const new_y = e.clientY - offset.current.y

      setPosition({
        x: new_x,
        y: new_y
    })

    }
    
    const onUp = (e) => {
      setColor("#001b36")
      setDragging(false)

      const childRect = DragRef.current.getBoundingClientRect();
      const box = boxRef.current.getBoundingClientRect();
      const box2 = boxRef2.current.getBoundingClientRect();

      
      if (snap_evaluation(childRect, box)) {
        snap_to_box(setPosition, childRect, box)
      }
      if (snap_evaluation(childRect, box2)) {
        snap_to_box(setPosition, childRect, box2)
      }


      for (const key in list_elements_map) {
        // console.log(key, list_elements_map[key])
        // console.log("evaluating here: ", snap_evaluation(childRect, list_elements_map[key]))
        if (snap_evaluation(childRect, list_elements_map[key])) {
          // console.log("COULD SNAP HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
          snap_to_box(setPosition, childRect, list_elements_map[key])
        }
      }
      
    }


    window.addEventListener("mouseup", onUp)
    window.addEventListener("mousemove", MovingMouse)
    return () => {
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("mousemove", MovingMouse)
    }

  },[dragging])




  const onMouseDown = (e) => {
    const rect = DragRef.current.getBoundingClientRect();

    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    // console.log("Current offset: ", offset.current)
    

    setColor("#003366")
    setDragging(true)
  }


  return (
    <>
      <div className="h-screen w-screen bg-gray-200 flex justify-center items-center p-10 relative">
        <div className="h-full w-full bg-white rounded-xl">
          <Button onClick={()=>{setNumElements(numElements+1)}} variant="contained">Add</Button>
          <Button onClick={()=>{setNumElements(numElements-1)}} variant="contained">Remove</Button>
          <h1>{numElements}</h1>
          {/* List */}
          {/* <div
          className="bg-blue-200 absolute"
          style={{
            left: `${list_elements_map.global.x}px`,
            top: `${list_elements_map.global.y}px`,
            width: `${list_elements_map.global.width}px`,
            height: `${list_elements_map.global.height}px`
          }}
          > */}
            {Object.entries(list_elements_map)
            .filter(([key]) => key !== "global")
            .map(([key, value]) => (
              <div 
              key={key}
              className="bg-gray-400 absolute"
              style={{
                left: `${value.x}px`,
                top: `${value.y}px`,
                width: `${value.width}px`,
                height: `${value.height}px`

              }}
              
              >
                
                
              </div>
            ))}

        


          {/* </div> */}




          {/* Box */}
          <div 
          ref={boxRef}
          className="bg-red-200 absolute"
          style={{
            top: `${box.y}px`,
            left: `${box.x}px`,
            width: `${box.width}px`,
            height: `${box.height}px`
          }}
          
          >

          </div>


          {/* Box 2*/}
          <div 
          ref={boxRef2}
          className="bg-red-200 absolute"
          style={{
            top: `${box2.y}px`,
            left: `${box2.x}px`,
            width: `${box2.width}px`,
            height: `${box2.height}px`
          }}
          
          >

          </div>











          {/* Draggable Item */}
          <div
          className="absolute h-20 w-50 bg-black roundedxl text-white 
          font-bold text-xl rounded-xl flex justify-center items-center
          caret-transparent cursor-pointer select-none"
          ref={DragRef}
          onMouseDown={onMouseDown}
          style={{
            backgroundColor: `${color}`,
            top: `${position.y}px`,
            left: `${position.x}px`
            
          }}
          >
            Drag me
          </div>

          
          
          
        </div>
      </div>
    </>
  )
}