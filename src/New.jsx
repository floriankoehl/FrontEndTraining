import { useEffect, useRef, useState } from "react"

const initial_nodes = ["first", "second", "third", "fourth"]

export default function New({color, y_offset, fixed=true}){
    const [pixelMap, setPixelMap] = useState({})
    const [nodes, setNodes] = useState(initial_nodes)
    const box = useRef(null)
    const total_padding = 0;
    

    useEffect(() => {
    const newPixelMap = {}
    for (let i = 0; i < nodes.length; i++) {
        newPixelMap[nodes[i]] = {x: 100 * i, y: y_offset, width: 100, height: 100}
    }
    setPixelMap(newPixelMap)
    }, [y_offset])

        const handleMouseDown = (key, e) => {
            const startX = e.clientX - pixelMap[key].x
            const startY = e.clientY - pixelMap[key].y 

        const handleMouseMove = (e) => {
            let new_x = e.clientX - startX
            let new_y = e.clientY - startY
            const rect = box.current.getBoundingClientRect();
            // console.log("rect = ", rect)

            if (fixed) {
                if (new_x < rect.x + total_padding) {
                    // console.log("left to far")
                    new_x = rect.x  - total_padding
                }
                
                if (new_y < rect.y + total_padding) {
                    // console.log("to top") 
                    new_y = rect.y - total_padding
                }

                if (new_x + pixelMap[key].width > rect.right - total_padding) {
                    // console.log("key", pixelMap[key])
                    // console.log("TOO RIGHT")
                    new_x = rect.right - pixelMap[key].width -  total_padding
                }

                if (new_y + pixelMap[key].height > rect.bottom - total_padding) {
                    // console.log("TOO DOWN")
                    new_y = rect.bottom - pixelMap[key].height - total_padding
                }
            }
            // console.log("EXACTLY RIGHT")







            setPixelMap(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    x: new_x,
                    y: new_y
                }
            }))
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <div 
        style={{padding: `${total_padding}px`}}
        className="flex justify-center items-center relative">
            <div className="h-full w-full rounded-xl relative caret-transparent">
                <div 
                ref={box}
                style={{
                    backgroundColor:`${color}`,
                    top: `${y_offset}px`
                }}
                className="bg-blue-200 h-[100px] w-full absolute">

                </div>



                {Object.entries(pixelMap).map(([key, position]) => (
                    <div 
                        key={key}
                        onMouseDown={(e) => handleMouseDown(key, e)}
                        className=" mb-2 rounded-xl flex 
                        font-bold items-center absolute cursor-move
                        caret-transparent cursor-pointer select-none
                        flex justify-center items-center p-3
                        "
                        
                        style={{
                            top: `${position.y}px`,
                            left: `${position.x}px`,
                            width: `${position.width}px`,
                            height: `${position.height}px`
                        }}
                    >
                        <div className="bg-white h-full w-full rounded-xl text-black items-center flex pl-2">
                            {key}
                        </div>
                        
                    </div>
                ))}





                
            </div>
        </div>
    )
}