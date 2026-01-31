import { useEffect, useRef, useState } from "react"

import DragItem from "./DragItem"
import ParentItem from "./ParentItem"
import DragSimple from "./DragSimple"
// import Sorted_list from "./Sorted_list"
import OrderList from "./OrderList"
import Arrow from "./Arrow"
import NodeConnectionDemo from "./NodeConnectionDemo"
import New from "./New"
import Objects from "./Objects"
import MyClass from "./MyClass"
import Resize from "./Resize"
import MyArrows from "./MyArrows"
import SVG from "./SVG"
import Connect from "./sophisticated/Connect"


export default function App(){
  // const [border, setBorder] = useState(false)
  // const parentRef = useRef(null)
  // const [parentData, setParentData] = useState(null)

  // useEffect(()=>{
  //   const parent_loader = parentRef.current.getBoundingClientRect();
  //   // console.log("IJMPRJOIHIUHKJADHSF", parent_loader)
  //   setParentData(parent_loader)
  // }, [])

  return (
      <>
        {/* <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
          
          <ParentItem parentRef={parentRef} setBorder={setBorder} border={border}/>

          {parentData && (
            <DragItem
              border={border}
              top_boundary={parentData.top}
              bottom_boundary={parentData.bottom}
              left_boundary={parentData.left}
              right_boundary={parentData.right}
              
            />
          )}
          
          {parentData && (
            <DragItem
              border={border}
              parentRef={parentRef}
              
            />
          )} */}

        {/* <NodeConnectionDemo /> */}
          {/* <div
          style={{
            backgroundColor:"#ffef94e3"
          }}
          ></div>
        {/* <div>
          {/* <OrderList/> */}
          {/* <New color={"#ffef94e3"} /> */}
          {/* <New color={"#ffef94e3"} y_offset={100}/>
          
          <New color={"#94ffede3"} y_offset={300}/>
          <New color={"#e694ffe3"} y_offset={400}/>
          <New color={"#ff94bde3"} y_offset={500}/>
          <New color={"#a6ff94e3"} y_offset={200} />  */}
          {/* <Objects/> */}
          {/* <MyArrows/> */}
          <Connect/>
          {/* <SVG/> */}
          {/* <MyClass/> */}
          
    
        
      </>
  )
}








































// import { useEffect, useRef, useState } from "react"
// import Button from '@mui/material/Button';


// export default function App(){
//   const [border, setBorder] = useState(false)
//   const [backColorButton, setBackColorButton] = useState("blue")
//   const [dragging, setDragging] = useState(false);
//   const [mouse, setMouse] = useState({x: 0, y: 0})
//   const DragItem = useRef(null)
//   const offset = useRef({x: 0, y: 0})
//   const [position, setPosition] = useState({x: 200, y: 200})
//   const Parent = useRef(null)
//   const [parentPosition, setParentPosition] = useState(null)
//   const Parent_2 = useRef(null)
//   const [parentPosition_2, setParentPosition_2] = useState(null)

//   useEffect(()=> {
//     const parent_position = Parent.current.getBoundingClientRect();
//     setParentPosition(parent_position)

//     const parent_position_2 = Parent_2.current.getBoundingClientRect();
//     setParentPosition_2(parent_position_2)
//   }, [])





//   const update_position_under_constraint = (rect, new_x, new_y, parent) => {
//       if (border) {
//         if (new_x < parent.left) {
//           // console.log("NOT POSSIBLE!!!!!!!!!\n\n!!")
//           new_x = parent.left;
//         }
//         if (new_y < parent.top) {
//           new_y = parent.top
//         }
//         if (new_x + rect.width > parent.right) {
//           new_x = parent.right - rect.width
//         }
//         if (new_y + rect.height > parent.bottom) {
//           new_y = parent.bottom - rect.height
//         }
//       }
//       setPosition({
//         x: new_x,
//         y: new_y
//       });
//   }



//   useEffect(()=>{
//     const rect = DragItem.current.getBoundingClientRect();
//     console.log("rectangle information: ", rect)

//     const onMove = (e) => {
//       if (!dragging) return;


//       // console.log("Should be the mouse", e.clientX)
//       // console.log("Left border: ", parentPosition.left)
//       let new_x = e.clientX - offset.current.x;
//       let new_y = e.clientY - offset.current.y;

//       // console.log("Right position", rect.right)
//       // console.log("Right border", parentPosition.right)
//       // console.log("")
//       // console.log("")


//       if (rect.top + rect.height/2 > parentPosition.bottom) {
//         console.log("Should be right")
//         const this_parrent = parentPosition_2
//         update_position_under_constraint(rect, new_x, new_y, this_parrent)
//       } else {
//         console.log("left")
//         const this_parrent = parentPosition
//         update_position_under_constraint(rect, new_x, new_y, this_parrent)
//       }



      
//     }

//     const onUp = () => {setDragging(false)}

//     window.addEventListener("mousemove", onMove)
//     window.addEventListener("mouseup", onUp)

//     return () => {
//       window.removeEventListener("mousemove", onMove),
//       window.removeEventListener("mouseup", onUp)
//     }

//   }, [dragging])
























//   const onMouseDown = (e) => {
//       const rect = DragItem.current.getBoundingClientRect();
//       offset.current = {
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top
//       };
//       setDragging(true);
//     } 




//   return (
//     <>
//       <div 
      
//       className="h-screen w-screen p-30 bg-gray-200">
//         <Button 
//         style={{
//           backgroundColor: `${border ? "red" : "blue"}`
//         }}
//         onClick={()=>{setBorder(!border)}}
//         variant="contained">
//           {border ? "Locked" : "Free"}

//         </Button>
//         <div className="w-full h-full flex flex-col">
//             <div 
//           ref={Parent}
//           className="h-20 w-full bg-white rounded-xl">
              
//           </div>


//           <div 
//           className="h-20 w-full bg-green-200 rounded-xl"
//           ref={Parent_2}>

//           </div>
//         </div>
        









//         <div className="h-20 w-50 bg-black rounded-xl text-white flex justify-center items-center caret-transparent cursor-pointer select-none" 
//           ref={DragItem}
//           onMouseDown={onMouseDown}
//           style={{
//             position: "absolute",
//             left: `${position.x}px`,
//             top: `${position.y}px`
//           }}
          
//           >
//             Draggable
//           </div>
        
//       </div>
//     </>
//   )
// }