

"use client"

import { useState, useEffect } from "react"

export default function HoverDescription({ description }: { description: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isToggled, setIsToggled] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  function handleClick() {
    if (isTouchDevice) {
      setIsToggled(!isToggled)
    }
  }

  // Hide full text if user clicks on it (mobile)
  function handleFullTextClick() {
    if (isTouchDevice) {
      setIsToggled(false)
    }
  }

  return (
    <div className="relative">
      <div
        className="cursor-help"
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Short text */}
        <p
          className={`text-sm text-gray-600 line-clamp-2 transition-opacity ${
            (isHovered || isToggled) ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {description}
        </p>

        {/* Desktop tooltip */}
        <div
          className={`absolute z-50 w-72 max-w-xs max-h-48 overflow-auto p-3 bg-white text-sm text-gray-700 border border-gray-200 shadow-lg rounded-md top-0 left-0 break-words transition-opacity
            ${isHovered && !isTouchDevice ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          {description}
        </div>

        {/* Full text on mobile tap */}
        {isToggled && isTouchDevice && (
          <div
            className="text-sm text-gray-700 border border-gray-200 rounded-md p-3 mt-1 max-h-48 overflow-auto break-words bg-white cursor-pointer"
            onClick={handleFullTextClick} // clicking full text hides it
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}
