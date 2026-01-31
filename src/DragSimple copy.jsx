import { useEffect, useRef, useState } from "react"

export default function DragSimple(){
    const [position, setPosition] = useState({x: 100, y: 100})
    const [dragging, setDragging] = useState(false)
    const DragItem = useRef(null)
    const offset = useRef({x: 0, y: 0})
    

    useEffect(()=>{
        const onMove = (e) => {
        if (!dragging) {
            return 
        }
    
        let new_x = e.clientX - offset.current.x
        let new_y = e.clientY - offset.current.y
        
        
        setPosition({
                x: new_x,
                y: new_y
            })

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





    const onMouseDown = (e) => {
    const rectangle = DragItem.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rectangle.left, 
      y: e.clientY - rectangle.top
    }
    
    setDragging(true)
    }



    return (
        <>
            <div 
                onMouseDown={onMouseDown}
                style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                
                }}
                ref={DragItem}
                className="absolute bg-black/90 h-10 w-50 rounded-xl text-white text-xl font-bold flex
                justify-center items-center caret-transparent cursor-pointer select-none">
                <h1>Drag me</h1>
            </div>
        </>
    )
}