import React, { CSSProperties, useRef } from 'react'

interface ImageMagnifyProps {
  src: string
  width?: number
  height?: number
  magnificationFactor?: number
}

const ImageMagnify: React.FC<ImageMagnifyProps> = ({ src, width = 500, height = 500, magnificationFactor = 2 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (containerRef.current && imgRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top

      // Adjust transformOrigin to the cursor position
      imgRef.current.style.transformOrigin = `${x}px ${y}px`
      imgRef.current.style.transform = `scale(${magnificationFactor})`
    }
  }

  const handleMouseLeave = () => {
    if (imgRef.current) {
      imgRef.current.style.transform = 'scale(1)'
    }
  }

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    cursor: 'zoom-in'
  }

  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transition: 'transform 0.2s ease'
  }

  return (
    <div style={containerStyle} ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <img src={src} alt="Magnify Preview" style={imgStyle} ref={imgRef} draggable={false} />
    </div>
  )
}

export default ImageMagnify
