import React from 'react'

export default function options({ asciiWidth, setAsciiWidth }) {
  const handleWidthChange = (e) => {
    setAsciiWidth(parseInt(e.target.value));
  };

  return (
    <div className="mt-8 w-full">
      <label htmlFor="ascii-width" className="block text-sm font-medium text-gray-700">
        Largeur en caractères :
      </label>
      <input
        type="range"
        id="ascii-width"
        min="40"
        max="120"
        value={asciiWidth}
        onChange={handleWidthChange}
        className="w-full mt-1"
      />
      <span className="text-sm text-gray-500">{asciiWidth} caractères</span>
    </div>
  )
}
