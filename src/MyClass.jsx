import { useEffect, useRef, useState } from "react"
import Button from '@mui/material/Button';
import { width } from "@mui/system";







export default function MyClass(){
    const [boxes, setBoxes] = useState({0: {x: 0, y: 0, width: 100, height: 100}})
    const containerRef = useRef(null)
    const boxesRef = useRef(boxes)
    const [resize, setResize] = useState(false)


    useEffect(() => {
        boxesRef.current = boxes
    }, [boxes])



    const handleMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const currentBoxes = boxesRef.current
        const box = currentBoxes[0]

        

        console.log("CHEKCING")
        if (
                mouseX > box.x + box.width - 10 &&
                mouseX < box.x + box.width && 
                mouseY > box.y &&
                mouseY < box.y + box.height && 
                e.ctrlKey
            ) {
                document.body.style.cursor = "e-resize"
                setResize(true)
            } else {
                document.body.style.cursor = "default"
                setResize(false)
            }

    }

     useEffect(() => {

        document.addEventListener("mousemove", handleMove)
        return () => document.removeEventListener("mousemove", handleMove)
        }, [])



    const onMouseDown = (key, e) => {
        console.log("E", e)
        e.preventDefault()
        const startWidth = boxes[key].width


        const startX = e.clientX - boxes[key].x
        const startY = e.clientY - boxes[key].y
        console.log("offset: ", startX, startY)

        console.log("Calling this")



        const onMouseMove = (e) => {
            const new_x = e.clientX - startX
            const new_y = e.clientY - startY
            

            if (!e.ctrlKey) {
                setBoxes(prev => {
                const box = prev[key]
                const deltaX = e.clientX - startX
                const new_width = startWidth + deltaX




                return {
                    ...prev,
                    [key]: { ...box, x: new_x, y: new_y, width: new_width }
                }
            })
            } 

            if (resize) {
                setBoxes(prev => {
                    const box = prev[key]
                    const deltaX = e.clientX - startX
                    const new_width = startWidth + deltaX

                return {
                    ...prev,
                    [key]: { ...box, width: new_width }
                }
            })
            }
            
            











            
        }


        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)


        



    }





    return (
        <>
            <div 
            
            className="h-screen w-screen flex justify-center items-center p-20">
                <div 
                ref={containerRef}
                className="h-full w-full bg-gray-200 relative">
                    <div 
                    onMouseDown={(e)=>{onMouseDown(0, e)}}
                    className="bg-black absolute"
                    style={{
                        top: `${boxes[0].y}px`,
                        left: `${boxes[0].x}px`,
                        width: `${boxes[0].width}px`,
                        height: `${boxes[0].height}px`,

                    }}
                    >

                    </div>
                </div>
                
            </div>
        </>
    )
}









