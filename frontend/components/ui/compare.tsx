"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CompareProps {
  firstImage?: string
  secondImage?: string
  firstImageClassName?: string
  secondImageClassname?: string
  className?: string
  slideMode?: "hover" | "click"
  firstContent?: React.ReactNode
  secondContent?: React.ReactNode
}

export const Compare = ({
  firstImage,
  secondImage,
  firstImageClassName,
  secondImageClassname,
  className,
  slideMode = "hover",
  firstContent,
  secondContent,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    if (slideMode === "hover" || isDragging) {
      const rect = sliderRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = (x / rect.width) * 100
      setSliderXPercent(Math.max(0, Math.min(100, percent)))
    }
  }

  const handleMouseDown = () => {
    if (slideMode === "click") {
      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp)
      return () => document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={sliderRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* First content/image */}
      <div className="absolute inset-0">
        {firstContent ? (
          firstContent
        ) : (
          <img
            src={firstImage || "/placeholder.svg"}
            alt="First"
            className={cn("h-full w-full object-cover", firstImageClassName)}
          />
        )}
      </div>

      {/* Second content/image with clip */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(${sliderXPercent}% 0%, 100% 0%, 100% 100%, ${sliderXPercent}% 100%)`,
        }}
      >
        {secondContent ? (
          secondContent
        ) : (
          <img
            src={secondImage || "/placeholder.svg"}
            alt="Second"
            className={cn("h-full w-full object-cover", secondImageClassname)}
          />
        )}
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
        style={{ left: `${sliderXPercent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
