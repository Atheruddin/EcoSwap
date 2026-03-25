"use client"

import { useEffect, useState } from "react"

interface CursorPosition {
  x: number
  y: number
}

export function CursorEffect() {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style.cursor === "pointer"
      setIsPointer(!!isClickable)
    }

    document.addEventListener("mousemove", updateCursorPosition)
    document.addEventListener("mouseover", updateCursorType)

    return () => {
      document.removeEventListener("mousemove", updateCursorPosition)
      document.removeEventListener("mouseover", updateCursorType)
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorPosition.x - 6,
          top: cursorPosition.y - 6,
          transform: `scale(${isPointer ? 1.5 : 1})`,
          transition: "transform 0.2s ease",
        }}
      >
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>

      {/* Trailing effect */}
      <div
        className="fixed pointer-events-none z-40 opacity-20"
        style={{
          left: cursorPosition.x - 20,
          top: cursorPosition.y - 20,
          transform: `scale(${isPointer ? 2 : 1})`,
          transition: "all 0.3s ease",
        }}
      >
        <div className="w-10 h-10 border border-emerald-400 rounded-full" />
      </div>
    </>
  )
}
