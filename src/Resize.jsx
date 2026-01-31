import { useEffect, useRef, useState } from "react"

export default function Resize() {
  const [boxes, setBoxes] = useState({})
  const containerRef = useRef(null)

  const boxesRef = useRef({})
  const resizingRef = useRef(null)
  const resizeStartRef = useRef(null)


  // init boxes
  useEffect(() => {
    const b = {}
    for (let i = 0; i < 7; i++) {
      b[i] = { x: 100 * i, y: 80 * i, width: 100, height: 80 }
    }
    setBoxes(b)
  }, [])

  // keep ref in sync
  useEffect(() => {
    boxesRef.current = boxes
  }, [boxes])

  // hover detection
  const handleHover = (e) => {
    if (resizingRef.current !== null) return
    if (!e.ctrlKey || !containerRef.current) {
      document.body.style.cursor = "default"
      resizingRef.current = null
      return
    }
    

    const rect = containerRef.current.getBoundingClientRect()
    const boxes = boxesRef.current
    let hit = null

    for (let key in boxes) {
      const box = boxes[key]
      const right = box.x + box.width + rect.left
      const top = box.y + rect.top

      if (
        e.clientX > right - 10 &&
        e.clientX < right + 10 &&
        e.clientY > top &&
        e.clientY < top + box.height
      ) {
        hit = key
        break
      }
    }

    resizingRef.current = hit
    document.body.style.cursor = hit ? "e-resize" : "default"
  }

  // resize while dragging
  const handleResize = (e) => {
    const key = resizingRef.current
    if (key == null) return

    const { startX, startWidth } = resizeStartRef.current
    const dx = e.clientX - startX

    setBoxes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        width: Math.max(20, startWidth + dx),
      }
    }))
  }

  const handleDown = (e) => {
    if (!e.ctrlKey) {
      document.body.style.cursor = "default"
      resizingRef.current = null
      return
    }
    const key = resizingRef.current
    if (key == null) return

    const box = boxesRef.current[key]

    resizeStartRef.current = {
      startX: e.clientX,
      startWidth: box.width,
    }

    document.addEventListener("mousemove", handleResize)
  }


  const handleUp = () => {
    document.removeEventListener("mousemove", handleResize)
    resizingRef.current = null
    document.body.style.cursor = "default"
  }

  const handleKeyUp = (e) => {
    if (e.key !== "Control") return
    resizingRef.current = null
    document.body.style.cursor = "default"
    document.removeEventListener("mousemove", handleResize)
  }

  const handleWindowBlur = () => {
    resizingRef.current = null
    document.body.style.cursor = "default"
    document.removeEventListener("mousemove", handleResize)
  }



  const handleDrag = (e, key) => {
      const startX = e.clientX - boxes[key].x 
      const startY = e.clientY - boxes[key].y

        const onMouseMove = (e) => {
            if (e.ctrlKey) return 
            if (!e.shiftKey) return 


        console.log("NOW WE ARE TALKING")
        const containerBox = containerRef.current.getBoundingClientRect()
        const new_x = e.clientX - startX
        const new_y = e.clientY - startY

        setBoxes((prev)=>{
            return ({
                ...prev, 
                [key]: {
                    ...prev[key],
                    x: new_x,
                    y: new_y

                }
            })
        })



    }
    const onUp = () => {
        document.removeEventListener("mousemove",onMouseMove)
        document.removeEventListener("mouseup", onUp)
    }



    document.addEventListener("mousemove",onMouseMove)
    document.addEventListener("mouseup", onUp)
  }




  // attach global listeners once
  useEffect(() => {
    document.addEventListener("mousemove", handleHover)
    document.addEventListener("mousedown", handleDown)
    document.addEventListener("mouseup", handleUp)
    document.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      document.removeEventListener("mousemove", handleHover)
      document.removeEventListener("mousedown", handleDown)
      document.removeEventListener("mouseup", handleUp)
      document.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [])

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div
        ref={containerRef}
        className="relative w-[800px] h-[300px] bg-gray-200"
      >
        {Object.entries(boxes).map(([key, box]) => (
          <div
            key={key}
            onMouseDown={(e)=>{handleDrag(e, key)}}
            className="absolute bg-gray-400 select-none"
            style={{
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
            }}
          />
        ))}
      </div>
    </div>
  )
}
