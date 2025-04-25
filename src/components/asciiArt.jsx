import React from 'react'

export default function asciiArt({ asciiArt}) {
  return (
    <div className="bg-black rounded-xl w-full overflow-x-auto flex justify-center items-center px-4 lg:min-h-[900px] min-h-[600px] lg:max-h-[1100px] max-h-[800px]">
      <div
        style={{
          fontSize: "8px",
          fontFamily: "monospace",
          lineHeight: "1",
          whiteSpace: "pre",
        }}
      >
        {asciiArt.map((line, lineIndex) => (
          <div key={lineIndex} style={{ display: "flex" }}>
            {line.map((char, charIndex) => (
              <span
                key={`${lineIndex}-${charIndex}`}
                style={{ color: char.color }}
              >
                {char.char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
