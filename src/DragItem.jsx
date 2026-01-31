import { useEffect, useRef, useState } from "react"


export default function DragItem({border, parentRef}){
    // top_boundary, bottom_boundary, left_boundary, right_boundary
    const [color, setColor] = useState("black")

    const DragItem = useRef(null)
    const [dragItemData, setDragItemData] = useState(null)
    const offset = useRef({x: 0, y: 0})
    const [position, setPosition] = useState({x: 0, y: 0})
    const [dragging, setDragging] = useState(false)

    const [parent, setParent] = useState(null)




//   Inital Mound Parent Loading
    useEffect(()=>{
        if (!parentRef?.current) return

        const parent = parentRef.current.getBoundingClientRect()
        console.log("INSIDE DRAG ITEM AND GOT ELEMENT", parent)
        setParent(parent)

        const DragitemData_Load = DragItem.current.getBoundingClientRect();
        setDragItemData(DragitemData_Load)
        console.log("this item", DragitemData_Load)
    }, [])



    const move_Item_in_border = (new_x, new_y, top_boundary, bottom_boundary, left_boundary, right_boundary) => {
            console.log(`left : ${top_boundary}, right : ${bottom_boundary}, top : ${left_boundary}, bottom : ${right_boundary}`)
            console.log("data of dragitem", dragItemData)
            console.log("Parent here ready: ", parent)

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



    // Main Movement funcitonality
    useEffect(()=>{
    const onMove = (e) => {
    if (!dragging) {
        return 
    }

    let new_x = e.clientX - offset.current.x
    let new_y = e.clientY - offset.current.y
    const left = parent.left
    const right = parent.right
    const bottom = parent.bottom 
    const top = parent.top



    move_Item_in_border(new_x, new_y, top, bottom, left, right)

    }


    const onUp = (e) => {
        setDragging(false)       
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


    // const lockParent = () => {
    //     setBorder(!border)
    // }



  return (
    <>
     

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


   
    </>
  )
}




































