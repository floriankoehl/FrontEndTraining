import { useEffect, useRef } from "react"

export default function LineTo({ from, to, borderColor = "black", strokeWidth = 2 }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const drawLine = () => {
      const fromEl = document.getElementById(from)
      const toEl = document.getElementById(to)

      if (!fromEl || !toEl || !svgRef.current) return

      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()

      const x1 = fromRect.left + fromRect.width / 2
      const y1 = fromRect.top + fromRect.height / 2
      const x2 = toRect.left + toRect.width / 2
      const y2 = toRect.top + toRect.height / 2

      const svg = svgRef.current
      svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`)
      svg.style.position = "fixed"
      svg.style.top = "0"
      svg.style.left = "0"
      svg.style.pointerEvents = "none"
      svg.style.zIndex = "-1"

      svg.innerHTML = `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              stroke="${borderColor}" stroke-width="${strokeWidth}" />
      `
    }

    drawLine()
    window.addEventListener("scroll", drawLine)
    window.addEventListener("resize", drawLine)
    const interval = setInterval(drawLine, 100)

    return () => {
      window.removeEventListener("scroll", drawLine)
      window.removeEventListener("resize", drawLine)
      clearInterval(interval)
    }
  }, [from, to, borderColor, strokeWidth])

  return <svg ref={svgRef} />
}
