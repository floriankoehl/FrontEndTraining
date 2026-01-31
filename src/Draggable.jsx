import { useEffect, useRef, useState } from "react"
import Button from '@mui/material/Button';

export default function DragItem(){
    const [color, setColor] = useState("black")

  const DragItem = useRef(null)
  const [dragItemData, setDragItemData] = useState(null)
  const offset = useRef({x: 0, y: 0})
  const [position, setPosition] = useState({x: 0, y: 0})
  const [dragging, setDragging] = useState(false)


  const parent = useRef(null)
  const [parentData, setParentData] = useState(null)
  const [border, setBorder] = useState(false)



//   Inital Mound Parent Loading
    useEffect(()=>{
        const parentItem = parent.current.getBoundingClientRect();
        setParentData(parentItem)
        console.log("parent data: ", parentItem)

        const DragitemData_Load = DragItem.current.getBoundingClientRect();
        setDragItemData(DragitemData_Load)
        console.log("this item", DragitemData_Load)
    }, [])



   const move_Item_in_border = (new_x, new_y, border_activated, top_boundary, bottom_boundary, left_boundary, right_boundary) => {
        if (border) {
        if (new_x < left_boundary) {
        new_x = left_boundary;
        }
        if (new_y < top_boundary) {
            new_y = top_boundary
        }
        if (new_x + dragItemData.width > right_boundary) {
            new_x = right_boundary - dragItemData.width
        }
        if (new_y + dragItemData.height > bottom_boundary) {
            new_y = bottom_boundary - dragItemData.height
        }
    }
    
      setPosition({
        x: new_x,
        y: new_y
      })
    }


    const should_be_snapped = (rect, top_boundary, bottom_boundary, left_boundary, right_boundary) => {
        // mid_x, mid_y, top_boundary, bottom_boundary, left_boundary, right_boundary
        
        console.log(rect)

        if (rect.left + rect.width/2 < left_boundary) {
            setColor("black")
            console.log("NOT INSIDE")
            return false
        }
        if (rect.top + rect.height/2< top_boundary) {
            setColor("black")
            console.log("NOT INSIDE")
            return false
        }
        if (rect.left + rect.width/2> right_boundary) {
            setColor("black")
            console.log("NOT INSIDE")
            return false
        }
        if (rect.top + rect.height/2 > bottom_boundary) {
            setColor("black")
            console.log("NOT INSIDE")
            return false
        }

        console.log("IS INSIDE*LIIOSDAIOH")
        console.log("IS INSIDE*LIIOSDAIOH")
        console.log("IS INSIDE*LIIOSDAIOH")
        console.log("IS INSIDE*LIIOSDAIOH")
        console.log("IS INSIDE*LIIOSDAIOH")
        console.log("IS INSIDE*LIIOSDAIOH")
        setColor("gray")
        return true
    }



// Main Movement funcitonality
    useEffect(()=>{
    const onMove = (e) => {
      if (!dragging) {
        return 
      }



        let new_x = e.clientX - offset.current.x
        let new_y = e.clientY - offset.current.y

        //   console.log("Parent data: ", parentData)
        const top_boundary = parentData.top
        const bottom_boundary = parentData.bottom
        const left_boundary = parentData.left
        const right_boundary = parentData.right
    //   console.log(`top: ${top_boundary}, bottom: ${bottom_boundary}, left; ${left_boundary}, right: ${right_boundary}`)
      
        move_Item_in_border(new_x, new_y, border, top_boundary, bottom_boundary, left_boundary, right_boundary)
        // should_be_snapped(top_boundary, bottom_boundary, left_boundary, right_boundary)
    }


    const onUp = (e) => {
        setDragging(false)
        const rect = DragItem.current.getBoundingClientRect();

        
        const top_boundary = parentData.top
        const bottom_boundary = parentData.bottom
        const left_boundary = parentData.left
        const right_boundary = parentData.right

        let new_x = e.clientX - offset.current.x
        let new_y = e.clientY - offset.current.y

        if (should_be_snapped(rect, top_boundary, bottom_boundary, left_boundary, right_boundary)) {
            move_Item_in_border(new_x, new_y, true, top_boundary, bottom_boundary, left_boundary, right_boundary)
        }
        
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    }, [dragging])



//   updates offset
    const onMouseDown = (e) => {
    const rectangle = DragItem.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rectangle.left, 
      y: e.clientY - rectangle.top
    }
    
    setDragging(true)
    }


    const lockParent = () => {
        setBorder(!border)
    }



  return (
    <>
      <div className="h-screen w-screen bg-gray-200 relative flex justify-center items-center">

        {/* Parent Container */}
        <div 
        className="h-200 w-200 bg-blue-200 rounded-xl relative"
        ref={parent}>
        <Button 
         style={{
           backgroundColor: `${border ? "red" : "blue"}`
         }}
         onClick={()=>{lockParent()}}
         variant="contained">
           {border ? "Locked" : "Free"}

        </Button>
        </div>



        {/* Draggable Item */}
        <div 
        onMouseDown={onMouseDown}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          backgroundColor: `${color}`
        }}
        ref={DragItem}
        className="absolute bg-black/90 h-10 w-50 rounded-xl text-white text-xl font-bold flex
        justify-center items-center caret-transparent cursor-pointer select-none">
          <h1>Drag me</h1>
        </div>


      </div>
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