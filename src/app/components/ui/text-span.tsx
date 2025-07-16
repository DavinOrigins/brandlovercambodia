"use client"

import { useState, useEffect, useRef } from "react"

interface TextSlideshowProps {
  text: string
  className?: string
  lineClamp?: number
}

export default function TextSlideshow({ text, className = "", lineClamp = 2 }: TextSlideshowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isToggled, setIsToggled] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [repeatCount, setRepeatCount] = useState(3)
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    // Check if text is overflowing and calculate repeat count
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        // Create a temporary element to measure the full text width
        const tempElement = document.createElement("div")
        tempElement.style.position = "absolute"
        tempElement.style.visibility = "hidden"
        tempElement.style.whiteSpace = "nowrap"
        tempElement.style.fontSize = window.getComputedStyle(textRef.current).fontSize
        tempElement.style.fontFamily = window.getComputedStyle(textRef.current).fontFamily
        tempElement.style.fontWeight = window.getComputedStyle(textRef.current).fontWeight
        tempElement.textContent = text

        document.body.appendChild(tempElement)
        const textWidth = tempElement.offsetWidth
        document.body.removeChild(tempElement)

        const containerWidth = containerRef.current.offsetWidth
        const isTextOverflowing = textWidth > containerWidth

        setIsOverflowing(isTextOverflowing)

        if (isTextOverflowing) {
          const baseRepeat = Math.ceil((containerWidth * 2) / textWidth)
          setRepeatCount(Math.max(baseRepeat, 3))
        }
      }
    }

    checkOverflow()

    // Recheck on window resize
    const handleResize = () => {
      setTimeout(checkOverflow, 100)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [text])

  const handleClick = () => {
    if (isTouchDevice && isOverflowing) {
      setIsToggled(!isToggled)
    }
  }

  const handleMouseEnter = () => {
    if (!isTouchDevice && isOverflowing) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsHovered(false)
      setIsToggled(false) // Reset toggle on mouse leave
    }
  }

  const isActive = isHovered || isToggled

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isOverflowing ? "cursor-pointer" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {!isOverflowing || !isActive ? (
        // Show normal truncated text
        <div ref={textRef} className={`${className} ${lineClamp === 1 ? "line-clamp-1" : "line-clamp-2"}`}>
          {text}
        </div>
      ) : (
        // Show sliding text when active and overflowing
        <div className={`${className} overflow-hidden whitespace-nowrap`}>
          <div className="flex space-x-4 animate-text-scroll">
            {Array(repeatCount)
              .fill(text)
              .map((textItem, idx) => (
                <span key={`${textItem}-${idx}`} className="inline-block flex-shrink-0">
                  {textItem}
                </span>
              ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes text-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-text-scroll {
          display: flex;
          width: max-content;
          min-width: 200%;
          animation: text-scroll 15s linear infinite;
        }
      `}</style>
    </div>
  )
}
